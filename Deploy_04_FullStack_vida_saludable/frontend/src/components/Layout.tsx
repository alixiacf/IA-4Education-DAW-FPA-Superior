import React, { ReactNode } from 'react';
import { Heart } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'usuarios', name: 'Usuarios' },
    { id: 'entrenamiento', name: 'Entrenamiento' },
    { id: 'alimentacion', name: 'Alimentación' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Heart className="h-8 w-8 text-white" />
                <span className="ml-2 text-white text-xl font-bold">VidaSaludable</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;