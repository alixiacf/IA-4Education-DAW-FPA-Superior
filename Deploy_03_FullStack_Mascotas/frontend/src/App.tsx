import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import UserRegistration from './pages/UserRegistration';
import PetManagement from './pages/PetManagement';
import ClinicsMap from './pages/ClinicsMap';
import { PawPrint, Home as HomeIcon } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex-shrink-0 flex items-center hover:text-indigo-600 transition-colors">
                  <PawPrint className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-2xl font-bold text-gray-900 hover:text-indigo-600">VetCare</span>
                </Link>
                <div className="hidden sm:flex sm:space-x-4">
                  <Link
                    to="/"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Inicio
                  </Link>
                  <Link
                    to="/registro"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    Registro
                  </Link>
                  <Link
                    to="/mascotas"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    Mascotas
                  </Link>
                  <Link
                    to="/clinicas"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    Clínicas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<UserRegistration />} />
            <Route path="/mascotas" element={<PetManagement />} />
            <Route path="/clinicas" element={<ClinicsMap />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;