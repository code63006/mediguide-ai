import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const Map = ({ doctors, userLocation }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">🗺️ Nearby Healthcare Providers</h2>
      <div className="relative">
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerClassName="rounded-lg h-96 w-full"
            center={userLocation || { lat: 37.7749, lng: -122.4194 }}
            zoom={13}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234B5563' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='8' fill='%233B82F6' stroke='white' stroke-width='2'/%3E%3C/svg%3E",
                  scaledSize: window.google.maps.Size(24, 24)
                }}
              />
            )}
            
            {doctors.map((doctor) => (
              <Marker
                key={doctor.id}
                position={{ lat: doctor.lat, lng: doctor.lng }}
                title={doctor.name}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {doctors.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold mb-2">Showing {doctors.length} doctors:</p>
          <div className="space-y-2">
            {doctors.map(doctor => (
              <div key={doctor.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-sm text-gray-600">{doctor.distance}</p>
                </div>
                <button 
                  onClick={() => {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${doctor.lat},${doctor.lng}`, '_blank');
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
