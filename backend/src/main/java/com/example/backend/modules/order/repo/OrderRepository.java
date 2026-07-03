package com.example.backend.modules.order.repo;

import com.example.backend.modules.order.entity.Order;
import com.example.backend.modules.order.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findAllByOrderByOrderDateDesc();

    List<Order> findByUserIdOrderByOrderDateDesc(Integer userId);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.deliveryDate <= :now")
    List<Order> findShippedOrdersPastDeliveryDate(
            @Param("status") OrderStatus status,
            @Param("now") LocalDateTime now
    );
}
