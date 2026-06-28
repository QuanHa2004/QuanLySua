package com.example.backend.modules.user.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UpdateStatusUserRequest {
    @JsonProperty("user_id")
    private Integer userId;

    @JsonProperty("is_deleted")
    private Integer isDeleted;
}
