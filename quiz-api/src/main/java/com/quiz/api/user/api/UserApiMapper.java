package com.quiz.api.user.api;

import com.quiz.api.user.api.dto.UserDTO;
import com.quiz.api.user.domain.User;

public final class UserApiMapper {
    private UserApiMapper() { }

    public static UserDTO toDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        return dto;
    }
}
