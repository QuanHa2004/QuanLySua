package com.example.backend.modules.user.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    private UserDto user;

    @Data
    @Builder
    public static class UserDto {
        @JsonProperty("role_id")
        private Integer roleId;
        private String email;
        private String fullName;
        @JsonProperty("is_deleted")
        private Integer isDeleted; // Trả về 1 (true) hoặc 0 (false) để FE xử lý
    }
}