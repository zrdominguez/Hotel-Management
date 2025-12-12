package com.skillstorm.hotel_management.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.hotel_management.dtos.User.EditProfileUserDto;
import com.skillstorm.hotel_management.dtos.User.UserDto;
import com.skillstorm.hotel_management.models.User;
import com.skillstorm.hotel_management.services.UserService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;





/**
 * Controller for managing users.
 */
@RestController
@RequestMapping("/users")
public class UserController {
    
    /**
     * Service for managing users.
     */
    UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
    * Get all users.
    * @return a list of all users
    */
    @GetMapping("all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    /**
    * Get a user by their email.
    * @param email the email of the user to retrieve
    * @return the user with the specified email, or a 404 if not found
    */
    @GetMapping
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
    * Get all users by their role.
    * @param role the role of the users to retrieve
    * @return a list of users with the specified role
    */

    // uncomment if you want to restrict access to managers and admins
    //@PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping("/role")
    public ResponseEntity<List<User>> getUserByRole(@RequestParam String role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    /**
    * Get all guests.
    * @return a list of users with the role "ROLE_GUEST"
    */
    //@PreAuthorize("hasAnyRole('MANAGER','ADMIN', 'EMPLOYEE')")
    @GetMapping("/guests")
    public ResponseEntity<List<User>> getGuests() {
        List<User> guests = userService.getUsersByRole("ROLE_GUEST");
        return ResponseEntity.ok(guests);
    }
    
    /**
     * Create a new user.
     * @param userDto the DTO containing the user information
     * @return the created user
     */
    @PostMapping("new")
    public ResponseEntity<User> createUser(@RequestBody UserDto userDto) {
        User createdUser = userService.createUser(userDto);
        return ResponseEntity.ok(createdUser);
    }

    /**
     * Edit a user's profile.
     * @param id the ID of the user to edit
     * @param editProfileUserDto the DTO containing the updated user information
     * @return the updated user
     */
    @PutMapping("edit/{id}")
    public ResponseEntity<User> editUserProfile(@PathVariable String id, @RequestBody EditProfileUserDto editProfileUserDto) {
        return ResponseEntity.ok(userService.editUserProfile(id, editProfileUserDto));
    }

    /**
     * Delete a user by their ID.
     * @param id the ID of the user to delete
     * @return a response entity with no content
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
