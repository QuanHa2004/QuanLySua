package com.example.backend.user.service;

import com.example.backend.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    // 1. Tạo Access Token từ thông tin User
    public String generateAccessToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role_id", user.getRole().getId());
        extraClaims.put("full_name", user.getFullName());

        return buildToken(extraClaims, user.getEmail(), accessTokenExpiration);
    }

    // 2. Tạo Refresh Token (chỉ cần định danh email, không cần chứa nhiều claims)
    public String generateRefreshToken(User user) {
        return buildToken(new HashMap<>(), user.getEmail(), refreshTokenExpiration);
    }

    // Hàm dùng chung để xây dựng cấu trúc Token
    private String buildToken(Map<String, Object> extraClaims, String subject, long expiration) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject) // Lưu email vào trường 'sub' của JWT
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 3. Trích xuất Email (Subject) từ Token
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 4. Kiểm tra xem Token có hợp lệ với User không
    public boolean isTokenValid(String token, String userEmail) {
        final String email = extractEmail(token);
        return (email.equals(userEmail)) && !isTokenExpired(token);
    }

    // Kiểm tra Token đã hết hạn chưa
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Hàm generic giúp giải mã và lấy một trường Claim cụ thể
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Giải mã toàn bộ thông tin bên trong Token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Chuyển đổi chuỗi Secret Key dạng Hex thành đối tượng Key mã hóa
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
