package com.example.backend.user.service;

// import các thư viện JWT và Security
import com.example.backend.user.UserRegisteredEvent;
import com.example.backend.user.dto.request.LoginRequest;
import com.example.backend.user.dto.request.RegisterRequest;
import com.example.backend.user.dto.response.AuthResponse;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.exception.AccountLockedException;
import com.example.backend.user.repo.RoleRepository;
import com.example.backend.user.repo.UserRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // Bạn sẽ cần tạo một service để gen Token
    private final ApplicationEventPublisher eventPublisher;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService,
                       ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.eventPublisher = eventPublisher;
    }

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

        // Bắn Event để module Cart biết và tạo giỏ hàng cho userId này
        eventPublisher.publishEvent(new UserRegisteredEvent(newUser.getId()));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Sai email hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Sai email hoặc mật khẩu");
        }

        // --- XỬ LÝ KHÓA TÀI KHOẢN (Frontend đang check status 403) ---
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
