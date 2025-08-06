import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  Typography,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import type { LeafletMouseEvent } from 'leaflet';

const INITIAL_CENTER: [number, number] = [12.9716, 77.5946];
const INITIAL_ZOOM = 15;

const DATA_SOURCES = [
  { id: 'open-meteo', name: 'Open-Meteo' },
  { id: 'mock-source', name: 'Mock Source' },
];

type ThresholdRule = {
  operator: string;
  value: number;
  color: string;
};

type PolygonData = {
  id: string;
  points: Array<[number, number]>;
  dataSource: string;
  field?: string;
  rules?: ThresholdRule[];
  value: number;
};

interface MapViewProps {
  currentTemp: string;
}

const PolygonDrawer = ({ drawing, setDrawing, currentPolygon, setCurrentPolygon }: any) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      if (!drawing) return;
      if (currentPolygon.length >= 12) return;
      setCurrentPolygon((prev: any) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
};

const getPolygonColor = (value: number, rules: ThresholdRule[] = []) => {
  for (const rule of rules) {
    switch (rule.operator) {
      case '>':
        if (value > rule.value) return rule.color;
        break;
      case '>=':
        if (value >= rule.value) return rule.color;
        break;
      case '<':
        if (value < rule.value) return rule.color;
        break;
      case '<=':
        if (value <= rule.value) return rule.color;
        break;
      case '=':
        if (value === rule.value) return rule.color;
        break;
      default:
        break;
    }
  }
  return '#7c3aed'; // default fallback
};

const MapView: React.FC<MapViewProps> = ({ currentTemp }) => {
  const [drawing, setDrawing] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState<Array<[number, number]>>([]);
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [showDataSourceDialog, setShowDataSourceDialog] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState(DATA_SOURCES[0].id);
  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(0);

  const sampleRules: ThresholdRule[] = [
    { operator: '>=', value: 25, color: 'green' },
    { operator: '<', value: 10, color: 'red' },
    { operator: '>=', value: 10, color: 'blue' },
  ];

  const handleReset = () => setMapKey((k) => k + 1);

  const handleFinishPolygon = () => {
    if (currentPolygon.length < 3) return;
    if (DATA_SOURCES.length > 1) {
      setShowDataSourceDialog(true);
    } else {
      finalizePolygon(DATA_SOURCES[0].id);
    }
  };

  const finalizePolygon = (sourceId: string) => {
    setPolygons((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        points: currentPolygon,
        dataSource: sourceId,
        field: 'temperature_2m',
        rules: sampleRules,
        value: Number(currentTemp), // 🔥 use currentTemp from slider
      },
    ]);
    setCurrentPolygon([]);
    setDrawing(false);
  };

  const handleConfirmDataSource = () => {
    finalizePolygon(selectedDataSource);
    setShowDataSourceDialog(false);
  };

  const handleDeletePolygon = (id: string) => {
    setPolygons((prev) => prev.filter((p) => p.id !== id));
    if (selectedPolygonId === id) setSelectedPolygonId(null);
  };

  // 🔄 Update polygon values when slider changes
  useEffect(() => {
    if (!currentTemp || isNaN(Number(currentTemp))) return;

    setPolygons(prev =>
      prev.map(p => ({
        ...p,
        value: Number(currentTemp),
      }))
    );
  }, [currentTemp]);

  return (
    <Box sx={{ display: 'flex', width: '100%', height: 540, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      {/* Sidebar */}
      <Box sx={{ width: 300, background: '#1f2333', color: '#fff', p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Polygon Tools</Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            if (drawing) {
              handleFinishPolygon();
            } else {
              setDrawing(true);
              setCurrentPolygon([]);
              setSelectedPolygonId(null);
            }
          }}
          sx={{ mb: 2, bgcolor: drawing ? '#7c3aed' : '#23263a' }}
          disabled={drawing && currentPolygon.length < 3}
        >
          {drawing ? 'Finish Polygon' : 'Draw Polygon'}
        </Button>

        {drawing && (
          <Typography sx={{ mb: 2 }}>
            Points: {currentPolygon.length} (min 3, max 12)
          </Typography>
        )}

        {polygons.length > 0 && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Polygons</Typography>
            {polygons.map((poly) => (
              <Box key={poly.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2c3145', p: 1, borderRadius: 1, mb: 1 }}>
                <Typography
                  sx={{ fontSize: 13, cursor: 'pointer' }}
                  onClick={() => setSelectedPolygonId(poly.id)}
                >
                  #{poly.id.slice(-4)} ({poly.points.length} pts)
                </Typography>
                <IconButton size="small" onClick={() => handleDeletePolygon(poly.id)}>
                  <DeleteIcon sx={{ color: '#f87171', fontSize: 18 }} />
                </IconButton>
              </Box>
            ))}
          </>
        )}

        {selectedPolygonId && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Configure Rules</Typography>
            <Select
              fullWidth
              value={polygons.find(p => p.id === selectedPolygonId)?.field || ''}
              onChange={e => {
                const newField = e.target.value;
                setPolygons(prev =>
                  prev.map(p =>
                    p.id === selectedPolygonId ? { ...p, field: newField } : p
                  )
                );
              }}
              sx={{ mt: 1, mb: 1 }}
            >
              <MenuItem value="temperature_2m">temperature_2m</MenuItem>
            </Select>
            {sampleRules.map((rule, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: 13 }}>{rule.operator} {rule.value}</Typography>
                <Box sx={{ width: 16, height: 16, bgcolor: rule.color, borderRadius: 1 }} />
              </Box>
            ))}
          </>
        )}

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Selected Temperature: <strong>{currentTemp}°C</strong>
        </Typography>
      </Box>

      {/* Map area */}
      <Box sx={{ flexGrow: 1 }}>
        <MapContainer
          key={mapKey}
          center={INITIAL_CENTER}
          zoom={INITIAL_ZOOM}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          dragging={true}
          zoomControl={true}
          attributionControl={false}
          minZoom={INITIAL_ZOOM}
          maxZoom={INITIAL_ZOOM}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {polygons.map((poly) => (
            <Polygon
              key={poly.id}
              positions={poly.points}
              pathOptions={{
                color: getPolygonColor(poly.value, poly.rules),
                fillColor: getPolygonColor(poly.value, poly.rules),
                fillOpacity: 0.4,
              }}
              eventHandlers={{ click: () => setSelectedPolygonId(poly.id) }}
            />
          ))}

          

          {drawing && currentPolygon.length >= 3 && (
            <Polygon
              positions={currentPolygon}
              pathOptions={{ color: '#7c3aed', fillColor: '#7c3aed', fillOpacity: 0.4 }}
            />
          )}

          <PolygonDrawer
            drawing={drawing}
            setDrawing={setDrawing}
            currentPolygon={currentPolygon}
            setCurrentPolygon={setCurrentPolygon}
          />
        </MapContainer>
      </Box>

      {/* Dialog to choose data source */}
      <Dialog open={showDataSourceDialog} onClose={() => setShowDataSourceDialog(false)}>
        <DialogTitle>Select Data Source</DialogTitle>
        <DialogContent>
          <Select
            value={selectedDataSource}
            onChange={e => setSelectedDataSource(e.target.value)}
            fullWidth
          >
            {DATA_SOURCES.map(ds => (
              <MenuItem key={ds.id} value={ds.id}>{ds.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDataSourceDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDataSource} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MapView;