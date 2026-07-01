package com.example.backend.modules.product.listener;

import com.example.backend.modules.order.api.OrderInternalService;
import com.example.backend.modules.order.api.OrderItemSnapshot;
import com.example.backend.modules.order.event.OrderProcessingEvent;
import com.example.backend.modules.product.repo.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class Product_OrderProcessingListener {
    private final ProductRepository productRepository;
    private final OrderInternalService orderInternalService;

    @ApplicationModuleListener
    public void deductInventoryOnOrderProcessing(OrderProcessingEvent event) {
        List<OrderItemSnapshot> itemsToDeduct = orderInternalService.getOrderItems(event.orderId());

        for (OrderItemSnapshot item : itemsToDeduct) {

            int rowsAffected = productRepository.deductQuantity(item.getProductId(), item.getQuantity());

            if (rowsAffected == 0) {
                throw new RuntimeException("Sản phẩm ID " + item.getProductId() + " đã hết hàng hoặc không đủ số lượng!");
            }
        }
    }
}
