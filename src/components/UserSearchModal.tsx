import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import { useUsers } from '../contexts/UserContext';
import { User } from '../types';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Modal = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.border};
    color: ${props => props.theme.text};
  }
`;

const SearchContainer = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const SearchInputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 15px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px rgba(46, 213, 115, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
  font-size: 1.2rem;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 10px;
  color: ${props => props.theme.text};
  outline: none;
  cursor: pointer;

  option {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }
`;

const ResultsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 2rem 2rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const UserCard = styled(motion.div)`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 15px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: block;
  border: 2px solid ${props => props.theme.border};
`;

const UserName = styled.h4`
  color: ${props => props.theme.text};
  margin: 0 0 0.5rem;
  text-align: center;
  font-size: 1rem;
`;

const UserStats = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const UserDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textSecondary};
`;

interface UserSearchModalProps {
  onUserSelect: (user: User) => void;
  onClose: () => void;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({ onUserSelect, onClose }) => {
  const { users, loading, searchUsers } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'followers' | 'name'>('followers');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    let results = searchTerm ? searchUsers(searchTerm) : users.slice(0, 50);
    
    // Sort results
    results.sort((a, b) => {
      let aValue: any, bValue: any;
      
      if (sortBy === 'followers') {
        aValue = a.followers_count;
        bValue = b.followers_count;
      } else {
        aValue = a.screen_name.toLowerCase();
        bValue = b.screen_name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(results);
  }, [searchTerm, sortBy, sortOrder, users]);

  const handleUserSelect = (user: User) => {
    onUserSelect(user);
    onClose();
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Header>
            <Title>Select Profile</Title>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </Header>

          <SearchContainer>
            <SearchInputWrapper>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search by username or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </SearchInputWrapper>

            <FilterRow>
              <FiFilter color="#888" />
              <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value as 'followers' | 'name')}>
                <option value="followers">Sort by Followers</option>
                <option value="name">Sort by Name</option>
              </FilterSelect>
              <FilterSelect value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </FilterSelect>
            </FilterRow>
          </SearchContainer>

          <ResultsContainer>
            {loading ? (
              <LoadingState>Loading users...</LoadingState>
            ) : filteredUsers.length === 0 ? (
              <EmptyState>
                {searchTerm ? 'No users found matching your search.' : 'No users available.'}
              </EmptyState>
            ) : (
              <ResultsGrid>
                {filteredUsers.map((user, index) => (
                  <UserCard
                    key={user.screen_name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleUserSelect(user)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserAvatar
                      src={user.profile_image_url}
                      alt={user.screen_name}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNkZGQiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxOCIgeT0iMTgiPgo8cGF0aCBkPSJNMTIgMTJDMTQuNzYxNCAxMiAxNyA5Ljc2MTQyIDE3IDdDMTcgNC4yMzg1OCAxNC43NjE0IDIgMTIgMkM5LjIzODU4IDIgNyA0LjIzODU4IDcgN0M3IDkuNzYxNDIgOS4yMzg1OCAxMiAxMiAxMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDEzLjk5IDcuMTcgMTUuNDEgNiAxNy41VjE5SDE4VjE3LjVDMTYuODMgMTUuNDEgMTQuNjcgMTMuOTkgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
                      }}
                    />
                    <UserName>@{user.screen_name}</UserName>
                    <UserStats>
                      <span>{formatFollowers(user.followers_count)} followers</span>
                      <span>{formatFollowers(user.friends_count)} following</span>
                    </UserStats>
                    <UserDescription>
                      {user.description || 'No description available'}
                    </UserDescription>
                  </UserCard>
                ))}
              </ResultsGrid>
            )}
          </ResultsContainer>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default UserSearchModal;