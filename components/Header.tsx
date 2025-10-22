
import React from 'react';
import { AppView } from '../types.ts';

interface HeaderProps {
  currentView: AppView;
  onTabClick: (view: AppView) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const AnimatedIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative inline-block transition-transform duration-300 ease-in-out hover:scale-110 animate-pulse-slow">
        {children}
    </div>
);

const Header: React.FC<HeaderProps> = ({ currentView, onTabClick, isAuthenticated, onLogout }) => {
  const getTabClass = (view: AppView) => {
    return `flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg transition-colors duration-300 ${
      currentView === view
        ? 'bg-white text-blue-600 shadow-md'
        : 'bg-transparent text-white hover:bg-white/20'
    }`;
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
            <AnimatedIcon>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </AnimatedIcon>
            <h1 className="text-xl font-bold">جدول مراقبات الاختبارات</h1>
        </div>
        
        <nav className="flex items-center border-b-2 border-white/20">
          <button className={getTabClass(AppView.QUERY)} onClick={() => onTabClick(AppView.QUERY)}>
            استعلام
          </button>
          <button className={getTabClass(AppView.SCHEDULE)} onClick={() => onTabClick(AppView.SCHEDULE)}>
            جدول المراقبين {!isAuthenticated && '🔒'}
          </button>
          <button className={getTabClass(AppView.ADMIN)} onClick={() => onTabClick(AppView.ADMIN)}>
             لجنة الاختبارات {!isAuthenticated && '🔒'}
          </button>
          <button className={getTabClass(AppView.STATS)} onClick={() => onTabClick(AppView.STATS)}>
            إحصائيات {!isAuthenticated && '🔒'}
          </button>
        </nav>

        {isAuthenticated && (
            <button 
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
            >
                تسجيل الخروج
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;