package com.backend.mapper;

import com.backend.dto.UserDTO;
import com.backend.model.User;
import com.backend.model.constance.Role;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        if (user == null) return null;
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getRole().name().toLowerCase()
        );
    }

    public static User fromDTO(UserDTO dto) {
        return new User(
                dto.getId(),
                dto.getFirstName(),
                dto.getLastName(),
                Role.valueOf(dto.getRole().toUpperCase())
        );
    }
}
