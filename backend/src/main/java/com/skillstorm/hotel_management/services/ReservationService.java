package com.skillstorm.hotel_management.services;

import com.skillstorm.hotel_management.models.Reservation;
import com.skillstorm.hotel_management.repositories.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(String id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with id: " + id));
    }

    public Reservation createReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public Reservation updateReservation(String id, Reservation updated) {
        Reservation existing = getReservationById(id);
        existing.setGuestName(updated.getGuestName());
        existing.setRoomNumber(updated.getRoomNumber());
        existing.setCheckIn(updated.getCheckIn());
        existing.setCheckOut(updated.getCheckOut());
        existing.setStatus(updated.getStatus());
        existing.setTotalPrice(updated.getTotalPrice());
        return reservationRepository.save(existing);
    }

    public void deleteReservation(String id) {
        reservationRepository.deleteById(id);
    }
}
