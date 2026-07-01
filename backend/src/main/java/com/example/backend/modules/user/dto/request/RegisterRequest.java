package com.example.backend.modules.user.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @JsonProperty("full_name")
    @NotBlank(message = "Tên không được để trống")
    @Pattern(regexp = "^[^\\d]+$", message = "Tên không được chứa số")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0")
    private String phone;

    private String address;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải nhiều hơn 5 ký tự")
    private String password;

    @JsonProperty("role_id")
    private Integer roleId;
}
