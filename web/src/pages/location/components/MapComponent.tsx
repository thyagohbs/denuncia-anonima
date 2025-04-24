import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Certifique-se de que as imagens do marcador estão disponíveis
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  onClick?: (lat: number, lng: number) => void;
  markerPosition?: [number, number] | null;
  style?: React.CSSProperties;
}

export default function MapComponent({
  center = [-9.6498, -35.7089], // Maceió, AL como padrão
  zoom = 13,
  onClick,
  markerPosition = null,
  style = {}
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Inicializar o mapa
      const mapInstance = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Adicionar evento de clique se onClick for fornecido
      if (onClick) {
        mapInstance.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onClick(lat, lng);
        });
      }

      mapInstanceRef.current = mapInstance;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Atualizar a posição do marcador quando markerPosition mudar
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Remover marcador existente
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      // Adicionar novo marcador se posição for fornecida
      if (markerPosition) {
        markerRef.current = L.marker(markerPosition, { icon })
          .addTo(mapInstanceRef.current);

        // Centraliza o mapa na posição do marcador
        mapInstanceRef.current.setView(markerPosition, mapInstanceRef.current.getZoom());
      }
    }
  }, [markerPosition]);

  return (
    <div
      ref={mapRef}
      style={{
        height: '400px',
        width: '100%',
        borderRadius: '4px',
        ...style
      }}
    />
  );
}