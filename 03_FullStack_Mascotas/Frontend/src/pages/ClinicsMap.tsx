import React from 'react';
import ClinicMap from '../components/ClinicMap';

export default function ClinicsMap() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Clínicas Veterinarias
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Encuentra las clínicas veterinarias más cercanas
          </p>
        </div>
        <ClinicMap />
      </div>
    </div>
  );
}