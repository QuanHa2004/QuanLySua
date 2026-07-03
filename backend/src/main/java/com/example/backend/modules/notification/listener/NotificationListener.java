package com.example.backend.modules.notification.listener;

import com.example.backend.modules.notification.entity.Notification;
import com.example.backend.modules.notification.repo.NotificationRepository;
import com.example.backend.modules.notification.service.SseService;
import com.example.backend.modules.order.entity.Order;
import com.example.backend.modules.order.event.OrderCreatedEvent;
import com.example.backend.modules.order.event.OrderDeliveredEvent;
import com.example.backend.modules.order.event.OrderProcessingEvent;
import com.example.backend.modules.order.event.OrderShippedEvent;
import com.example.backend.modules.order.repo.OrderRepository;
import com.example.backend.modules.payment.event.TransactionFailedEvent;
import com.example.backend.modules.payment.event.TransactionSuccessEvent;
import com.example.backend.modules.shipping.event.DeliveryTimeCalculatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class NotificationListener {
    private final NotificationRepository notificationRepository;
    private final OrderRepository orderRepository;
    private final SseService sseService;

    @ApplicationModuleListener
    public void onOrderCreated(OrderCreatedEvent event) {
        Integer adminUserId = 3;

        String title = "Bạn có đơn hàng mới!";
        String content = "Hệ thống vừa nhận được đơn hàng mã số #" + event.orderId() +
                " từ khách hàng mang mã số #" + event.userId();

        Notification adminNoti = Notification.builder()
                .userId(adminUserId)
                .title(title)
                .content(content)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(adminNoti);

        sseService.sendNotificationRealtime(adminUserId, adminNoti);
    }

    @ApplicationModuleListener
    public void onOrderProcessing(OrderProcessingEvent event) {
        Integer customerUserId = event.userId();

        String title = "Đơn hàng của bạn đang được tiến hành xử lý!";
        String content = "Đơn hàng mã số #" + event.orderId();

        Notification customerNoti = Notification.builder()
                .userId(customerUserId)
                .title(title)
                .content(content)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(customerNoti);

        sseService.sendNotificationRealtime(customerUserId, customerNoti);
    }

    @ApplicationModuleListener
    public void onOrderShipped(OrderShippedEvent event) {
        try {
            // 1. Vì Event chỉ truyền qua Tọa độ và OrderId, chúng ta cần tìm Order trong DB để biết Đơn này của User nào
            Order order = orderRepository.findById(event.orderId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng mã #" + event.orderId()));

            Integer customerUserId = order.getUserId();

            // 2. Thiết lập tiêu đề và nội dung thông báo
            String title = "Đơn hàng đang trong quá trình giao!";
            String content = "Đơn hàng #" + event.orderId() + " đã được xuất kho và bàn giao cho bưu tá. ";

            // 3. Đóng gói Entity và lưu vào Database bảng notifications
            Notification customerNoti = Notification.builder()
                    .userId(customerUserId)
                    .title(title)
                    .content(content)
                    .read(false) // Mặc định chưa đọc
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(customerNoti);
            sseService.sendNotificationRealtime(customerUserId, customerNoti);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ApplicationModuleListener
    public void onOrderDelivered(OrderDeliveredEvent event) {
        Integer customerUserId = event.userId();
        String title = "Đơn hàng đã giao thành công 🎉";
        String content = "Đơn hàng mã số #" + event.orderId() +
                " đã được giao thành công đến bạn.";

        // 1. Lưu lịch sử thông báo vào Database
        Notification targetNoti = Notification.builder()
                .userId(customerUserId)
                .title(title)
                .content(content)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(targetNoti);

        sseService.sendNotificationRealtime(customerUserId, targetNoti);
    }

    @ApplicationModuleListener
    public void onTransactionSuccess(TransactionSuccessEvent event) {
        try {
            Order order = orderRepository.findById(event.orderId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng mã #" + event.orderId()));

            Integer customerUserId = order.getUserId();

            // Tạo thông báo cho Khách hàng
            Notification customerNoti = Notification.builder()
                    .userId(customerUserId)
                    .title("Thanh toán thành công đơn hàng #" + event.orderId() + " 🎉")
                    .content("Fresh Milk đã nhận được tiền thanh toán cho đơn hàng của bạn. " +
                            "Mã giao dịch: " + event.transactionNo() + ". Đơn hàng sẽ sớm được nhân viên xử lý.")
                    .read(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(customerNoti);

            // Đẩy Real-time xuống cho Khách hàng
            sseService.sendNotificationRealtime(customerUserId, customerNoti);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @ApplicationModuleListener
    public void onTransactionFailed(TransactionFailedEvent event) {

        try {
            Order order = orderRepository.findById(event.orderId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng mã #" + event.orderId()));

            Integer customerUserId = order.getUserId();

            // CHỈ tạo thông báo nhắc nhở cho Khách hàng để họ thử lại
            Notification customerNoti = Notification.builder()
                    .userId(customerUserId)
                    .title("Thanh toán không thành công ❌")
                    .content("Giao dịch thanh toán trực tuyến cho đơn hàng #" + event.orderId() + " đã bị hủy hoặc thất bại. " +
                            "Vui lòng kiểm tra lại số dư tài khoản hoặc thử lại với phương thức thanh toán khác.")
                    .read(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(customerNoti);

            // Đẩy Real-time xuống cho Khách hàng
            sseService.sendNotificationRealtime(customerUserId, customerNoti);

        } catch (Exception e) {
        }
    }
}
