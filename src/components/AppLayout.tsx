import React, { useState, useEffect } from 'react';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import PublicApplication from '@/pages/PublicApplication';
import { useToast } from '@/components/ui/use-toast';

type AuthState = 'login' | 'signup' | 'dashboard' | 'public';

interface User {
  email: string;
  publicLink: string;
}

const AppLayout: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setUser(userData);
      setAuthState('dashboard');
    }

    // Check if this is a public application link
    const path = window.location.pathname;
    if (path.startsWith('/apply/')) {
      setAuthState('public');
    }
  }, []);

  const handleLogin = (email: string) => {
    // Get or create user data
    let userData = JSON.parse(localStorage.getItem('userData') || 'null');
    
    if (!userData) {
      // Create default user data for hardcoded login
      const userId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      userData = {
        email,
        publicLink: `${window.location.origin}/apply/${userId}`,
        themeColor: '#2dbe7f',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('userData', JSON.stringify(userData));
    }

    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setAuthState('dashboard');
  };

  const handleSignup = (email: string, publicLink: string) => {
    const userData = { email, publicLink };
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setAuthState('dashboard');
    
    toast({
      title: "Account Created Successfully!",
      description: `Your public link: ${publicLink}`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setAuthState('login');
    window.location.href = '/';
  };

  const switchToSignup = () => setAuthState('signup');
  const switchToLogin = () => setAuthState('login');

  if (authState === 'public') {
    return <PublicApplication />;
  }

  if (authState === 'login') {
    return (
      <Login 
        onLogin={handleLogin} 
        onSwitchToSignup={switchToSignup}
      />
    );
  }

  if (authState === 'signup') {
    return (
      <Signup 
        onSignup={handleSignup} 
        onSwitchToLogin={switchToLogin}
      />
    );
  }

  if (authState === 'dashboard' && user) {
    return (
      <Dashboard 
        userEmail={user.email}
        publicLink={user.publicLink}
        onLogout={handleLogout}
      />
    );
  }

  return null;
};

export default AppLayout;