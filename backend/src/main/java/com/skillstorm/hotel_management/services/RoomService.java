package com.skillstorm.hotel_management.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.skillstorm.hotel_management.dtos.Room.EditRoomDto;
import com.skillstorm.hotel_management.dtos.Room.RoomDto;
import com.skillstorm.hotel_management.models.Room;
import com.skillstorm.hotel_management.repositories.RoomRepository;


/**
* Service class for managing rooms.
*/
@Service
public class RoomService {

    /**
    * The repository for accessing room data.
    */
    private final RoomRepository roomRepository;    
    
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    /**
    * Service method to get all rooms
    * @return a list of all rooms
    */
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    /**
    * Service method to get a room by its ID
    * @param id the ID of the room
    * @return the room with the specified ID
    * @throws IllegalArgumentException if the room is not found
    */
    public Room getRoomById(String id) throws IllegalArgumentException {
        return roomRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Room not found"));
    }

    /**
    * Service method to get a room by its number
    * @param roomNumber the number of the room
    * @return the room with the specified number
    * @throws IllegalArgumentException if the room is not found
    */
    public Room getRoomByNumber(String roomNumber) throws IllegalArgumentException {
        return roomRepository.findByRoomNumber(roomNumber).orElseThrow(() -> new IllegalArgumentException("Room not found"));
    }

    /**
    * Service method to create a new room
    * @param roomDto the data transfer object containing room details
    * @return the newly created room
    * @throws IllegalArgumentException if a room with the same number already exists
    */
    public Room createRoom(RoomDto roomDto) throws IllegalArgumentException {
        
        // Check if a room with the same number already exists
        Optional<Room> existRoom = roomRepository.findByRoomNumber(roomDto.roomNumber());
        if (existRoom.isPresent()) {
            throw new IllegalArgumentException("Room with this number already exists");
        }

        // Create a new room
        Room room = new Room(
            roomDto.roomNumber(),
            roomDto.type(),
            roomDto.description(),
            roomDto.pricePerNight(),
            roomDto.maxCapacity(),
            roomDto.bedType(),
            roomDto.size(),
            roomDto.floor(),
            roomDto.amenities(),
            roomDto.images(),
            true,
            "AVAILABLE"
        );

        // Save the new room to the repository
        return roomRepository.save(room);
    }

    /**
     * Service method to edit an existing room
     * @param id the ID of the room to edit
     * @param editRoomDto the data transfer object containing the updated room details
     * @return the updated room
     * @throws IllegalArgumentException if the room is not found
     */
    public Room editRoom(String id, EditRoomDto editRoomDto) throws IllegalArgumentException {
        // Find the room by ID or throw an exception if not found
        Room room = roomRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        
        /*  
            Update the room's fields if the corresponding values in the DTO are not null 
            If null, keep the existing value 
        */
        room.setType(editRoomDto.type() != null ? editRoomDto.type() : room.getType());
        room.setPricePerNight(editRoomDto.pricePerNight() != null ? editRoomDto.pricePerNight() : room.getPricePerNight());
        room.setDescription(editRoomDto.description() != null ? editRoomDto.description() : room.getDescription());
        room.setMaxCapacity(editRoomDto.maxCapacity() != null ? editRoomDto.maxCapacity() : room.getMaxCapacity());
        room.setBedType(editRoomDto.bedType() != null ? editRoomDto.bedType() : room.getBedType());
        room.setSize(editRoomDto.size() != null ? editRoomDto.size() : room.getSize());
        room.setAmenities(editRoomDto.amenities() != null ? editRoomDto.amenities() : room.getAmenities());
        room.setImages(editRoomDto.images() != null ? editRoomDto.images() : room.getImages());
        room.setAvailable(editRoomDto.isAvailable() != null ? editRoomDto.isAvailable() : room.isAvailable());
        room.setStatus(editRoomDto.status() != null ? editRoomDto.status() : room.getStatus());
        
        return roomRepository.save(room);
    }

    /**
    * Service method to delete a room by its ID
    * @param id the ID of the room to delete
    * @throws IllegalArgumentException if the room is not found
    */
    public void deleteRoom(String id) throws IllegalArgumentException {
        Room room = roomRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        roomRepository.delete(room);
    }

}