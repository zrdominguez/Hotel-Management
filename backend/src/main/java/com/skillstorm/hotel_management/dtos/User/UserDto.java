package com.skillstorm.hotel_management.dtos.User;

import java.util.List;

public record UserDto(
    String email,
    String password,
    String firstName,
    String lastName,
    List<String> roles,
    String phoneNumber,
    String language,
    boolean newsLetter,
    boolean notifications
) {
    public UserDto {
        roles = roles == null || roles.isEmpty() ? List.of("ROLE_GUEST") : roles;
        language = language == null ? "en" : language;
    }
}
