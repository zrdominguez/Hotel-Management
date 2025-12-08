import React, { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, Button } from '../components/common/FormElements';
import { Table, SearchBar, FilterChip } from '../components/common/TableComponents';
import { Badge } from '../components/common/FormElements';
import { Modal, Alert } from '../components/common/ModalComponents';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { mockReservations } from '../utils/mockData';

const ReservationsPage = () => {
  const { user, userRole } = useAuth();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter reservations based on user role
  const baseReservations = userRole === 'user' 
    ? mockReservations.filter((r) => r.userId === user?.id)
    : mockReservations;

  // Apply search and filters
  const filteredReservations = useMemo(() => {
    return baseReservations.filter((res) => {
      const matchesSearch = 
        res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.roomNumber.toString().includes(searchTerm);
      const matchesFilter = !filterStatus || res.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [baseReservations, searchTerm, filterStatus]);

  const columns = [
    { key: 'guestName', label: 'Guest Name' },
    { key: 'roomNumber', label: 'Room #' },
    { key: 'checkIn', label: 'Check-in' },
    { key: 'checkOut', label: 'Check-out' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'confirmed' ? 'green' : value === 'pending' ? 'yellow' : 'blue'}>
          {value.replace('_', ' ')}
        </Badge>
      )
    },
    {
      key: 'totalPrice',
      label: 'Total Price',
      render: (value) => `$${value}`
    },
  ];

  const handleEditReservation = (reservation) => {
    setEditingReservation(reservation);
    setShowModal(true);
  };

  const handleSaveReservation = () => {
    addToast('Reservation updated successfully!', 'success');
    setShowModal(false);
    setEditingReservation(null);
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reservations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {userRole === 'user' ? 'View and manage your reservations' : 'Search and manage all guest reservations'}
          </p>
        </div>

        {/* Modals */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by guest name or room number..."
              onClear={() => setSearchTerm('')}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-base"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
            </select>
          </div>

          {/* Active filters */}
          {(searchTerm || filterStatus) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <FilterChip 
                  label={`Search: "${searchTerm}"`}
                  onRemove={() => setSearchTerm('')}
                />
              )}
              {filterStatus && (
                <FilterChip 
                  label={`Status: ${filterStatus}`}
                  onRemove={() => setFilterStatus('')}
                />
              )}
            </div>
          )}
        </Card>

        {/* Table */}
        <Card>
          <Table
            columns={columns}
            data={filteredReservations}
            selectedRows={selectedRows}
            onRowSelect={userRole !== 'user' ? setSelectedRows : undefined}
            onRowClick={(row) => handleEditReservation(row)}
          />
        </Card>

        {/* Results info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredReservations.length} of {baseReservations.length} reservations
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingReservation(null);
          }}
          title="Reservation Details"
          size="lg"
        >
          {editingReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Guest Name</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{editingReservation.guestName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Room Number</label>
                  <p className="mt-1 text-gray-900 dark:text-white">#{editingReservation.roomNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Check-in</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{editingReservation.checkIn}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Check-out</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{editingReservation.checkOut}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <p className="mt-1">
                    <Badge variant={editingReservation.status === 'confirmed' ? 'green' : 'yellow'}>
                      {editingReservation.status.replace('_', ' ')}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Price</label>
                  <p className="mt-1 text-gray-900 dark:text-white">${editingReservation.totalPrice}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
                {userRole !== 'user' && (
                  <>
                    <Button
                      variant="success"
                      onClick={handleSaveReservation}
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal>
      </motion.div>
    </MainLayout>
  );
};

export default ReservationsPage;
