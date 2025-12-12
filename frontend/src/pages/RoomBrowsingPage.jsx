import React, { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, Badge, Button, Input } from '../components/common/FormElements';
import { mockRooms, mockReservations } from '../utils/mockData';

const RoomBrowsingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [roomType, setRoomType] = useState('');

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

  // Check if a room is available for the selected dates
  const isRoomAvailable = (roomNumber, checkIn, checkOut) => {
    if (!checkIn || !checkOut) return true; // If no dates selected, show all rooms
    
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();

    return !mockReservations.some((reservation) => {
      if (reservation.roomNumber !== roomNumber) return false;
      const resCheckIn = new Date(reservation.checkIn).getTime();
      const resCheckOut = new Date(reservation.checkOut).getTime();
      
      // Check for date overlap
      return resCheckIn < checkOutTime && resCheckOut > checkInTime;
    });
  };

  // Filter and search rooms
  const filteredRooms = useMemo(() => {
    return mockRooms.filter((room) => {
      // Search filter
      const matchesSearch = room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           room.number.toString().includes(searchTerm) ||
                           room.amenities.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));

      // Price filter
      const matchesPrice = room.pricePerNight >= minPrice && room.pricePerNight <= maxPrice;

      // Capacity filter
      const matchesCapacity = capacity === 0 || room.capacity >= capacity;

      // Room type filter
      const matchesType = roomType === '' || room.type === roomType;

      // Availability filter
      const matchesAvailability = isRoomAvailable(room.number, checkInDate, checkOutDate);

      return matchesSearch && matchesPrice && matchesCapacity && matchesType && matchesAvailability;
    });
  }, [searchTerm, minPrice, maxPrice, capacity, roomType, checkInDate, checkOutDate]);

  const roomTypes = ['Standard', 'Deluxe', 'Suite'];
  const maxRoomPrice = Math.max(...mockRooms.map((r) => r.pricePerNight));

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Browse Rooms 🏨
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Find the perfect room for your stay
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={itemVariants}>
          <Input
            placeholder="Search by room type, amenities, or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Check-in Date */}
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

          {/* Check-out Date */}
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

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="input-base"
            >
              <option value="">All Types</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Guests
            </label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="input-base"
            >
              <option value={0}>Any Capacity</option>
              <option value={2}>2 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={6}>6+ Guests</option>
            </select>
          </div>
        </motion.div>

        {/* Price Range Filter */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price Range per Night</h3>
            <span className="text-lg font-bold text-blue-600">
              ${minPrice} - ${maxPrice}
            </span>
          </div>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max={maxRoomPrice}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max={maxRoomPrice}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div variants={itemVariants} className="text-gray-600 dark:text-gray-400">
          {filteredRooms.length === 0 ? (
            <p className="text-lg">No rooms match your criteria. Try adjusting your filters.</p>
          ) : (
            <p className="text-lg">
              Found <span className="font-bold text-blue-600">{filteredRooms.length}</span> available room{filteredRooms.length !== 1 ? 's' : ''}
            </p>
          )}
        </motion.div>

        {/* Room Cards Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ translateY: -4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/room/${room.id}`)}
            >
              {/* Room Image */}
              <div className="relative overflow-hidden bg-gray-200 h-48">
                <img
                  src={room.image}
                  alt={`${room.type} Room`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <Badge variant={room.status === 'available' ? 'green' : 'yellow'} className="absolute top-4 right-4">
                  {room.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Room Info */}
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {room.type} Room
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">#{room.number}</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">${room.pricePerNight}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">per night</p>
                </div>

                {/* Capacity */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">👥</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Up to {room.capacity} guest{room.capacity !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Amenities Preview */}
                <div className="flex flex-wrap gap-1">
                  {room.amenities.slice(0, 3).map((amenity, idx) => (
                    <Badge key={idx} variant="blue">
                      {amenity}
                    </Badge>
                  ))}
                  {room.amenities.length > 3 && (
                    <Badge variant="gray">+{room.amenities.length - 3} more</Badge>
                  )}
                </div>

                {/* View Details Button */}
                <Button variant="primary" className="w-full" onClick={() => navigate(`/room/${room.id}`)}>
                  View Details →
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results Message */}
        {filteredRooms.length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No rooms available matching your search
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm('');
                setMinPrice(0);
                setMaxPrice(maxRoomPrice);
                setCheckInDate('');
                setCheckOutDate('');
                setCapacity(0);
                setRoomType('');
              }}
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default RoomBrowsingPage;
