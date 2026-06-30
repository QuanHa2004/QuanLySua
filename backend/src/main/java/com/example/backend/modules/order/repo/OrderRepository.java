package com.example.backend.modules.order.repo;

import com.example.backend.modules.order.api.OrderItemSnapshot;
import com.example.backend.modules.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    // Tùy chọn: Dùng khi muốn sắp xếp đơn hàng mới nhất lên đầu (Rất tốt cho trang quản trị)
    List<Order> findAllByOrderByOrderDateDesc();


}
