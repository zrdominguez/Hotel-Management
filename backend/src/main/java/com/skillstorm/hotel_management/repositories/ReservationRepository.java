package com.skillstorm.hotel_management.repositories;

import com.skillstorm.hotel_management.models.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    // Optional: you can add custom queries later, e.g.,
    // List<Reservation> findByRoomNumber(int roomNumber);
}
