package com.example.backend.modules.user.controller.admin;

import com.example.backend.modules.user.dto.request.UpdateStatusUserRequest;
import com.example.backend.modules.user.dto.response.UserResponse;
import com.example.backend.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    // API GET: http://localhost:8080/admin/users
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        // Bọc trong object "data" khớp với logic setRows(json.data) của FE
        return ResponseEntity.ok(Map.of("data", users));
    }

    // API PUT: http://localhost:8080/admin/users/status
    @PutMapping("/status")
    public ResponseEntity<?> updateUserStatus(@RequestBody UpdateStatusUserRequest request) {
        try {
            userService.updateUserStatus(request);
            // Trả về success: true để FE xác nhận cập nhật thành công
            return ResponseEntity.ok(Map.of("success", true, "message", "Cập nhật trạng thái thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
