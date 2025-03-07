import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Clinic } from '../types';
import { getClinics } from '../services/api';

export default function ClinicMap() {
  const [clinics, setClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    const loadClinics = async () => {
      try {
        const data = await getClinics();
        setClinics(data);
      } catch (error) {
        console.error('Error loading clinics:', error);
      }
    };

    loadClinics();
  }, []);

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[40.416775, -3.703790]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {clinics.map((clinic) => (
          <Marker key={clinic.id} position={[clinic.lat, clinic.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{clinic.nombre}</h3>
                <p className="text-sm text-gray-600">{clinic.direccion}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}