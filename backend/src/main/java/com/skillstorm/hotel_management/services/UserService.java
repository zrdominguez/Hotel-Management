package com.skillstorm.hotel_management.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.skillstorm.hotel_management.dtos.User.EditProfileUserDto;
import com.skillstorm.hotel_management.dtos.User.UserDto;
import com.skillstorm.hotel_management.models.User;
import com.skillstorm.hotel_management.repositories.UserRepository;

/**
 * Service for managing users.
 */
@Service
public class UserService {
    
    /**
     * Repository for managing users.
     */
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get all users.
     * @return a list of all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get all employees.
     * @return a list of all employees
     */
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRolesContaining(role);
    }

    /**
     * Get a user by their email.
     * @param email the email of the user to retrieve
     * @return the user with the specified email, or null if not found
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }


    /**
     * Create a new user.
     * @param userDto the DTO containing the user information
     * @return the created user
     * @throws IllegalArgumentException if a user with the specified email already exists
     */
    public User createUser(UserDto userDto) throws IllegalArgumentException {
        Optional<User> exists = userRepository.findByEmail(userDto.email());
        if (exists.isPresent()) {
            throw new IllegalArgumentException("User with email " + userDto.email() + " already exists");
        }
        Map<String, Object> preferences = new HashMap<>();
        
        preferences.putAll(Map.of(
            "language", userDto.language(),
            "newsLetter", userDto.newsLetter(),
            "notifications", userDto.notifications()
        ));
        
        User user = new User(userDto.email(), userDto.password(), userDto.firstName(), userDto.lastName(), userDto.phoneNumber(), userDto.roles(), preferences);
        
        return userRepository.save(user);
    }

    /**
     * Edit a user's profile.
     * @param id the ID of the user to edit
     * @param editProfileUserDto the DTO containing the updated user information
     * @return the updated user
     * @throws IllegalArgumentException if the user with the specified ID is not found
     */
    public User editUserProfile(String id, EditProfileUserDto editProfileUserDto) throws IllegalArgumentException {
        
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setFirstName(editProfileUserDto.firstName() != null ? editProfileUserDto.firstName() : user.getFirstName());
            user.setLastName(editProfileUserDto.lastName() != null ? editProfileUserDto.lastName() : user.getLastName());
            user.setPhoneNumber(editProfileUserDto.phoneNumber() != null ? editProfileUserDto.phoneNumber() : user.getPhoneNumber());
            
            // Map<String, Object> preferences = user.getPreferences();
            // preferences.put("language", editProfileUserDto.language() != null ? editProfileUserDto.language() : preferences.get("language"));
            // preferences.put("newsLetter", editProfileUserDto.newsLetter() != editProfileUserDto.newsLetter() ?  
            // preferences.put("notifications", editProfileUserDto.notifications() != null ? editProfileUserDto.notifications() : preferences.get("notifications"));
            // user.setPreferences(preferences);
            
            return userRepository.save(user);
        } else {
            throw new IllegalArgumentException("User with id " + id + " not found");
        }
    }

    /**
     * Delete a user by their ID.
     * @param id the ID of the user to delete
     * @throws IllegalArgumentException if the user with the specified ID is not found
     */
    public void deleteUser(String id) throws IllegalArgumentException {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            userRepository.delete(userOptional.get());
        } else {
            throw new IllegalArgumentException("User with id " + id + " not found");
        }
    }
}