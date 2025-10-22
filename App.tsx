
import React, { useState } from 'react';
import Header from './components/Header';
import ScheduleView from './components/ScheduleView';
import AdminView from './components/AdminView';
import StatsView from './components/StatsView';
import LoginModal from './components/LoginModal';
import QueryView from './components/QueryView';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.QUERY);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [protectedView, setProtectedView] = useState<AppView | null>(null);

  const handleTabClick = (view: AppView) => {
    if (view === AppView.SCHEDULE || view === AppView.ADMIN || view === AppView.STATS) {
      if (isAuthenticated) {
        setCurrentView(view);
      } else {
        setProtectedView(view);
        setIsLoginModalOpen(true);
      }
    } else {
      setCurrentView(view);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    if (protectedView) {
      setCurrentView(protectedView);
      setProtectedView(null);
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(AppView.QUERY);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.SCHEDULE:
        return isAuthenticated ? <ScheduleView /> : null;
      case AppView.ADMIN:
        return isAuthenticated ? <AdminView /> : null;
      case AppView.STATS:
        return isAuthenticated ? <StatsView /> : null;
      case AppView.QUERY:
      default:
        return <QueryView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header 
        currentView={currentView} 
        onTabClick={handleTabClick} 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default App;