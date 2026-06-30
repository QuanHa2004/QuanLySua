package com.example.backend.modules.order.repo;

import com.example.backend.modules.order.api.OrderItemSnapshot;
import com.example.backend.modules.order.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderItemSnapshot> findOrderItemsByOrderId(Integer orderId);
}
