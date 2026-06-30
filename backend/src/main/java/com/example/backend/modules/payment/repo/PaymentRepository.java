package com.example.backend.modules.payment.repo;

import com.example.backend.modules.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
