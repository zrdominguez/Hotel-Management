import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { userRole } = useAuth();

  const menuItems = {
    user: [
      { icon: '📊', label: 'Dashboard', path: '/dashboard' },
      { icon: '🏨', label: 'Browse Rooms', path: '/browse-rooms' },
      { icon: '📋', label: 'My Reservations', path: '/reservations' },
      { icon: '👤', label: 'Profile', path: '/profile' },
    ],
    employee: [
      { icon: '📊', label: 'Dashboard', path: '/dashboard' },
      { icon: '🔍', label: 'Search Reservations', path: '/reservations' },
      { icon: '🏢', label: 'Rooms', path: '/rooms' },
      { icon: '👤', label: 'Profile', path: '/profile' },
    ],
    admin: [
      { icon: '📊', label: 'Dashboard', path: '/dashboard' },
      { icon: '🔍', label: 'Reservations', path: '/reservations' },
      { icon: '👥', label: 'Employees', path: '/employees' },
      { icon: '🏢', label: 'Rooms', path: '/rooms' },
      { icon: '👤', label: 'Profile', path: '/profile' },
    ],
  };

  const items = menuItems[userRole] || menuItems.user;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white z-40 overflow-y-auto
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-2xl font-bold">🏨 Hotel</h1>
          <p className="text-blue-100 text-sm">Management System</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {items.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-all ${
                  location.pathname === item.path
                    ? 'bg-blue-500 shadow-lg'
                    : 'hover:bg-blue-600'
                }`}
                onClick={() => onClose()}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-blue-500 mt-auto">
          <p className="text-xs text-blue-100 text-center">Hotel Management System v1.0</p>
        </div>
      </motion.div>
    </>
  );
};
