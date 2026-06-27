package com.example.backend.user;

import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.repo.RoleRepository;
import com.example.backend.user.repo.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserModuleInit {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner initAdminUser(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            Role adminRole = roleRepository.findById(1).orElseGet(() -> {
                Role newRole = Role.builder().name("ADMIN").build();
                return roleRepository.save(newRole);
            });

            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User user = User.builder()
                        .fullName("Administrator")
                        .email("admin@gmail.com")
                        .passwordHash(passwordEncoder.encode("admin"))
                        .role(adminRole)
                        .isDeleted(false)
                        .build();

                userRepository.save(user);
                log.info("User Module: Khởi tạo thành công tài khoản Admin mặc định");
            }
        };
    }
}
