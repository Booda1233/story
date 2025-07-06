import { User } from '../types';
import { USERS_STORAGE_KEY, CURRENT_USER_ID_STORAGE_KEY } from '../constants';

// Initialize with some base users if none exist, for content continuity
const getInitialUsers = (): Record<string, User> => ({
  'user-2': { id: 'user-2', name: 'علي حسن', avatar: 'https://i.pravatar.cc/150?u=user-2' },
  'user-3': { id: 'user-3', name: 'فاطمة الزهراء', avatar: 'https://i.pravatar.cc/150?u=user-3' },
  'user-4': { id: 'user-4', name: 'عمر شريف', avatar: 'https://i.pravatar.cc/150?u=user-4' },
});

export const getUsers = (): Record<string, User> => {
    const usersJSON = localStorage.getItem(USERS_STORAGE_KEY);
    if (usersJSON) {
        return JSON.parse(usersJSON);
    }
    const initialUsers = getInitialUsers();
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
};

const saveUsers = (users: Record<string, User>) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const isUsernameTaken = (name: string): boolean => {
    const users = getUsers();
    return Object.values(users).some(user => user.name.toLowerCase() === name.toLowerCase());
};

export const registerUser = (name: string): User => {
    const users = getUsers();
    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
        id: newUserId,
        name,
        avatar: `https://i.pravatar.cc/150?u=${newUserId}` // Default avatar
    };
    users[newUserId] = newUser;
    saveUsers(users);
    return newUser;
};

export const getUserByName = (name: string): User | undefined => {
    const users = getUsers();
    return Object.values(users).find(user => user.name.toLowerCase() === name.toLowerCase());
};

export const getUserById = (id: string): User | undefined => {
    const users = getUsers();
    return users[id];
};

export const updateUserAvatar = (userId: string, avatar: string): User | undefined => {
    const users = getUsers();
    if (users[userId]) {
        users[userId].avatar = avatar;
        saveUsers(users);
        return users[userId];
    }
    return undefined;
};

export const getCurrentUserId = (): string | null => {
    return localStorage.getItem(CURRENT_USER_ID_STORAGE_KEY);
};

export const setCurrentUserId = (userId: string | null) => {
    if (userId) {
        localStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, userId);
    } else {
        localStorage.removeItem(CURRENT_USER_ID_STORAGE_KEY);
    }
};
