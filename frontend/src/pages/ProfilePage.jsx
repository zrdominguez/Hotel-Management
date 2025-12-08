import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, Badge, Button, Input } from '../components/common/FormElements';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { mockReservations } from '../utils/mockData';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'reservations'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [guestFilterType, setGuestFilterType] = useState('all');

  const handleSave = () => {
    updateUser(formData);
    addToast('Profile updated successfully!', 'success');
    setIsEditing(false);
  };

  // Get reservations by status for guests
  const getReservationsByStatus = () => {
    const now = new Date();
    const past = mockReservations.filter(r => new Date(r.checkOut) < now);
    const current = mockReservations.filter(r => new Date(r.checkIn) <= now && new Date(r.checkOut) >= now);
    const future = mockReservations.filter(r => new Date(r.checkIn) > now);
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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your profile and reservations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'reservations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            My Reservations
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                  <p className="text-xs mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded w-fit capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>

              {/* Form */}
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div className="flex gap-3">
                    <Button variant="primary" onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <p className="mt-2 text-gray-900 dark:text-white">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <p className="mt-2 text-gray-900 dark:text-white">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <p className="mt-2 text-gray-900 dark:text-white capitalize">{user?.role}</p>
                  </div>
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </Card>

            {/* Account Settings */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  🔐 Change Password
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  🔔 Notification Preferences
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-lg transition-colors">
                  🗑️ Delete Account
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'past', 'current', 'future'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setGuestFilterType(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    guestFilterType === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} Reservations
                </button>
              ))}
            </div>

            {/* Reservation Dropdowns */}
            <div className="space-y-3">
              {(() => {
                const { past, current, future } = getReservationsByStatus();
                return (
                  <>
                    {guestFilterType === 'all' || guestFilterType === 'past' ? (
                      <ReservationDropdown title="📋 Past Reservations" reservations={past} categoryKey="past" />
                    ) : null}
                    {guestFilterType === 'all' || guestFilterType === 'current' ? (
                      <ReservationDropdown title="🏨 Current Reservations" reservations={current} categoryKey="current" />
                    ) : null}
                    {guestFilterType === 'all' || guestFilterType === 'future' ? (
                      <ReservationDropdown title="📅 Future Reservations" reservations={future} categoryKey="future" />
                    ) : null}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
