package com.example.backend.user.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    @JsonProperty("user_id")
    private Integer userId;

    @JsonProperty("full_name")
    private String fullName;

    private String email;
    private String phone;
    private String address;

    @JsonProperty("is_deleted")
    private Integer isDeleted; // Trả về 1 (Đã khóa) hoặc 0 (Hoạt động)
}