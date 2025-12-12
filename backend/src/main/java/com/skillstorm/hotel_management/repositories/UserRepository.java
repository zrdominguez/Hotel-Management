package com.skillstorm.hotel_management.repositories;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.skillstorm.hotel_management.models.User;
import java.util.List;


public interface UserRepository extends MongoRepository<User, String> {
    
    // Find a user by their email
    Optional<User> findByEmail(String email);

    // Find users by their roles
    List<User> findByRolesContaining(String role);
}
