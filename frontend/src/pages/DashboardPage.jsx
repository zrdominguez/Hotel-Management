import React, { useMemo, useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, Badge, Button, Input } from '../components/common/FormElements';
import { Modal, ConfirmDialog } from '../components/common/ModalComponents';
import { Table } from '../components/common/TableComponents';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  mockReservations,
  mockRooms,
  mockEmployees,
  calculateOccupancyRate,
  generateMockOccupancyData,
  generateMockRevenueData,
} from '../utils/mockData';

// Calculate occupancy rate
// const calculateOccupancyRate = (reservations, rooms) => {
//   if (!rooms.length) return 0;
//   const occupied = reservations.filter(r => r.status === 'confirmed').length;
//   return Math.round((occupied / rooms.length) * 100);
// };

const DashboardPage = () => {
  const { user, userRole } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);
  // const [occupancyData, setOccupancyData] = useState([]);
  // const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const occupancyData = useMemo(() => generateMockOccupancyData(), []);
  const revenueData = useMemo(() => generateMockRevenueData(), []);
  //const occupancyRate = calculateOccupancyRate(reservations, rooms);
  const occupancyRate = calculateOccupancyRate();



   // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [reservationsRes, roomsRes/*, employeesRes, statsRes */] = await Promise.all([
          
          fetch("http://localhost:8081/reservations/all"),
          fetch("http://localhost:8081/rooms/all"),
          //fetch("http://localhost:8081/employees/all"),
          //fetch("http://localhost:8081/stats/all"),,
        ]);

        if (!reservationsRes.ok || !roomsRes.ok /*|| !employeesRes.ok || !statsRes.ok*/) {
          throw new Error('Failed to fetch data');
        }

        const reservationsData = await reservationsRes.json();
        const roomsData = await roomsRes.json();
        // const employeesData = await employeesRes.json();
        //const statsData = await statsRes.json();

        setReservations(reservationsData);
        setRooms(roomsData);
        //setEmployees(employeesData);
        //setOccupancyData(statsData.occupancy);
        //setRevenueData(statsData.revenue);
      } catch (err) {
        console.error(err);
        addToast('Error fetching data from server', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast]);

  // Stat cards
  const stats = {
    user: [
      {
        label: 'Active Reservations',
        value: mockReservations.filter((r) => r.userId === user?.id).length,
        icon: '🏨',
        color: 'blue',
      },
      {
        label: 'Upcoming Check-ins',
        value: mockReservations.filter((r) => r.status === 'confirmed').length,
        icon: '📅',
        color: 'green',
      },
    ],
    employee: [
      {
        label: 'Total Reservations',
        value: mockReservations.length,
        icon: '📋',
        color: 'blue',
      },
      {
        label: 'Occupancy Rate',
        value: `${occupancyRate}%`,
        icon: '📊',
        color: 'green',
      },
      {
        label: 'Rooms Available',
        value: mockRooms.filter((r) => r.status === 'available').length,
        icon: '🔑',
        color: 'yellow',
      },
    ],
    admin: [
      {
        label: 'Total Reservations',
        value: mockReservations.length,
        icon: '📋',
        color: 'blue',
      },
      {
        label: 'Occupancy Rate',
        value: `${occupancyRate}%`,
        icon: '📊',
        color: 'green',
      },
      {
        label: 'Rooms Available',
        value: mockRooms.filter((r) => r.status === 'available').length,
        icon: '🔑',
        color: 'yellow',
      },
      {
        label: 'Total Employees',
        value: mockEmployees.length,
        icon: '👥',
        color: 'purple',
      },
    ],
  };

  const currentStats = stats[userRole] || stats.user;

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

  // Get reservations by status
  // eslint-disable-next-line no-unused-vars
  const getReservationsByStatus = () => {
    const now = new Date();
    const past = reservations.filter(r => new Date(r.checkOut) < now);
    const current = reservations.filter(r => new Date(r.checkIn) <= now && new Date(r.checkOut) >= now);
    const future = reservations.filter(r => new Date(r.checkIn) > now);
    return { past, current, future };
  };

  // Reservation Dropdown Component
  const ReservationDropdown = ({ title, reservations: dropdownReservations, categoryKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(dropdownReservations.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedReservations = dropdownReservations.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{title}</span>
            <Badge variant={categoryKey === 'past' ? 'gray' : categoryKey === 'current' ? 'green' : 'blue'}>
              {dropdownReservations.length}
            </Badge>
          </div>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
            {dropdownReservations.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No {categoryKey} reservations</p>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedReservations.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => navigate(`/reservation/${res.id}`)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Room #{res.roomNumber}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{res.checkIn} to {res.checkOut}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{res.roomType}</p>
                        </div>
                        <Badge variant={res.status === 'confirmed' ? 'green' : res.status === 'pending' ? 'yellow' : 'blue'}>
                          {res.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      ←
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  if (userRole === 'user') {
    return (
      <MainLayout>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Welcome */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Browse and book rooms for your next stay
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ translateY: -4 }}
              className="card-hover"
              onClick={() => navigate('/browse-rooms')}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Reservations</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {mockReservations.filter(r => {
                      const now = new Date();
                      return new Date(r.checkIn) <= now && new Date(r.checkOut) >= now;
                    }).length}
                  </p>
                </div>
                <span className="text-4xl">🏨</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ translateY: -4 }}
              className="card-hover"
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">All Reservations</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {mockReservations.length}
                  </p>
                </div>
                <span className="text-4xl">📋</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Room Browsing Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Rooms</h2>
                <Button variant="primary" onClick={() => navigate('/browse-rooms')}>
                  Browse All Rooms →
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Looking for your next stay? Browse our collection of rooms with advanced search and filtering options to find the perfect accommodation for your needs.
              </p>
            </Card>
          </motion.div>

          {/* Featured Rooms Preview */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.slice(0, 3).map((room) => (
              <motion.div
                key={room.roomNumber}
                whileHover={{ translateY: -4 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/room/${room.roomNumber}`)}
              >
                {/* <div className="relative overflow-hidden bg-gray-200 h-40">
                  <img
                    src={room.image}
                    alt={`${room.type} Room`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div> */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{room.type}</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">${room.pricePerNight}/night</p>
                  <Button variant="primary" className="w-full mt-3" onClick={() => navigate(`/room/${room.roomNumber}`)}>
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {userRole === 'employee'
              ? 'Manage reservations and check room availability.'
              : 'Full system overview and employee management.'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentStats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ translateY: -4 }}
              className="card-hover cursor-pointer"
              onClick={() => {
                if (stat.label === 'Total Reservations' && (userRole === 'employee' || userRole === 'admin')) {
                  setShowReservationModal(true);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reservations Management Modal */}
        <Modal
          isOpen={showReservationModal}
          onClose={() => {
            setShowReservationModal(false);
            setSearchTerm('');
            setCurrentPage(1);
          }}
          title="Manage Reservations"
          size="2xl"
        >
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Search Bar */}
            <div className="mb-4">
              <Input
                placeholder="Search by room number, guest name, or status..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Add Button */}
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => {
                setSelectedReservation(null);
                setConfirmAction('create');
                setShowConfirmDialog(true);
              }}>
                ➕ Add Reservation
              </Button>
            </div>

            {/* Filtered and Paginated Reservations Table */}
            {(() => {
              const filtered = reservations.filter(res =>
                res.roomNumber.toString().includes(searchTerm.toLowerCase()) ||
                res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.status.toLowerCase().includes(searchTerm.toLowerCase())
              );
              
              const totalPages = Math.ceil(filtered.length / itemsPerPage);
              const startIndex = (currentPage - 1) * itemsPerPage;
              const paginatedReservations = filtered.slice(startIndex, startIndex + itemsPerPage);

              return (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Guest</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Room</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Check-in</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Check-out</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedReservations.map((res) => (
                          <tr key={res.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3">{res.guestName}</td>
                            <td className="px-4 py-3">#{res.roomNumber}</td>
                            <td className="px-4 py-3 text-xs">{res.checkIn}</td>
                            <td className="px-4 py-3 text-xs">{res.checkOut}</td>
                            <td className="px-4 py-3">
                              <Badge variant={res.status === 'confirmed' ? 'green' : res.status === 'pending' ? 'yellow' : 'blue'}>
                                {res.status.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => {
                                  setSelectedReservation(res);
                                  setConfirmAction('update');
                                  setShowConfirmDialog(true);
                                }}
                              >
                                ✏️ Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => {
                                  setSelectedReservation(res);
                                  setConfirmAction('delete');
                                  setShowConfirmDialog(true);
                                }}
                              >
                                🗑️ Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} reservations
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          ← Previous
                        </Button>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next →
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </Modal>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={() => {
            if (confirmAction === 'delete') {
              setReservations(reservations.filter(r => r.id !== selectedReservation?.id));
              addToast('Reservation deleted successfully!', 'success');
            } else if (confirmAction === 'update') {
              addToast('Reservation updated successfully!', 'success');
            } else if (confirmAction === 'create') {
              addToast('Reservation created successfully!', 'success');
            }
            setShowConfirmDialog(false);
            setSelectedReservation(null);
          }}
          title={confirmAction === 'delete' ? 'Delete Reservation' : confirmAction === 'update' ? 'Update Reservation' : 'Add Reservation'}
          message={
            confirmAction === 'delete' 
              ? `Are you sure you want to delete the reservation for ${selectedReservation?.guestName}? This action cannot be undone.`
              : confirmAction === 'update'
              ? `Are you sure you want to update the reservation for ${selectedReservation?.guestName}?`
              : 'Are you sure you want to create a new reservation?'
          }
          confirmText={confirmAction === 'delete' ? 'Delete' : confirmAction === 'update' ? 'Update' : 'Create'}
          cancelText="Cancel"
        />

        {/* Charts and Recent Activity */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Occupancy Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Occupancy Trend
            </h2>
            <div className="space-y-4">
              {occupancyData.map((data, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {data.month}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.occupancy}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {data.occupancy}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Revenue
            </h2>
            <div className="space-y-4">
              {revenueData.map((data, idx) => {
                const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
                const percentage = (data.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {data.month}
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                      />
                    </div>
                    <span className="w-16 text-right text-sm font-medium text-gray-900 dark:text-white">
                      ${(data.revenue / 1000).toFixed(1)}k
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Recent Reservations */}
        <motion.div variants={itemVariants}>
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Reservations
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Guest
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Room
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Dates
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockReservations.slice(0, 5).map((res) => (
                    <tr key={res.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3">{res.guestName}</td>
                      <td className="px-4 py-3">#{res.roomNumber}</td>
                      <td className="px-4 py-3 text-xs">
                        {res.checkIn} to {res.checkOut}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={res.status === 'confirmed' ? 'green' : res.status === 'pending' ? 'yellow' : 'blue'}>
                          {res.status.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default DashboardPage;
