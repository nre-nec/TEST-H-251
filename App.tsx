
import React, { useState } from 'react';
import Header from './components/Header.tsx';
import ScheduleView from './components/ScheduleView.tsx';
import AdminView from './components/AdminView.tsx';
import StatsView from './components/StatsView.tsx';
import LoginModal from './components/LoginModal.tsx';
import QueryView from './components/QueryView.tsx';
import { AppView } from './types.ts';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 text-gray-500 text-sm bg-slate-100 border-t border-slate-200">
      <p>{`© ${new Date().getFullYear()} وحدة التطوير والجودة – كلية الشمال للتمريض الأهلية. جميع الحقوق محفوظة.`}</p>
    </footer>
  );
};

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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header 
        currentView={currentView} 
        onTabClick={handleTabClick} 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <main className="p-4 sm:p-6 lg:p-8 flex-grow">
        {renderView()}
      </main>
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
      <Footer />
    </div>
  );
};

export default App;