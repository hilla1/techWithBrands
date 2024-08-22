import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const Contactmap = () => {
  const techwithBrandsPosition = [-1.283333, 36.833333]; // Coordinates for TechwithBrands

  return (
    <div className="relative mt-16 h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 z-10">
      <MapContainer
        center={techwithBrandsPosition}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={techwithBrandsPosition} icon={markerIcon}>
          <Popup permanent>
            <div>TechwithBrands</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Contactmap;
