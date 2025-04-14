
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define ticket types
export type TicketType = 'Child' | 'Student' | 'Adult';

// Define payment methods
export type PaymentMethod = 'Cash' | 'Card' | 'Voucher' | 'Free Entry';

// Define gender options
export type Gender = 'Male' | 'Female' | 'Other';

// Define entry record structure
export interface EntryRecord {
  id: string;
  timestamp: Date;
  name?: string;
  age: number;
  gender: Gender;
  isStudent: boolean;
  studentCardVerified: boolean;
  ticketType: TicketType;
  ticketPrice: number;
  paymentMethod: PaymentMethod;
}

// Helper function to determine ticket type and price
export const calculateTicketDetails = (
  age: number,
  isStudent: boolean,
  studentCardVerified: boolean
): { ticketType: TicketType; ticketPrice: number } => {
  if (age < 10) {
    return { ticketType: 'Child', ticketPrice: 10 };
  } else if (isStudent && studentCardVerified) {
    return { ticketType: 'Student', ticketPrice: 15 };
  } else {
    return { ticketType: 'Adult', ticketPrice: 20 };
  }
};

interface AppContextType {
  entries: EntryRecord[];
  addEntry: (entry: Omit<EntryRecord, 'id' | 'timestamp'>) => void;
  totalRevenue: number;
  childEntries: EntryRecord[];
  studentEntries: EntryRecord[];
  adultEntries: EntryRecord[];
  maleCount: number;
  femaleCount: number;
  otherGenderCount: number;
  entriesByHour: Record<string, number>;
  resetEntries: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<EntryRecord[]>(() => {
    // Load entries from localStorage if available
    const savedEntries = localStorage.getItem('hoopentryData');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hoopentryData', JSON.stringify(entries));
  }, [entries]);

  // Calculate various metrics
  const totalRevenue = entries.reduce((sum, entry) => sum + entry.ticketPrice, 0);
  
  const childEntries = entries.filter(entry => entry.ticketType === 'Child');
  const studentEntries = entries.filter(entry => entry.ticketType === 'Student');
  const adultEntries = entries.filter(entry => entry.ticketType === 'Adult');
  
  const maleCount = entries.filter(entry => entry.gender === 'Male').length;
  const femaleCount = entries.filter(entry => entry.gender === 'Female').length;
  const otherGenderCount = entries.filter(entry => entry.gender === 'Other').length;
  
  // Group entries by hour
  const entriesByHour = entries.reduce((acc: Record<string, number>, entry) => {
    const hour = new Date(entry.timestamp).getHours();
    const hourKey = `${hour}:00`;
    acc[hourKey] = (acc[hourKey] || 0) + 1;
    return acc;
  }, {});

  // Add a new entry
  const addEntry = (entryData: Omit<EntryRecord, 'id' | 'timestamp'>) => {
    const newEntry: EntryRecord = {
      ...entryData,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setEntries(prevEntries => [...prevEntries, newEntry]);
  };

  // Reset all entries (for testing)
  const resetEntries = () => {
    setEntries([]);
  };

  return (
    <AppContext.Provider
      value={{
        entries,
        addEntry,
        totalRevenue,
        childEntries,
        studentEntries,
        adultEntries,
        maleCount,
        femaleCount,
        otherGenderCount,
        entriesByHour,
        resetEntries,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
