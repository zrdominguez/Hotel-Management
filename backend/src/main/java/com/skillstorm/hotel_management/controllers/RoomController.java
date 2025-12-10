package com.skillstorm.hotel_management.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.hotel_management.dtos.EditRoomDto;
import com.skillstorm.hotel_management.dtos.RoomDto;
import com.skillstorm.hotel_management.models.Room;
import com.skillstorm.hotel_management.services.RoomService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



/**
* Controller class for managing rooms.
*/
@RestController
@RequestMapping("/rooms")
public class RoomController {
    
    /**
    * The service for managing rooms.
    */
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }   
    
    /**
    * Get all rooms.
    * @return a list of all rooms
    */
    @GetMapping("all")
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    /**
    * Get a room by its ID.
    * @param id the ID of the room
    * @return the room with the specified ID
    */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable String id) {
        try {
            Room room = roomService.getRoomById(id);
            return ResponseEntity.ok(room);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Unexpected error: " + e.getMessage());
        }
    }

    /**
    * Get a room by its number.
    * @param roomNumber the number of the room
    * @return the room with the specified number
    */  
    @GetMapping("/number/{roomNumber}")
    public ResponseEntity<Room> getRoomByNumber(@PathVariable String roomNumber) {
        try {
            Room room = roomService.getRoomByNumber(roomNumber);
            return ResponseEntity.ok(room);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
    
    /**
    * Create a new room.
    * @param roomDto the data transfer object containing room details
    * @return the newly created room
    */
    @PostMapping("/new")
    public ResponseEntity<?> createRoom(@RequestBody RoomDto roomDto) {
        try {
            Room room = roomService.createRoom(roomDto);
            return ResponseEntity.ok(room);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Unexpected error: " + e.getMessage());
        }
    }
    
    /**
    * Edit an existing room.
    * @param id the ID of the room to edit
    * @param editRoomDto the data transfer object containing the updated room details
    * @return the updated room
    */
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> EditRoom(@PathVariable String id, @RequestBody EditRoomDto editRoomDto) {
        try {
            Room room = roomService.editRoom(id, editRoomDto);
            return ResponseEntity.ok(room);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Unexpected error: " + e.getMessage());
        }
    }
    
    /**
    * Delete a room by its ID.
    * @param id the ID of the room to delete
    * @return a response indicating the result of the deletion
    */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable String id) {
        try {
            roomService.deleteRoom(id);
            return ResponseEntity.ok("Room deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Unexpected error: " + e.getMessage());
        }
    }

}