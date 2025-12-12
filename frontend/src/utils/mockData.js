// Mock data for the application
export const mockReservations = [
  {
    id: 'res_001',
    userId: 'user_001',
    guestName: 'John Doe',
    roomNumber: 101,
    checkIn: '2025-12-10',
    checkOut: '2025-12-15',
    status: 'confirmed',
    totalPrice: 750,
  },
  {
    id: 'res_002',
    userId: 'user_002',
    guestName: 'Jane Smith',
    roomNumber: 205,
    checkIn: '2025-12-12',
    checkOut: '2025-12-18',
    status: 'confirmed',
    totalPrice: 900,
  },
  {
    id: 'res_003',
    userId: 'user_001',
    guestName: 'John Doe',
    roomNumber: 301,
    checkIn: '2025-12-20',
    checkOut: '2025-12-25',
    status: 'pending',
    totalPrice: 625,
  },
  {
    id: 'res_004',
    userId: 'user_003',
    guestName: 'Michael Johnson',
    roomNumber: 102,
    checkIn: '2025-12-14',
    checkOut: '2025-12-17',
    status: 'checked_in',
    totalPrice: 450,
  },
  {
    id: 'res_005',
    userId: 'user_004',
    guestName: 'Sarah Williams',
    roomNumber: 401,
    checkIn: '2025-12-16',
    checkOut: '2025-12-22',
    status: 'confirmed',
    totalPrice: 1050,
  },
];

export const mockEmployees = [
  {
    id: 'emp_001',
    name: 'Alice Johnson',
    email: 'alice@hotel.com',
    role: 'employee',
    department: 'Front Desk',
    joinDate: '2023-06-15',
  },
  {
    id: 'emp_002',
    name: 'Bob Smith',
    email: 'bob@hotel.com',
    role: 'employee',
    department: 'Housekeeping',
    joinDate: '2023-08-20',
  },
  {
    id: 'emp_003',
    name: 'Carol White',
    email: 'carol@hotel.com',
    role: 'admin',
    department: 'Management',
    joinDate: '2022-01-10',
  },
  {
    id: 'emp_004',
    name: 'David Brown',
    email: 'david@hotel.com',
    role: 'employee',
    department: 'Maintenance',
    joinDate: '2023-09-05',
  },
];

export const mockRooms = [
  {
    id: 'room_001',
    number: 101,
    type: 'Standard',
    capacity: 2,
    pricePerNight: 150,
    status: 'occupied',
    amenities: ['WiFi', 'TV', 'Air Conditioning'],
    image: 'https://www.omnihotels.com/-/media/images/hotels/ftwdtn/digex/carousel/ftwdtn_11_2880x1870.jpg?mw=1980&hash=21E3ED5C03DE2246DD9B5E5D47B409C642F6AE74',
  },
  {
    id: 'room_002',
    number: 102,
    type: 'Standard',
    capacity: 2,
    pricePerNight: 150,
    status: 'available',
    amenities: ['WiFi', 'TV', 'Air Conditioning'],
    image: 'https://www.omnihotels.com/-/media/images/hotels/ftwdtn/digex/carousel/ftwdtn_11_2880x1870.jpg?mw=1980&hash=21E3ED5C03DE2246DD9B5E5D47B409C642F6AE74',
  },
  {
    id: 'room_003',
    number: 205,
    type: 'Deluxe',
    capacity: 4,
    pricePerNight: 250,
    status: 'occupied',
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi'],
    image: 'https://www.omnihotels.com/-/media/images/hotels/ftwdtn/digex/carousel/ftwdtn_11_2880x1870.jpg?mw=1980&hash=21E3ED5C03DE2246DD9B5E5D47B409C642F6AE74',
  },
  {
    id: 'room_004',
    number: 301,
    type: 'Suite',
    capacity: 4,
    pricePerNight: 400,
    status: 'available',
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Living Area'],
    image: 'https://www.omnihotels.com/-/media/images/hotels/ftwdtn/digex/carousel/ftwdtn_11_2880x1870.jpg?mw=1980&hash=21E3ED5C03DE2246DD9B5E5D47B409C642F6AE74',
  },
  {
    id: 'room_005',
    number: 401,
    type: 'Suite',
    capacity: 6,
    pricePerNight: 500,
    status: 'occupied',
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Living Area', 'Terrace'],
    image: 'https://www.omnihotels.com/-/media/images/hotels/ftwdtn/digex/carousel/ftwdtn_11_2880x1870.jpg?mw=1980&hash=21E3ED5C03DE2246DD9B5E5D47B409C642F6AE74',
  },
];

export const generateMockOccupancyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    month,
    occupancy: Math.floor(Math.random() * 40) + 60,
  }));
};

export const generateMockRevenueData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 20000,
  }));
};

export const calculateOccupancyRate = () => {
  const occupiedRooms = mockRooms.filter((r) => r.status === 'occupied').length;
  return Math.round((occupiedRooms / mockRooms.length) * 100);
};

export const calculateTotalRevenue = () => {
  return mockReservations
    .filter((r) => r.status === 'checked_in' || r.status === 'completed')
    .reduce((sum, r) => sum + r.totalPrice, 0);
};

export const calculateAverageReservationValue = () => {
  if (mockReservations.length === 0) return 0;
  return Math.round(mockReservations.reduce((sum, r) => sum + r.totalPrice, 0) / mockReservations.length);
};
