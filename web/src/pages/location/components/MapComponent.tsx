import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrigir os ícones do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    latitude?: number;
    longitude?: number;
    onSelectLocation: (lat: number, lng: number) => void;
}

export default function MapComponent({
    latitude,
    longitude,
    onSelectLocation
}: MapComponentProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    // Centro padrão (Brasil)
    const defaultCenter: [number, number] = [-14.235, -51.9253];
    const initialZoom = latitude && longitude ? 15 : 5;

    useEffect(() => {
        if (!mapRef.current) return;

        // Inicializar o mapa
        if (!mapInstance.current) {
            const map = L.map(mapRef.current).setView(
                latitude && longitude ? [latitude, longitude] : defaultCenter,
                initialZoom
            );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Adicionar marcador se houver coordenadas
            if (latitude && longitude) {
                markerRef.current = L.marker([latitude, longitude], { draggable: true })
                    .addTo(map)
                    .on('dragend', () => {
                        // Arrow function não tem seu próprio 'this'
                        if (markerRef.current) {
                            const position = markerRef.current.getLatLng();
                            onSelectLocation(position.lat, position.lng);
                        }
                    });
            }

            // Evento de clique no mapa para adicionar/mover o marcador
            map.on('click', (event) => {
                const { lat, lng } = event.latlng;

                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                } else {
                    markerRef.current = L.marker([lat, lng], { draggable: true })
                        .addTo(map)
                        .on('dragend', () => {
                            // Arrow function não tem seu próprio 'this'
                            if (markerRef.current) {
                                const position = markerRef.current.getLatLng();
                                onSelectLocation(position.lat, position.lng);
                            }
                        });
                }

                onSelectLocation(lat, lng);
            });

            mapInstance.current = map;
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                markerRef.current = null;
            }
        };
    }, []);

    // Atualizar o mapa quando as coordenadas mudarem
    useEffect(() => {
        if (mapInstance.current && latitude !== undefined && longitude !== undefined) {
            mapInstance.current.setView([latitude, longitude], 15);

            if (markerRef.current) {
                markerRef.current.setLatLng([latitude, longitude]);
            } else {
                markerRef.current = L.marker([latitude, longitude], { draggable: true })
                    .addTo(mapInstance.current)
                    .on('dragend', () => {
                        // Arrow function não tem seu próprio 'this'
                        if (markerRef.current) {
                            const position = markerRef.current.getLatLng();
                            onSelectLocation(position.lat, position.lng);
                        }
                    });
            }
        }
    }, [latitude, longitude, onSelectLocation]);

    return (
        <Box
            ref={mapRef}
            sx={{
                height: '350px',
                width: '100%',
                borderRadius: 1,
                border: '1px solid #ccc'
            }}
        />
    );
}