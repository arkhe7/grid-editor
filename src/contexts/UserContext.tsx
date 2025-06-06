import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, FilterOptions } from '../types';

interface UserContextType {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  searchUsers: (term: string) => User[];
  loadUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultFilterOptions: FilterOptions = {
  searchTerm: '',
  minFollowers: 0,
  maxFollowers: Infinity,
  sortBy: 'followers',
  sortOrder: 'desc'
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilterOptions);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/database-1.json');
      if (!response.ok) {
        throw new Error('Failed to load user data');
      }
      
      const userData: User[] = await response.json();
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (userList: User[], options: FilterOptions) => {
    let filtered = [...userList];

    // Search filter
    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.screen_name.toLowerCase().includes(searchLower) ||
        (user.description && user.description.toLowerCase().includes(searchLower))
      );
    }

    // Followers filter
    filtered = filtered.filter(user => 
      user.followers_count >= options.minFollowers && 
      user.followers_count <= options.maxFollowers
    );

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (options.sortBy) {
        case 'followers':
          aValue = a.followers_count;
          bValue = b.followers_count;
          break;
        case 'name':
          aValue = a.screen_name.toLowerCase();
          bValue = b.screen_name.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          return 0;
      }

      if (options.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const searchUsers = (term: string): User[] => {
    if (!term.trim()) return users;
    
    const searchLower = term.toLowerCase();
    return users.filter(user => 
      user.screen_name.toLowerCase().includes(searchLower) ||
      (user.description && user.description.toLowerCase().includes(searchLower))
    ).slice(0, 20); // Limit to 20 results for performance
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = applyFilters(users, filterOptions);
    setFilteredUsers(filtered);
  }, [users, filterOptions]);

  const handleSetFilterOptions = (options: FilterOptions) => {
    setFilterOptions(options);
  };

  return (
    <UserContext.Provider value={{
      users,
      filteredUsers,
      loading,
      error,
      filterOptions,
      setFilterOptions: handleSetFilterOptions,
      searchUsers,
      loadUsers
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};