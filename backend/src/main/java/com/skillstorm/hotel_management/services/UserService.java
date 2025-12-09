package com.skillstorm.hotel_management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.skillstorm.hotel_management.models.User;
import com.skillstorm.hotel_management.repositories.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
