package com.example.backend.modules.order.service;

import com.example.backend.modules.order.api.OrderInternalService;
import com.example.backend.modules.order.api.OrderItemSnapshot;
import com.example.backend.modules.order.repo.OrderDetailRepository;
import com.example.backend.modules.order.repo.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderInternalServiceImpl implements OrderInternalService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    public Integer getUserIdByOrderId(Integer orderId) {
        return orderRepository.findById(orderId).get().getUserId();
    }

    public List<OrderItemSnapshot> getOrderItems(Integer orderId){
        return orderDetailRepository.findOrderItemsByOrderId(orderId);
    }
}
