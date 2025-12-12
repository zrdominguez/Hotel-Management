package com.skillstorm.hotel_management.dtos.Room;

import java.util.List;

public record EditRoomDto(
    String type,
    Double pricePerNight,
    String description,
    Integer maxCapacity,
    String bedType,
    Integer size,
    List<String> amenities,
    List<String> images,
    Boolean isAvailable,
    String status
) {
    
}
