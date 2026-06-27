package com.example.backend.user.controller;

import com.example.backend.user.dto.request.LoginRequest;
import com.example.backend.user.dto.request.RegisterRequest;
import com.example.backend.user.dto.response.AuthResponse;
import com.example.backend.user.exception.AccountLockedException;
import com.example.backend.user.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping()
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            // FE mong đợi res.ok nếu thành công, không cần data cụ thể
            return ResponseEntity.ok(Map.of("message", "Đăng ký thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (AccountLockedException e) {
            // Đảm bảo trả đúng mã 403 Forbidden cho FE
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // FE dùng API này sau khi đăng nhập Google thành công
    @GetMapping("/current_user")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String bearerToken) {
        // Trong thực tế, bạn sẽ parse token này hoặc lấy user từ SecurityContextHolder
        // User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Code minh họa mock trả về:
        return ResponseEntity.ok(Map.of(
                "is_deleted", 0,
                "role_id", 2, // Lấy từ DB
                "email", "user@example.com"
        ));
    }
}
