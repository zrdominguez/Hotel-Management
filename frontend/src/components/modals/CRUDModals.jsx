import React, { useState } from 'react';
import { Modal } from '../common/ModalComponents';
import { Input, Select, Button } from '../common/FormElements';

export const ReservationModal = ({ isOpen, onClose, onSave, reservation }) => {
  const [formData, setFormData] = useState(reservation || {
    guestName: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    status: 'pending',
    totalPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={reservation ? "Edit Reservation" : "New Reservation"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Guest Name"
          name="guestName"
          value={formData.guestName}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Room Number"
            name="roomNumber"
            type="number"
            value={formData.roomNumber}
            onChange={handleChange}
            required
          />
          <Input
            label="Total Price"
            name="totalPrice"
            type="number"
            value={formData.totalPrice}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Check-in Date"
            name="checkIn"
            type="date"
            value={formData.checkIn}
            onChange={handleChange}
            required
          />
          <Input
            label="Check-out Date"
            name="checkOut"
            type="date"
            value={formData.checkOut}
            onChange={handleChange}
            required
          />
        </div>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { label: 'Pending', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Checked In', value: 'checked_in' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' },
          ]}
        />

        <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Reservation
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const EmployeeModal = ({ isOpen, onClose, onSave, employee }) => {
  const [formData, setFormData] = useState(employee || {
    name: '',
    email: '',
    department: '',
    role: 'employee',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={employee ? "Edit Employee" : "Add Employee"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={[
            { label: 'Employee', value: 'employee' },
            { label: 'Admin', value: 'admin' },
          ]}
        />

        <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const RoomModal = ({ isOpen, onClose, onSave, room }) => {
  const [formData, setFormData] = useState(room || {
    number: '',
    type: '',
    capacity: '',
    pricePerNight: '',
    status: 'available',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={room ? "Edit Room" : "Add Room"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Room Number"
          name="number"
          type="number"
          value={formData.number}
          onChange={handleChange}
          required
        />

        <Input
          label="Room Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g., Standard, Deluxe, Suite"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Capacity (guests)"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
          <Input
            label="Price per Night"
            name="pricePerNight"
            type="number"
            value={formData.pricePerNight}
            onChange={handleChange}
            required
          />
        </div>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { label: 'Available', value: 'available' },
            { label: 'Occupied', value: 'occupied' },
            { label: 'Maintenance', value: 'maintenance' },
          ]}
        />

        <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};
