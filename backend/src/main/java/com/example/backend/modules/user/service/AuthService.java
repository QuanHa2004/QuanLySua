package com.example.backend.modules.user.service;

import com.example.backend.modules.user.event.UserRegisteredEvent;
import com.example.backend.modules.user.dto.request.LoginRequest;
import com.example.backend.modules.user.dto.request.RegisterRequest;
import com.example.backend.modules.user.dto.response.AuthResponse;
import com.example.backend.modules.user.entity.Role;
import com.example.backend.modules.user.entity.User;
import com.example.backend.modules.user.exception.AccountLockedException;
import com.example.backend.modules.user.repo.RoleRepository;
import com.example.backend.modules.user.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        User newUser = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isDeleted(false)
                .build();

        userRepository.save(newUser);

        eventPublisher.publishEvent(new UserRegisteredEvent(newUser.getId()));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Sai email hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Sai email hoặc mật khẩu");
        }

        if (user.getIsDeleted()) {
            throw new AccountLockedException("Tài khoản đã bị khóa");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(AuthResponse.UserDto.builder()
                        .roleId(user.getRole().getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .isDeleted(0)
                        .build())
                .build();
    }

    public Map<String, Object> getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        return Map.of(
                "email", user.getEmail(),
                "full_name", user.getFullName(),
                "role_id", user.getRole().getId(),
                "is_deleted", user.getIsDeleted() ? 1 : 0
        );
    }
}
