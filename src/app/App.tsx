import { useState, useEffect } from 'react';
import { User } from './types';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { PublicChat } from './components/PublicChat';
import { PrivateRooms } from './components/PrivateRooms';
import { PrivateChat } from './components/PrivateChat';
import { Profile } from './components/Profile';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider } from './i18n/LanguageContext';

type Page = 'login' | 'register' | 'public-chat' | 'private-rooms' | 'private-chat' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('public-chat');
  const [user, setUser] = useState<User | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  // 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem('talkit-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('talkit-user', JSON.stringify(loggedInUser));
    setCurrentPage('public-chat');
  };

  const handleRegister = (registeredUser: User) => {
    setUser(registeredUser);
    localStorage.setItem('talkit-user', JSON.stringify(registeredUser));
    setCurrentPage('public-chat');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('talkit-user');
    setCurrentPage('login');
  };

  const handleNavigate = (page: string, roomId?: string) => {
    setCurrentPage(page as Page);
    if (roomId) {
      setSelectedRoomId(roomId);
    }
  };

  return (
    <LanguageProvider>
      {currentPage === 'login' && (
        <Login onLogin={handleLogin} onNavigate={handleNavigate} />
      )}
      {currentPage === 'register' && (
        <Register onRegister={handleRegister} onNavigate={handleNavigate} />
      )}
      {currentPage === 'public-chat' && (
        <PublicChat user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentPage === 'private-rooms' && user && (
        <PrivateRooms user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentPage === 'private-chat' && user && (
        <PrivateChat user={user} roomId={selectedRoomId} onNavigate={handleNavigate} />
      )}
      {currentPage === 'profile' && user && (
        <Profile user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      <Toaster />
    </LanguageProvider>
  );
}