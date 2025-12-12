import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Button, Input } from '../components/common/FormElements';
import { Alert } from '../components/common/ModalComponents';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoUsers = {
    user: { email: 'guest@hotel.com', password: 'password123' },
    employee: { email: 'employee@hotel.com', password: 'password123' },
    admin: { email: 'admin@hotel.com', password: 'password123' },
  };

  const handleDemoLogin = (demoRole) => {
    const demoUser = demoUsers[demoRole];
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setRole(demoRole);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      try {
        login(email, password, role);
        navigate('/dashboard');
      } catch {
        setError('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-3xl animate-pulse" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">🏨</h1>
          <h2 className="text-3xl font-bold text-white">Hotel Management</h2>
          <p className="text-blue-100 mt-2">Professional Guest & Room Management System</p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        >
          {/* Error Alert */}
          {error && (
            <motion.div variants={itemVariants} className="mb-6">
              <Alert type="error" title="Login Error" message={error} />
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div variants={itemVariants}>
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Login as</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-base mt-1"
              >
                <option value="user">Guest</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? '🔄 Logging in...' : '🔐 Login'}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">Demo Accounts</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </motion.div>

          {/* Demo buttons */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin('user')}
              className="w-full text-white"
            >
              👤 Login as Guest
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin('employee')}
              className="w-full text-white"
            >
              👨‍💼 Login as Employee
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin('admin')}
              className="w-full text-white"
            >
              👨‍💻 Login as Admin
            </Button>
          </motion.div>

          {/* Info */}
          <motion.div variants={itemVariants} className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Demo Info:</strong> Use any of the demo buttons to quickly test the system with different user roles.
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="text-center mt-6 text-blue-100">
          <p className="text-sm">© 2025 Hotel Management System. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
