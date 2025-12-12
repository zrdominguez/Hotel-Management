package com.skillstorm.hotel_management.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Document(collection = "rooms")
public class Room {
	@Id
	private String id;
    
	private String roomNumber;
	private String type;
	private String description;
	private double pricePerNight;
	private int maxCapacity;
	private String bedType;
	private int size;
	private int floor;
	private List<String> amenities;
	private List<String> images;
	private boolean isAvailable;
	private String status;
	
	@CreatedDate
	private Date createdAt;
	@LastModifiedDate
	private Date updatedAt;
	
	//constructors
	public Room(String roomNumber, String type, String description, double pricePerNight, int maxCapacity,
			String bedType, int size, int floor, List<String> amenities, List<String> images, boolean isAvailable,
			String status) {
		this.roomNumber = roomNumber;
		this.type = type;
		this.description = description;
		this.pricePerNight = pricePerNight;
		this.maxCapacity = maxCapacity;
		this.bedType = bedType;
		this.size = size;
		this.floor = floor;
		this.amenities = amenities;
		this.images = images;
		this.isAvailable = isAvailable;
		this.status = status;
	}

	public Room(){}

    // Getters and setters
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }

	public String getRoomNumber() { return roomNumber; }
	public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

	public String getType() { return type; }
	public void setType(String type) { this.type = type; }

	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }

	public double getPricePerNight() { return pricePerNight; }
	public void setPricePerNight(double pricePerNight) { this.pricePerNight = pricePerNight; }

	public int getMaxCapacity() { return maxCapacity; }
	public void setMaxCapacity(int maxCapacity) { this.maxCapacity = maxCapacity; }

	public String getBedType() { return bedType; }
	public void setBedType(String bedType) { this.bedType = bedType; }

	public int getSize() { return size; }
	public void setSize(int size) { this.size = size; }

	public int getFloor() { return floor; }
	public void setFloor(int floor) { this.floor = floor; }

	public List<String> getAmenities() { return amenities; }
	public void setAmenities(List<String> amenities) { this.amenities = amenities; }

	public List<String> getImages() { return images; }
	public void setImages(List<String> images) { this.images = images; }

	public boolean isAvailable() { return isAvailable; }
	public void setAvailable(boolean available) { isAvailable = available; }

	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }

	public Date getCreatedAt() { return createdAt; }
	public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

	public Date getUpdatedAt() { return updatedAt; }
	public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
