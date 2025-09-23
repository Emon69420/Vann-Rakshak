import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ZoomIn, ZoomOut, Home, Download } from 'lucide-react';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});
interface MapViewerProps {
  height?: string;
  showControls?: boolean;
}
const MapViewer: React.FC<MapViewerProps> = ({
  height = "600px",
  showControls = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    [key: string]: L.TileLayer;
  }>({});
  const [currentLayer, setCurrentLayer] = useState<string>('OpenStreetMap');
  
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      // Center of India
      zoom: 5,
      zoomControl: false
    });
    mapInstanceRef.current = map;

    // Base layers
    const baseLayers = {
      'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }),
      'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri',
        maxZoom: 19
      }),
      'Terrain': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri',
        maxZoom: 13
      })
    };

    // Add default base layer
    baseLayers['OpenStreetMap'].addTo(map);
    layersRef.current = baseLayers;

    // Add some sample FRA claim markers
    const sampleClaims = [{
      lat: 22.7196,
      lng: 75.8577,
      title: "IFR Claim - Village Khargone",
      type: "IFR",
      status: "Approved"
    }, {
      lat: 21.2514,
      lng: 81.6296,
      title: "CFR Claim - Bastar District",
      type: "CFR",
      status: "Pending"
    }, {
      lat: 19.7515,
      lng: 75.7139,
      title: "CR Claim - Aurangabad",
      type: "CR",
      status: "Approved"
    }, {
      lat: 26.2006,
      lng: 92.9376,
      title: "IFR Claim - Guwahati",
      type: "IFR",
      status: "Under Review"
    }];

    // Custom markers for different claim types
    const createCustomIcon = (type: string, status: string) => {
      let color = '#10b981'; // Default green
      if (status === 'Pending') color = '#f59e0b';
      if (status === 'Under Review') color = '#3b82f6';
      if (status === 'Rejected') color = '#ef4444';
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 10px;
          ">${type.charAt(0)}</div>
        `,
        iconSize: [25, 25],
        iconAnchor: [12, 12]
      });
    };

    // Add markers
    sampleClaims.forEach(claim => {
      const marker = L.marker([claim.lat, claim.lng], {
        icon: createCustomIcon(claim.type, claim.status)
      }).addTo(map);
      marker.bindPopup(`
        <div class="p-3">
          <h3 class="font-semibold text-lg">${claim.title}</h3>
          <p class="text-sm text-gray-600">Type: ${claim.type}</p>
          <p class="text-sm">Status: <span class="px-2 py-1 rounded text-xs ${claim.status === 'Approved' ? 'bg-green-100 text-green-800' : claim.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : claim.status === 'Under Review' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}">${claim.status}</span></p>
          <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
            View Details
          </button>
        </div>
      `);
    });

    // Add scale control
    L.control.scale({
      position: 'bottomleft'
    }).addTo(map);
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  const zoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };
  const zoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };
  const resetView = () => {
    mapInstanceRef.current?.setView([20.5937, 78.9629], 5);
  };
  const switchLayer = (layerName: string) => {
    if (!mapInstanceRef.current) return;

    // Remove current layers
    Object.values(layersRef.current).forEach(layer => {
      mapInstanceRef.current?.removeLayer(layer);
    });

    // Add selected layer
    if (layersRef.current[layerName]) {
      layersRef.current[layerName].addTo(mapInstanceRef.current);
      setCurrentLayer(layerName);
    }
  };
  return <Card className="p-0 overflow-hidden">
      <div className="relative">
        <div ref={mapRef} style={{
        height,
        width: '100%'
      }} className="rounded-lg" />
        
        {showControls && <>
            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-2">
              <button 
                onClick={zoomIn} 
                className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-md shadow-md transition-colors"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={zoomOut} 
                className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-md shadow-md transition-colors"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={resetView} 
                className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-md shadow-md transition-colors"
              >
                <Home className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Layer Controls */}
            <div className="absolute top-4 right-4 z-[1000]">
              <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Layers className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-800">Base Layers</span>
                </div>
                <div className="space-y-1">
                  {['OpenStreetMap', 'Satellite', 'Terrain'].map(layerName => (
                    <button 
                      key={layerName} 
                      onClick={() => switchLayer(layerName)} 
                      className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors border ${
                        currentLayer === layerName 
                          ? 'bg-blue-100 border-blue-300 text-blue-800' 
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      {layerName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Tools */}
            <div className="absolute bottom-4 right-4 z-[1000]">
              <button className="flex items-center space-x-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-md shadow-md transition-colors text-sm">
                <Download className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Export</span>
              </button>
            </div>
          </>}
      </div>
    </Card>;
};
export default MapViewer;
