import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { CarsPage } from './pages/CarsPage';
import { NewTripPage } from './pages/NewTripPage';
import { TripDetailPage } from './pages/TripDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="calculator" element={<CalculatorPage />} />
          <Route path="cars" element={<CarsPage />} />
          <Route path="trips/new" element={<NewTripPage />} />
          <Route path="trips/:id" element={<TripDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;