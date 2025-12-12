package com.skillstorm.hotel_management.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillstorm.hotel_management.models.Room;

import java.util.List;
import java.util.Optional;


public interface RoomRepository extends MongoRepository <Room, String> {
    
    //find room by room number
    Optional<Room> findByRoomNumber(String roomNumber);

    //find a list of rooms by type
    List<Room> findByType(String type);
    
    //find a list of rooms by amenities
    List<Room> findRoomByAmenities(List<String> amenities); 
}
