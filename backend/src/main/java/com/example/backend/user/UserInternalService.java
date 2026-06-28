package com.example.backend.user;

import com.example.backend.product.ProductResponse;

public interface UserInternalService {
    Integer getUserIdByEmail(String email);
}