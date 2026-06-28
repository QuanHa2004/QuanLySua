package com.example.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF (Bắt buộc khi làm việc với REST API + JWT)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Cấu hình CORS inline siêu gọn cho ReactJS
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:3000"));
                    config.setAllowedMethods(List.of("*")); // Cho phép mọi method (GET, POST, PUT...)
                    config.setAllowedHeaders(List.of("*")); // Cho phép mọi header
                    return config;
                }))

                // 3. Phân quyền các Endpoints
                .authorizeHttpRequests(auth -> auth
                        // Cấu hình dựa trên API Frontend thực tế của bạn
                        .requestMatchers("/register", "/login", "/auth/**", "/customer/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("Admin")
                        .anyRequest().authenticated()
                )

                // 4. Cấu hình OAuth2 Resource Server xử lý JWT
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthConverter()))
                );

        return http.build();
    }

    // Bean JwtDecoder: Chỉ cho Spring cách giải mã Token bằng Secret Key của bạn
    @Bean
    public JwtDecoder jwtDecoder() {
        // Do lúc tạo token (JwtService), chúng ta đã dùng Base64 decode,
        // nên khi giải mã cũng phải chuyển đổi tương tự để khớp key.
        byte[] bytes = io.jsonwebtoken.io.Decoders.BASE64.decode(jwtSecret);
        SecretKeySpec secretKeySpec = new SecretKeySpec(bytes, "HmacSHA256");

        return NimbusJwtDecoder.withSecretKey(secretKeySpec).build();
    }

    // 5. Cấu hình chuyển đổi Claim trong JWT thành Quyền (Role) của Spring Security
    private JwtAuthenticationConverter jwtAuthConverter() {
        JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();

        // Theo mặc định Spring thêm tiền tố "SCOPE_", ta đổi nó thành "ROLE_" để dùng được .hasRole("ADMIN")
        converter.setAuthorityPrefix("ROLE_");

        // Trỏ vào claim "role" mà ta đã add vào Token lúc Login
        converter.setAuthoritiesClaimName("role");

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(converter);
        return jwtConverter;
    }
}