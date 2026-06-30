package com.example.backend.modules.product.listener;

import com.example.backend.modules.order.api.OrderInternalService;
import com.example.backend.modules.order.api.OrderItemSnapshot;
import com.example.backend.modules.order.event.OrderProcessingEvent;
import com.example.backend.modules.product.repo.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class Product_OrderProcessingListener {
    private final ProductRepository productRepository;
    private final OrderInternalService orderInternalService; // Cầu nối sang module Order

    @ApplicationModuleListener
    public void deductInventoryOnOrderProcessing(OrderProcessingEvent event) {
        log.info("➔ [Product Module] Bắt đầu trừ kho cho đơn hàng ID: {}", event.orderId());

        // 1. Gọi sang module Order để lấy danh sách sản phẩm cần trừ
        List<OrderItemSnapshot> itemsToDeduct = orderInternalService.getOrderItems(event.orderId());

        // 2. Vòng lặp trừ kho an toàn
        for (OrderItemSnapshot item : itemsToDeduct) {

            // Gọi câu lệnh UPDATE dưới DB. rowsAffected là số dòng bị thay đổi
            int rowsAffected = productRepository.deductQuantity(item.getProductId(), item.getQuantity());

            // 3. Nếu rowsAffected = 0, nghĩa là không tìm thấy SP hoặc số lượng tồn không đủ
            if (rowsAffected == 0) {
                log.error("❌ Lỗi trừ kho: Sản phẩm ID {} không đủ số lượng (Khách mua: {})",
                        item.getProductId(), item.getQuantity());

                // Ném Exception sẽ làm rollback toàn bộ Transaction hiện tại.
                // Event này sẽ bị đánh dấu là FAILED trong bảng event_publication
                throw new RuntimeException("Sản phẩm ID " + item.getProductId() + " đã hết hàng hoặc không đủ số lượng!");
            }
        }

        log.info("➔ [Product Module] Trừ kho thành công cho đơn hàng ID: {}", event.orderId());
    }
}
