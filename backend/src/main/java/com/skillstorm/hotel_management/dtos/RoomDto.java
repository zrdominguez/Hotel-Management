package com.skillstorm.hotel_management.dtos;

import java.util.List;

public record RoomDto(
    String roomNumber, 
    String type, 
    Double pricePerNight,
    String description,
    Integer maxCapacity,
    String bedType,
    Integer size,
    Integer floor,
    List<String> amenities,
    List<String> images
) {
    public RoomDto {
        type = (type == null) ? "STANDARD" : type;
        size = (size == null || size <= 0) ? 250 : size;
        maxCapacity = (maxCapacity == null || maxCapacity <= 0) ? 2 : maxCapacity;
        pricePerNight = (pricePerNight == null || pricePerNight <= 0) ? 129.99 : pricePerNight;
        bedType = (bedType == null) ? "QUEEN" : bedType;
        description = (description == null) ? "No description" : description; 
    }
}
