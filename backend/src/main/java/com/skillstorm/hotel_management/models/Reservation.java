package com.skillstorm.hotel_management.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "reservations")
public class Reservation {

    @Id
    private String id;

    private String userId;        // matches mock data
    private String guestName;     // matches mock data
    private int roomNumber;       // integer room number
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;        // e.g., 'confirmed', 'checked_in', 'pending'
    private double totalPrice;

    public Reservation() {}

    public Reservation(String userId, String guestName, int roomNumber, LocalDate checkIn,
                       LocalDate checkOut, String status, double totalPrice) {
        this.userId = userId;
        this.guestName = guestName;
        this.roomNumber = roomNumber;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
        this.totalPrice = totalPrice;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public int getRoomNumber() { return roomNumber; }
    public void setRoomNumber(int roomNumber) { this.roomNumber = roomNumber; }

    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }

    public LocalDate getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
}
