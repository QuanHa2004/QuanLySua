package com.example.backend.modules.user.service;

import com.example.backend.modules.user.api.UserInternalService;
import com.example.backend.modules.user.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserInternalServiceImpl implements UserInternalService {

    private final UserRepository userRepository;

    @Override
    public Integer getUserIdByEmail(String email) {
        return userRepository.findByEmail(email).get().getId();
    }
}
