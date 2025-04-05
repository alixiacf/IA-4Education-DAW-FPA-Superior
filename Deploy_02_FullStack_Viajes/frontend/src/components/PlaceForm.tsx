import React from 'react';
import type { Location } from '../types';

interface PlaceFormProps {
  location: Location;
  type: 'visited' | 'desired';
  onSubmit: (data: { review: string; experienceTemp: number }) => void;
  onClose: () => void;
}

export default function PlaceForm({ location, type, onSubmit, onClose }: PlaceFormProps) {
  const [review, setReview] = React.useState('');
  const [experienceTemp, setExperienceTemp] = React.useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ review, experienceTemp });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 capitalize">
          Add {type} Place
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="text-sm text-gray-600">
              Latitud: {location.lat.toFixed(6)}, Longitud: {location.lng.toFixed(6)}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Rating (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="w-full px-3 py-2 border rounded-md"
              value={experienceTemp}
              onChange={(e) => setExperienceTemp(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Place
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}