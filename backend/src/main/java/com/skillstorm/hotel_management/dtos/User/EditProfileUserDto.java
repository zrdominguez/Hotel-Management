package com.skillstorm.hotel_management.dtos.User;

public record EditProfileUserDto(String firstName, String lastName, String phoneNumber, String language, boolean newsLetter, boolean notifications) {
    
}
