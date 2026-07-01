package com.example.backend.modules.user.controller.admin;

import com.example.backend.modules.user.dto.request.UpdateStatusUserRequest;
import com.example.backend.modules.user.dto.response.UserResponse;
import com.example.backend.modules.user.service.admin.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {

        List<UserResponse> users = adminUserService.getAllUsers();

        return ResponseEntity.ok(Map.of("data", users));
    }

    @PutMapping("/status")
    public ResponseEntity<?> updateUserStatus(@RequestBody UpdateStatusUserRequest request) {
        try {

            adminUserService.updateUserStatus(request);
            return ResponseEntity.ok(Map.of("success", true, "message", "Cập nhật trạng thái thành công"));
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
