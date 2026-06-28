package com.example.backend.user.service;

import com.example.backend.product.ProductInternalService;
import com.example.backend.product.ProductResponse;
import com.example.backend.product.entity.Product;
import com.example.backend.product.repo.ProductRepository;
import com.example.backend.user.UserInternalService;
import com.example.backend.user.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserInternalServiceImpl implements UserInternalService {

    private final UserRepository userRepository;

    public Integer getUserIdByEmail(String email){
        return userRepository.findByEmail(email).get().getId();
    };
}
