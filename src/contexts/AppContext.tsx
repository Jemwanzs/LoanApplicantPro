import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  companyId: string;
}

interface Company {
  id: string;
  name: string;
  brandColor: string;
  brandColorLight: string;
  logo?: string;
  loanTypes: string[];
  loanPeriods: number[];
  publicFormLink?: string;
  settingsCompleted: boolean;
}

interface LoanApplication {
  id: string;
  companyId: string;
  applicantName: string;
  email: string;
  phone: string;
  loanType: string;
  amount: number;
  period: number;
  status: 'pending' | 'approved' | 'declined';
  notes?: string;
  createdAt: string;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
  company: Company | null;
  applications: LoanApplication[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, companyName: string) => Promise<boolean>;
  logout: () => void;
  updateCompanySettings: (settings: Partial<Company>) => void;
  generatePublicLink: () => string;
  addApplication: (app: Omit<LoanApplication, 'id' | 'createdAt' | 'companyId'>) => void;
  updateApplicationStatus: (id: string, status: 'approved' | 'declined', notes?: string) => void;
  formatAmount: (amount: number) => string;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  user: null,
  company: null,
  applications: [],
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  updateCompanySettings: () => {},
  generatePublicLink: () => '',
  addApplication: () => {},
  updateApplicationStatus: () => {},
  formatAmount: () => '',
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login
    const mockUser = { id: '1', email, role: 'admin' as const, companyId: 'comp1' };
    const mockCompany = {
      id: 'comp1',
      name: 'Demo Company',
      brandColor: '#f97316',
      brandColorLight: '#fed7aa',
      loanTypes: [],
      loanPeriods: [],
      settingsCompleted: false
    };
    setUser(mockUser);
    setCompany(mockCompany);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('company', JSON.stringify(mockCompany));
    return true;
  };

  const signup = async (email: string, password: string, companyName: string): Promise<boolean> => {
    const companyId = uuidv4();
    const mockUser = { id: uuidv4(), email, role: 'admin' as const, companyId };
    const mockCompany = {
      id: companyId,
      name: companyName,
      brandColor: '#f97316',
      brandColorLight: '#fed7aa',
      loanTypes: [],
      loanPeriods: [],
      settingsCompleted: false
    };
    setUser(mockUser);
    setCompany(mockCompany);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('company', JSON.stringify(mockCompany));
    return true;
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    localStorage.removeItem('user');
    localStorage.removeItem('company');
  };

  const updateCompanySettings = (settings: Partial<Company>) => {
    if (company) {
      const updated = { ...company, ...settings };
      const isComplete = updated.loanTypes.length > 0 && updated.loanPeriods.length > 0;
      updated.settingsCompleted = isComplete;
      setCompany(updated);
      localStorage.setItem('company', JSON.stringify(updated));
      
      // Update CSS variables for brand colors
      document.documentElement.style.setProperty('--brand-color', updated.brandColor);
      document.documentElement.style.setProperty('--brand-color-light', updated.brandColorLight);
    }
  };

  const generatePublicLink = (): string => {
    if (company && company.settingsCompleted) {
      const link = `${window.location.origin}/apply/${company.id}`;
      updateCompanySettings({ publicFormLink: link });
      return link;
    }
    return '';
  };

  const addApplication = (app: Omit<LoanApplication, 'id' | 'createdAt' | 'companyId'>) => {
    if (company) {
      const newApp: LoanApplication = {
        ...app,
        id: uuidv4(),
        companyId: company.id,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      setApplications(prev => [newApp, ...prev]);
      toast({ title: 'New application received!' });
    }
  };

  const updateApplicationStatus = (id: string, status: 'approved' | 'declined', notes?: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status, notes } : app
    ));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCompany = localStorage.getItem('company');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCompany) {
      const comp = JSON.parse(savedCompany);
      setCompany(comp);
      document.documentElement.style.setProperty('--brand-color', comp.brandColor);
      document.documentElement.style.setProperty('--brand-color-light', comp.brandColorLight);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      sidebarOpen, toggleSidebar, user, company, applications,
      login, signup, logout, updateCompanySettings, generatePublicLink,
      addApplication, updateApplicationStatus, formatAmount
    }}>
      {children}
    </AppContext.Provider>
  );
};