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
  const nairobiPosition = [-1.286389, 36.817223]; // Coordinates for Nairobi
  const techwithBrandsPosition = [-1.283333, 36.833333]; // Random coordinates near Nairobi for TechwithBrands

  return (
    <div className="w-full h-60 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[40rem] mt-16"> {/* Add margin-top */}
      <MapContainer
        center={nairobiPosition}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={nairobiPosition} icon={markerIcon}>
          <Popup>Nairobi</Popup>
        </Marker>
        <Marker position={techwithBrandsPosition} icon={markerIcon}>
          <Popup>TechwithBrands</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Contactmap;
