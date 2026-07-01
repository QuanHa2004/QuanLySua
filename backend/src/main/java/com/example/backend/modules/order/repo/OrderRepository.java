package com.example.backend.modules.order.repo;

import com.example.backend.modules.order.entity.Order;
import com.example.backend.modules.order.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    // Tùy chọn: Dùng khi muốn sắp xếp đơn hàng mới nhất lên đầu (Rất tốt cho trang quản trị)
    List<Order> findAllByOrderByOrderDateDesc();

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Order o SET o.status = :newStatus " +
            "WHERE o.status = :currentStatus AND o.deliveryDate <= CURRENT_TIMESTAMP")
    int autoUpdateDeliveredStatus(
            @Param("newStatus") OrderStatus newStatus,
            @Param("currentStatus") OrderStatus currentStatus
    );
}
