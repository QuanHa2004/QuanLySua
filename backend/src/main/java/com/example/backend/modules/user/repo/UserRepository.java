package com.example.backend.modules.user.repo;

import com.example.backend.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    // Tìm kiếm User theo Email
    Optional<User> findByEmail(String email);

    // Kiểm tra xem Email đã tồn tại trong hệ thống chưa
    boolean existsByEmail(String email);

    // Bạn có thể thêm tìm kiếm theo Google ID nếu làm tính năng Social Login
    Optional<User> findByGoogleId(String googleId);
}
