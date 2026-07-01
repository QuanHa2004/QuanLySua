package com.example.backend.modules.order.service.customer;

import com.example.backend.modules.cart.api.CartInternalService;
import com.example.backend.modules.cart.api.CartItemSnapshot;
import com.example.backend.modules.order.api.OrderItemSnapshot;
import com.example.backend.modules.order.dto.response.CheckoutResponse;
import com.example.backend.modules.order.dto.response.OrderDetailResponse;
import com.example.backend.modules.order.dto.resquest.CheckoutRequest;
import com.example.backend.modules.order.entity.Order;
import com.example.backend.modules.order.entity.OrderDetail;
import com.example.backend.modules.order.enums.OrderStatus;
import com.example.backend.modules.order.event.OrderCreatedEvent;
import com.example.backend.modules.order.repo.OrderDetailRepository;
import com.example.backend.modules.order.repo.OrderRepository;
import com.example.backend.modules.payment.api.PaymentInternalService;
import com.example.backend.modules.payment.dto.response.PaymentLinkResponse;
import com.example.backend.modules.payment.enums.PaymentMethod;
import com.example.backend.modules.user.api.UserInternalService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerOrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final PaymentInternalService paymentInternalService;
    private final CartInternalService cartInternalService;
    private final ApplicationEventPublisher eventPublisher;
    private final UserInternalService userInternalService;

    @Transactional(rollbackFor = Exception.class)
    public CheckoutResponse checkout(Integer userId, CheckoutRequest request, String ipAddress) {

        List<CartItemSnapshot> cartItems = cartInternalService.getCheckedItemsSnapshot(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống hoặc chưa chọn sản phẩm nào!");
        }

        BigDecimal totalAmount = cartItems.stream()
                .map(CartItemSnapshot::getTotalItemAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.PENDING);
        order.setFullName(request.getFullName());
        order.setPhone(request.getPhone());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setCustomerLng(request.getCustomerLng());
        order.setCustomerLat(request.getCustomerLat());

        order = orderRepository.save(order);

        final Order savedOrder = order;

        List<OrderDetail> orderDetails = cartItems.stream().map(item ->
                OrderDetail.builder()
                        .order(savedOrder)
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .totalItemAmount(item.getTotalItemAmount())
                        .build()
        ).toList();

        orderDetailRepository.saveAll(orderDetails);

        eventPublisher.publishEvent(new OrderCreatedEvent(order.getId(), userId));

        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {

            PaymentLinkResponse paymentLinkResponse = paymentInternalService.createVNPayUrl(
                    order.getId(),
                    totalAmount,
                    ipAddress
            );

            return CheckoutResponse.builder()
                    .orderId(order.getId())
                    .paymentUrl(paymentLinkResponse.getPaymentUrl())
                    .build();
        }

        return CheckoutResponse.builder()
                .orderId(order.getId())
                .build();
    }


    public List<OrderDetailResponse> getOrderHistory(Integer userId) {

        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy");

        return orders.stream().map(order ->
                OrderDetailResponse.builder()
                        .orderId(order.getId())
                        .orderDate(order.getOrderDate() != null ? order.getOrderDate().format(formatter) : "")
                        .status(translateStatusToVietnamese(order.getStatus()))
                        .totalAmount(order.getTotalAmount())
                        .build()
        ).toList();
    }

    public OrderDetailResponse getOrderDetail(Integer userId, Integer orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng mã #" + orderId));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền truy cập vào đơn hàng này!");
        }

        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);

        List<OrderItemSnapshot> itemDtos = details.stream().map(detail ->
                OrderItemSnapshot.builder()
                        .productId(detail.getProductId())
                        .productName(detail.getProductName())
                        .price(detail.getPrice())
                        .quantity(detail.getQuantity())
                        .totalItemAmount(detail.getTotalItemAmount())
                        .build()
        ).toList();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy");

        return OrderDetailResponse.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate() != null ? order.getOrderDate().format(formatter) : "")
                .status(translateStatusToVietnamese(order.getStatus()))
                .paymentMethod(order.getPaymentMethod().name())
                .fullName(order.getFullName())
                .phone(order.getPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .totalAmount(order.getTotalAmount())
                .items(itemDtos)
                .build();
    }

    private String translateStatusToVietnamese(OrderStatus status) {
        if (status == null) return "Không xác định";
        return switch (status) {
            case PENDING -> "Chờ xử lý";
            case PROCESSING -> "Đang xử lý";
            case SHIPPING -> "Đang giao";
            case DELIVERED -> "Đã giao";
            case CANCELLED -> "Đã hủy";
            default -> "Không xác định";
        };
    }

    public Integer getCurrentUserId() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userInternalService.getUserIdByEmail(email);
    }

    public String getClientIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }

        if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
            ipAddress = "127.0.0.1";
        }

        if (ipAddress != null && ipAddress.length() > 15 && ipAddress.indexOf(",") > 0) {
            ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
        }
        return ipAddress;
    }
}
