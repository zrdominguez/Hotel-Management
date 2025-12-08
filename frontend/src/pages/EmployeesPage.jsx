import React, { useState, useMemo } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, Button } from '../components/common/FormElements';
import { Table, SearchBar, FilterChip } from '../components/common/TableComponents';
import { Badge } from '../components/common/FormElements';
import { Modal, Alert, ConfirmDialog } from '../components/common/ModalComponents';
import { useToast } from '../hooks/useToast';
import { mockEmployees } from '../utils/mockData';

const EmployeesPage = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [employees, setEmployees] = useState(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !filterRole || emp.role === filterRole;
      return matchesSearch && matchesFilter;
    });
  }, [employees, searchTerm, filterRole]);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <Badge variant={value === 'admin' ? 'red' : 'blue'}>
          {value}
        </Badge>
      )
    },
    { key: 'joinDate', label: 'Join Date' },
  ];

  const handleSaveEmployee = () => {
    if (selectedEmployee?.id) {
      addToast('Employee updated successfully!', 'success');
    } else {
      addToast('Employee created successfully!', 'success');
    }
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = () => {
    setEmployees(employees.filter((e) => e.id !== selectedEmployee?.id));
    addToast('Employee deleted successfully!', 'success');
    setShowDeleteDialog(false);
    setShowModal(false);
    setSelectedEmployee(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employees</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage hotel staff and employees</p>
          </div>
          <Button 
            variant="primary"
            onClick={() => {
              setSelectedEmployee(null);
              setShowModal(true);
            }}
          >
            ➕ Add Employee
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              onClear={() => setSearchTerm('')}
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="input-base"
            >
              <option value="">All Roles</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Active filters */}
          {(searchTerm || filterRole) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <FilterChip 
                  label={`Search: "${searchTerm}"`}
                  onRemove={() => setSearchTerm('')}
                />
              )}
              {filterRole && (
                <FilterChip 
                  label={`Role: ${filterRole}`}
                  onRemove={() => setFilterRole('')}
                />
              )}
            </div>
          )}
        </Card>

        {/* Table */}
        <Card>
          <Table
            columns={columns}
            data={filteredEmployees}
            onRowClick={(row) => {
              setSelectedEmployee(row);
              setShowModal(true);
            }}
          />
        </Card>

        {/* Results info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>

        {/* Employee Details Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedEmployee(null);
          }}
          title="Employee Details"
          size="lg"
        >
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedEmployee.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedEmployee.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedEmployee.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                  <p className="mt-1">
                    <Badge variant={selectedEmployee.role === 'admin' ? 'red' : 'blue'}>
                      {selectedEmployee.role}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Join Date</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedEmployee.joinDate}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
                  Delete
                </Button>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveEmployee}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteEmployee}
          title="Delete Employee"
          message={`Are you sure you want to delete ${selectedEmployee?.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </MainLayout>
  );
};

export default EmployeesPage;
