package com.example.backend.modules.user.service;

import com.example.backend.modules.user.dto.request.UpdateStatusUserRequest;
import com.example.backend.modules.user.dto.response.UserResponse;
import com.example.backend.modules.user.entity.User;
import com.example.backend.modules.user.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Lấy toàn bộ danh sách người dùng (có thể loại trừ tài khoản Admin nếu muốn)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserResponse.builder()
                        .userId(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .address(user.getAddress())
                        // Đổi từ Boolean sang Integer (1/0) cho Frontend
                        .isDeleted(user.getIsDeleted() ? 1 : 0)
                        .build())
                .toList();
    }

    // Cập nhật trạng thái khóa/mở khóa
    @Transactional
    public void updateUserStatus(UpdateStatusUserRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Chuyển ngược lại từ Integer (1/0) của Frontend thành Boolean
        user.setIsDeleted(request.getIsDeleted() == 1);

        userRepository.save(user);
    }
}
