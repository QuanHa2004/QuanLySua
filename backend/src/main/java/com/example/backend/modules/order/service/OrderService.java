package com.example.backend.modules.order.service;

import com.example.backend.modules.cart.api.CartInternalService;
import com.example.backend.modules.cart.api.CartItemSnapshot;
import com.example.backend.modules.order.dto.response.AdminOrderResponse;
import com.example.backend.modules.order.dto.response.CheckoutResponse;
import com.example.backend.modules.order.dto.resquest.CheckoutRequest;
import com.example.backend.modules.order.entity.Order;
import com.example.backend.modules.order.entity.OrderDetail;
import com.example.backend.modules.order.enums.OrderStatus;
import com.example.backend.modules.order.event.OrderCreatedEvent;
import com.example.backend.modules.order.event.OrderProcessingEvent;
import com.example.backend.modules.order.repo.OrderDetailRepository;
import com.example.backend.modules.order.repo.OrderRepository;
import com.example.backend.modules.payment.api.PaymentInternalService;
import com.example.backend.modules.payment.dto.response.PaymentLinkResponse;
import com.example.backend.modules.payment.enums.PaymentMethod;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final PaymentInternalService paymentInternalService;
    private final CartInternalService cartInternalService;
    private final ApplicationEventPublisher eventPublisher;

    public List<AdminOrderResponse> getAllOrdersForAdmin() {
        // Lấy danh sách đơn hàng, sắp xếp mới nhất lên đầu
        List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc();

        return orders.stream().map(order -> {

            // 1. Chuyển đổi Enum thành String chữ thường để Frontend React đọc được màu sắc
            // Ví dụ: PROCESSING -> "processing"
            String statusString = order.getStatus() != null
                    ? order.getStatus().name().toLowerCase()
                    : "pending";

            // 2. Map dữ liệu trực tiếp vào DTO (Không cần query sang module User)
            return AdminOrderResponse.builder()
                    .orderId(order.getId())
                    .fullName(order.getFullName()) // Lấy trực tiếp từ bảng Order
                    .phone(order.getPhone())       // Lấy trực tiếp từ bảng Order
                    .orderDate(order.getOrderDate())
                    .totalAmount(order.getTotalAmount())
                    .status(statusString)
                    .build();
        }).toList();
    }


    @Transactional(rollbackFor = Exception.class)
    public CheckoutResponse checkout(Integer userId, CheckoutRequest request, String ipAddress) {

        // 1. Lấy danh sách CHI TIẾT các sản phẩm đang được chọn từ Cart Module
        List<CartItemSnapshot> cartItems = cartInternalService.getCheckedItemsSnapshot(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống hoặc chưa chọn sản phẩm nào!");
        }

        // Tự động tính tổng tiền từ danh sách item (không cần gọi hàm tính tổng cũ nữa cho đỡ tốn 1 lần query)
        BigDecimal totalAmount = cartItems.stream()
                .map(CartItemSnapshot::getTotalItemAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Lưu đơn hàng vào Database với trạng thái mặc định là PENDING
        Order order = new Order();
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.PENDING);

        order.setFullName(request.getFullName());
        order.setPhone(request.getPhone());
        order.setDeliveryAddress(request.getDeliveryAddress());

        // Lưu Order để lấy ID tự tăng
        order = orderRepository.save(order);

        final Order savedOrder = order;

        List<OrderDetail> orderDetails = cartItems.stream().map(item ->
                OrderDetail.builder()
                        .order(savedOrder) // Gắn khóa ngoại liên kết về Order gốc
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .totalItemAmount(item.getTotalItemAmount())
                        .build()
        ).toList();

        // Dùng saveAll để chèn nhiều dòng cùng lúc (Batch Insert), tối ưu hơn rất nhiều so với lưu trong vòng lặp for
        orderDetailRepository.saveAll(orderDetails);

        eventPublisher.publishEvent(new OrderCreatedEvent(order.getId(), userId));

        // 3. Xử lý điều hướng thanh toán
        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {

            // Gọi sang cổng API của module Payment
            PaymentLinkResponse paymentLinkResponse = paymentInternalService.createVNPayUrl(
                    order.getId(),
                    totalAmount,
                    ipAddress
            );

            // Đóng gói URL trả về cho Frontend
            return CheckoutResponse.builder()
                    .orderId(order.getId())
                    .paymentUrl(paymentLinkResponse.getPaymentUrl())
                    .build();
        }

        // 4. Nếu là thanh toán COD, chỉ trả về mã đơn hàng
        return CheckoutResponse.builder()
                .orderId(order.getId())
                .build();
    }

    @Transactional(rollbackFor = Exception.class)
    public void confirmCodOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Chỉ cho phép duyệt nếu đơn đang là PENDING và là thanh toán COD
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể xác nhận đơn hàng đang ở trạng thái Chờ xác nhận!");
        }

        if (order.getPaymentMethod() != PaymentMethod.COD) {
            throw new RuntimeException("Hàm này chỉ dành cho việc xác nhận đơn COD!");
        }

        // 1. Chuyển trạng thái sang PROCESSING
        order.setStatus(OrderStatus.PROCESSING);
        orderRepository.save(order);

        // 2. PHÁT SỰ KIỆN để trừ kho và dọn giỏ hàng
        eventPublisher.publishEvent(new OrderProcessingEvent(order.getId(), order.getUserId()));
    }
}
