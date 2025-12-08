import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, Badge, Button } from '../components/common/FormElements';
import { mockReservations, mockRooms } from '../utils/mockData';

const ReservationDetailsPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const reservation = mockReservations.find(r => r.id === reservationId);
  const room = mockRooms.find(r => r.number === reservation?.roomNumber);

  if (!reservation || !room) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reservation Not Found</h1>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
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

  const nights = Math.ceil(
    (new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24)
  );
  const pricePerNight = room.pricePerNight;
  const subtotal = nights * pricePerNight;
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reservation Details</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Reservation ID: {reservationId}</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </motion.div>

        {/* Room Image Banner */}
        <motion.div variants={itemVariants} className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={room.image}
            alt={`${room.type} Room`}
            className="w-full h-96 object-cover"
          />
        </motion.div>

        {/* Reservation Status Banner */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Room #{room.number}</h2>
              <p className="text-blue-100">{room.type} Room • Capacity: {room.capacity} guests</p>
            </div>
            <Badge variant={reservation.status === 'confirmed' ? 'green' : reservation.status === 'pending' ? 'yellow' : 'blue'}>
              {reservation.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Reservation & Guest Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reservation Timeline */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stay Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Check-in</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{reservation.checkIn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Check-out</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{reservation.checkOut}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Length of Stay</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                </div>
              </div>
            </Card>

            {/* Guest Information */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Guest Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Guest Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{reservation.guestName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Room Number</p>
                  <p className="font-semibold text-gray-900 dark:text-white">#{room.number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{room.capacity} Guests</p>
                </div>
              </div>
            </Card>

            {/* Room Description */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Description</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Room Type</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{room.type}</p>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Experience the comfort of our {room.type} room, perfect for {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}. 
                  Enjoy modern amenities and elegant décor designed for your relaxation and convenience.
                </p>
              </div>
            </Card>

            {/* Amenities */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Amenities</h3>
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

          {/* Right Column - Pricing */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Rate per night</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${pricePerNight.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Quick Info */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛏️</span>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Room Type</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{room.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Max Guests</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{room.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔑</span>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Room Status</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">{room.status}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default ReservationDetailsPage;
