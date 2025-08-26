"use client";

import { useState, useEffect } from "react";
import { Driver } from "@/lib/supabase";
import Image from "next/image";

interface UserWithStats extends Driver {
  last_login?: string;
  races_count?: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          updates: { is_admin: !isAdmin }
        }),
      });

      if (response.ok) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleUpdateAccessLevel = async (userId: string, accessLevel: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          updates: { access_level: accessLevel }
        }),
      });

      if (response.ok) {
        await fetchUsers();
        setShowEditModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-3 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-3 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white">
            User Management
          </h2>
          <p className="text-gray-6">
            Manage user roles and permissions
          </p>
        </div>
        <div className="text-sm text-gray-6">
          {users.length} total users
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-dark">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-6">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-6">
                  Stats
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-6">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-6">
                  Access Level
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-6">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-1 dark:hover:bg-dark-2">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={user.avatar_url || '/images/user/user-03.png'}
                        alt={user.display_name || user.username}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium text-dark dark:text-white">
                          {user.display_name || user.username}
                        </div>
                        <div className="text-xs text-gray-6">
                          Steam ID: {user.steam_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-dark dark:text-white">
                      ELO: {user.elo_rating}
                    </div>
                    <div className="text-xs text-gray-6">
                      {user.total_races} races • {user.wins} wins
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.is_admin
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.access_level === 'premium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : user.access_level === 'vip'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {user.access_level?.toUpperCase() || 'USER'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-6">
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleDateString()
                      : 'Never'
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="rounded bg-primary px-2 py-1 text-xs text-white hover:bg-primary/90"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                        className={`rounded px-2 py-1 text-xs ${
                          user.is_admin
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-dark rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-dark dark:text-white">
              Edit User: {selectedUser.display_name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-6 mb-2">
                  Access Level
                </label>
                <select
                  value={selectedUser.access_level || 'user'}
                  onChange={(e) => handleUpdateAccessLevel(selectedUser.id, e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-dark dark:border-dark-3 dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-sm border border-stroke rounded-lg hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}