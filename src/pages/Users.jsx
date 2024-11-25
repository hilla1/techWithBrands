import React, { useState, useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import { CSVLink } from 'react-csv';
import HomeLayout from '../components/HomePage/HomeLayout';
import UsersTable from '../components/Users/UsersTable';
import SearchAndFilterBar from '../components/Users/SearchAndFilterBar';
import EditUserModal from '../components/Users/EditUserModal';
import CreateUserModal from '../components/Users/CreateUserModal';
import ChangePasswordModal from '../components/Users/ChangePasswordModal';
import ConfirmActionModal from '../components/Users/ConfirmActionModal';
import SnackbarNotification from '../components/Users/SnackbarNotification';
import useApiRequestWithReactQuery from '../hooks/useApiRequestWithReactQuery';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [dateCreatedFilter, setDateCreatedFilter] = useState('');
  const [dateUpdatedFilter, setDateUpdatedFilter] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [modals, setModals] = useState({
    edit: false,
    delete: false,
    block: false,
    password: false,
    create: false,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { useApiQuery, useApiUpdate, useApiDelete, useApiCreate } = useApiRequestWithReactQuery();
  const { data: users = [], isLoading, refetch } = useApiQuery('/users', {
    staleTime: 60000, // Adjust this based on how often data changes
  });

  // Fetch the user being edited and cache it
  const { data: editingUser } = useApiQuery(
    editingUserId ? `/users/${editingUserId}` : null,
    {
      staleTime: 60000, // Adjust this based on how often data changes
    }
  );

  const handleError = (error) => {
    setSnackbar({ open: true, message: error.message || 'An error occurred', severity: 'error' });
  };

  const filteredUsers = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return users.filter((user) => {
      const userDateCreated = user.dateCreated ? new Date(user.dateCreated).toISOString().split('T')[0] : '';
      const userDateUpdated = user.dateUpdated ? new Date(user.dateUpdated).toISOString().split('T')[0] : '';
      const username = user.profile?.username || '';
      const email = user.email || '';

      return (
        (roleFilter === '' || user.role === roleFilter) &&
        (dateCreatedFilter === '' || userDateCreated === dateCreatedFilter) &&
        (dateUpdatedFilter === '' || userDateUpdated === dateUpdatedFilter) &&
        (user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          email.toLowerCase().includes(lowerCaseSearchTerm) ||
          username.toLowerCase().includes(lowerCaseSearchTerm))
      );
    });
  }, [users, searchTerm, roleFilter, dateCreatedFilter, dateUpdatedFilter]);

  const updateUserMutation = useApiUpdate(`/users/${editingUserId}`, {
    onSuccess: () => {
      setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
      setModals((prev) => ({ ...prev, edit: false }));
      setEditingUserId(null);
      refetch(); // Refetch user list after updating
    },
    onError: handleError,
  });

  const deleteUserMutation = useApiDelete(`/users/${editingUserId}`, {
    onSuccess: () => {
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
      setModals((prev) => ({ ...prev, delete: false }));
      setEditingUserId(null);
      refetch(); // Refetch user list after deletion
    },
    onError: handleError,
  });

  const blockUserMutation = useApiUpdate(`/users/${editingUserId}/block`, {
    onSuccess: (updatedUser) => {
      setSnackbar({
        open: true,
        message: `User ${updatedUser.blocked ? 'blocked' : 'unblocked'} successfully`,
        severity: 'success',
      });
      setModals((prev) => ({ ...prev, block: false }));
      setEditingUserId(null);
      refetch(); // Refetch user list after blocking/unblocking
    },
    onError: handleError,
  });

  const createUserMutation = useApiCreate('/users', {
    onSuccess: () => {
      setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
      setModals((prev) => ({ ...prev, create: false }));
      refetch(); // Refetch user list after creation
    },
    onError: handleError,
  });

  // New mutation for changing password
  const changePasswordMutation = useApiUpdate(`/users/${editingUserId}`, {
    onSuccess: () => {
      setSnackbar({ open: true, message: 'Password changed successfully', severity: 'success' });
      setModals((prev) => ({ ...prev, password: false }));
      setEditingUserId(null);
      refetch(); // Refetch user list after password change
    },
    onError: handleError,
  });

  const handleOpenModal = (modalType, user) => {
    setEditingUserId(user?._id);
    setModals((prev) => ({ ...prev, [modalType]: true }));
  };

  return (
    <HomeLayout roles={['admin']}>
        <div className="min-h-screen bg-gray-100">
          <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">User Management</h2>
            <SearchAndFilterBar
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              roleFilter={roleFilter}
              onRoleFilterChange={(e) => setRoleFilter(e.target.value)}
              dateCreatedFilter={dateCreatedFilter}
              onDateCreatedFilterChange={(e) => setDateCreatedFilter(e.target.value)}
              dateUpdatedFilter={dateUpdatedFilter}
              onDateUpdatedFilterChange={(e) => setDateUpdatedFilter(e.target.value)}
              onCreateUser={() => setModals((prev) => ({ ...prev, create: true }))}
            />
            <CSVLink
              data={filteredUsers.map((user) => ({
                Avatar: user.profile?.profilePhoto || '',
                Name: user.name,
                Email: user.email,
                Username: user.profile?.username || '',
                Role: user.role,
                'Date Created': user.dateCreated ? new Date(user.dateCreated).toLocaleDateString() : 'N/A',
                'Date Updated': user.dateUpdated ? new Date(user.dateUpdated).toLocaleDateString() : 'N/A',
              }))} 
              filename="users.csv" 
              className="text-blue-900 underline mb-4 inline-block"
            >
              Download CSV
            </CSVLink>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <CircularProgress />
              </div>
            ) : (
              <UsersTable
                users={filteredUsers}
                onEdit={(user) => handleOpenModal('edit', user)}
                onChangePassword={(user) => handleOpenModal('password', user)}
                onBlock={(user) => handleOpenModal('block', user)}
                onDelete={(user) => handleOpenModal('delete', user)}
              />
            )}
          </div>
        </div>

        {modals.edit && editingUser && (
          <EditUserModal
            open={modals.edit}
            onClose={() => { setModals((prev) => ({ ...prev, edit: false })); setEditingUserId(null); }}
            selectUser={editingUser}
            onSave={(data) => updateUserMutation.mutate(data)} // Ensure this calls mutate
          />
        )}
        <CreateUserModal
          open={modals.create}
          onClose={() => setModals((prev) => ({ ...prev, create: false }))} 
          onCreate={(data) => createUserMutation.mutate(data)} // Ensure this calls mutate
        />
        <ConfirmActionModal
          open={modals.delete}
          onClose={() => setModals((prev) => ({ ...prev, delete: false }))} 
          title="Delete User"
          message={`Are you sure you want to delete ${editingUser?.name}? This action cannot be undone.`}
          confirmText="Yes, proceed" 
          onConfirm={() => deleteUserMutation.mutate()} 
        />
        <ConfirmActionModal
          open={modals.block}
          onClose={() => setModals((prev) => ({ ...prev, block: false }))} 
          title={editingUser?.blocked ? 'Unblock User' : 'Block User'}
          message={`Are you sure you want to ${editingUser?.blocked ? 'unblock' : 'block'} ${editingUser?.name}?`}
          confirmText="Yes, proceed" 
          onConfirm={() => blockUserMutation.mutate()} 
        />
        <ChangePasswordModal
          open={modals.password}
          onClose={() => setModals((prev) => ({ ...prev, password: false }))} 
          onChangePassword={(newPassword) => changePasswordMutation.mutate({ password: newPassword })}
        />
        <SnackbarNotification
          open={snackbar.open}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} 
          message={snackbar.message}
          severity={snackbar.severity}
        />
    </HomeLayout>
  );
};

export default Users;
