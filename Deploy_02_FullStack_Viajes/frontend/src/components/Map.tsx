import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Heart, User } from 'lucide-react';
import type { Place, Location } from '../types';

interface MapProps {
  places: Place[];
  onLocationSelect: (location: Location) => void;
  selectedType: 'visited' | 'desired';
}

const visitedIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const desiredIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function LocationMarker({ onLocationSelect }: { onLocationSelect: (location: Location) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function Map({ places, onLocationSelect, selectedType }: MapProps) {
  return (
    <MapContainer
      center={[40.416775, -3.703790]}
      zoom={5}
      className="w-full h-[calc(100vh-4rem)]"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationSelect={onLocationSelect} />
      
      {places.map((place, index) => (
        <Marker
          key={place._id || index}
          position={[place.location.lat, place.location.lng]}
          icon={place.type === 'visited' ? visitedIcon : desiredIcon}
        >
          <Popup>
            <div className="p-2">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={place.userAvatar}
                  alt={place.userName}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium text-sm">{place.userName}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    {place.type === 'visited' ? (
                      <MapPin className="w-3 h-3 text-green-600" />
                    ) : (
                      <Heart className="w-3 h-3 text-red-600" />
                    )}
                    <span className="capitalize">{place.type}</span>
                  </div>
                </div>
              </div>
              {place.review && (
                <p className="text-sm mb-2">{place.review}</p>
              )}
              {place.experienceTemp && (
                <div className="text-sm text-gray-600">
                  Rating: {place.experienceTemp}/10
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}