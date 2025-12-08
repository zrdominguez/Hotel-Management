import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, Badge, Button, Input } from '../components/common/FormElements';
import { Modal } from '../components/common/ModalComponents';
import { useToast } from '../hooks/useToast';
import { mockRooms, mockReservations } from '../utils/mockData';

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const room = mockRooms.find((r) => r.id === roomId);

  if (!room) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Room Not Found</h1>
            <Button variant="primary" onClick={() => navigate('/browse-rooms')}>
              Back to Browse Rooms
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleBooking = () => {
    if (!checkInDate || !checkOutDate) {
      addToast('Please select both check-in and check-out dates', 'error');
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      addToast('Check-out date must be after check-in date', 'error');
      return;
    }

    // Check availability
    const isAvailable = !mockReservations.some((reservation) => {
      if (reservation.roomNumber !== room.number) return false;
      const resCheckIn = new Date(reservation.checkIn).getTime();
      const resCheckOut = new Date(reservation.checkOut).getTime();
      const newCheckIn = new Date(checkInDate).getTime();
      const newCheckOut = new Date(checkOutDate).getTime();
      
      return resCheckIn < newCheckOut && resCheckOut > newCheckIn;
    });

    if (!isAvailable) {
      addToast('Room is not available for selected dates', 'error');
      return;
    }

    addToast('Booking request submitted! Please complete payment to confirm.', 'success');
    setShowBookingModal(false);
    setCheckInDate('');
    setCheckOutDate('');
  };

  const nights = checkInDate && checkOutDate 
    ? Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
    : 0;
  const subtotal = nights * room.pricePerNight;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{room.type} Room</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Room #{room.number}</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/browse-rooms')}>
            ← Back to Browse
          </Button>
        </motion.div>

        {/* Room Image */}
        <motion.div variants={itemVariants} className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={room.image}
            alt={`${room.type} Room`}
            className="w-full h-96 object-cover"
          />
        </motion.div>

        {/* Room Info Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Description */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Experience the comfort of our {room.type} room, perfect for {room.capacity} guest{room.capacity !== 1 ? 's' : ''}. 
                This beautifully appointed room features modern amenities and elegant décor designed for your relaxation and convenience. 
                Enjoy stunning views, premium bedding, and state-of-the-art facilities that make your stay unforgettable.
              </p>
            </Card>

            {/* Room Features */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{room.capacity} Guests</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                    <p className="font-semibold text-gray-900 dark:text-white">${room.pricePerNight}/night</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Amenities */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-2xl">✨</span>
                    <span className="font-medium text-gray-900 dark:text-white">{amenity}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Booking */}
          <div>
            <Card className="sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Book This Room</h3>
              
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="text-center">
                  <Badge variant={room.status === 'available' ? 'green' : 'yellow'}>
                    {room.status === 'available' ? '✓ Available' : 'Currently Occupied'}
                  </Badge>
                </div>

                {/* Price Display */}
                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price per night</p>
                  <p className="text-3xl font-bold text-blue-600">${room.pricePerNight}</p>
                </div>

                {/* Booking Estimation */}
                {nights > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estimated total</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">${total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{nights} night{nights !== 1 ? 's' : ''} + tax</p>
                  </div>
                )}

                {/* Book Button */}
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowBookingModal(true)}
                >
                  Book Now 🛏️
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </motion.div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book Room"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Check-in Date
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="input-base"
            />
          </div>

          {/* Booking Summary */}
          {nights > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{nights} night{nights !== 1 ? 's' : ''}</span>
                <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 text-red-500"
              
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleBooking}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default RoomDetailsPage;
