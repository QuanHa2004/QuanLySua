package com.example.backend.user.repo;

import com.example.backend.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    // Mặc định JpaRepository đã có hàm findById(Integer id) rồi
    // Nên nếu bạn chỉ dùng Role ID (như trong AuthService), bạn không cần viết thêm gì ở đây cả.

    // Tuy nhiên, để linh hoạt, bạn có thể thêm hàm tìm theo tên role (VD: "CUSTOMER", "ADMIN")
    Optional<Role> findByName(String name);
}
