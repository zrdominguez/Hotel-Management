import React, { useState, useMemo } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, Button } from '../components/common/FormElements';
import { Table, SearchBar, FilterChip } from '../components/common/TableComponents';
import { Badge } from '../components/common/FormElements';
import { Modal, Alert } from '../components/common/ModalComponents';
import { useToast } from '../hooks/useToast';
import { mockRooms } from '../utils/mockData';

const RoomsPage = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredRooms = useMemo(() => {
    return mockRooms.filter((room) => {
      const matchesSearch = 
        room.number.toString().includes(searchTerm) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !filterType || room.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterType]);

  const roomTypes = [...new Set(mockRooms.map((r) => r.type))];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rooms</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage hotel rooms and availability</p>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by room number or type..."
              onClear={() => setSearchTerm('')}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-base"
            >
              <option value="">All Types</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Active filters */}
          {(searchTerm || filterType) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <FilterChip 
                  label={`Search: "${searchTerm}"`}
                  onRemove={() => setSearchTerm('')}
                />
              )}
              {filterType && (
                <FilterChip 
                  label={`Type: ${filterType}`}
                  onRemove={() => setFilterType('')}
                />
              )}
            </div>
          )}
        </Card>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="card-hover" onClick={() => {
              setSelectedRoom(room);
              setShowModal(true);
            }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Room #{room.number}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{room.type}</p>
                </div>
                <Badge variant={room.status === 'available' ? 'green' : 'blue'}>
                  {room.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Capacity</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{room.capacity} guests</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Price</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">${room.pricePerNight}/night</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <Button variant="primary" size="sm" className="w-full">
                View Details
              </Button>
            </Card>
          ))}
        </div>

        {/* Room Details Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRoom(null);
          }}
          title={`Room #${selectedRoom?.number} Details`}
          size="lg"
        >
          {selectedRoom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedRoom.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <p className="mt-1">
                    <Badge variant={selectedRoom.status === 'available' ? 'green' : 'blue'}>
                      {selectedRoom.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedRoom.capacity} guests</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price per Night</label>
                  <p className="mt-1 text-gray-900 dark:text-white">${selectedRoom.pricePerNight}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amenities</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((amenity, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => {
                  addToast('Room updated successfully!', 'success');
                }}>
                  Update Room
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default RoomsPage;
