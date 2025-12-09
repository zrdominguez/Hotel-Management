package com.skillstorm.hotel_management.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.hotel_management.dtos.EmailRequest;
import com.skillstorm.hotel_management.models.User;
import com.skillstorm.hotel_management.services.UserService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/users")
public class UserController {
    
    UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    

    @PostMapping
    public ResponseEntity<User> getUserByEmail(@RequestBody EmailRequest eRequest) {
        User user = userService.getUserByEmail(eRequest.email());
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}
