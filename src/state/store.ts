import { create } from 'zustand';

export interface PolygonData {
  id: string;
  lat: number;
  lon: number;
  temperatures: { [hour: number]: number };
}

export interface TimelineState {
  mode: 'single' | 'range';
  value: number | [number, number];
}

export interface AppState {
  polygons: PolygonData[];
  timeline: TimelineState;
  temperatureData: number[]; // ✅ Add this
  updateTimeline: (timeline: Partial<TimelineState>) => void;
  updateTemperature: (id: string, hour: number, temp: number) => void;
  setTemperatureData: (data: number[]) => void; // ✅ Add this
}

export const useStore = create<AppState>((set) => ({
  polygons: [],
  timeline: {
    mode: 'single',
    value: 0,
  },
  temperatureData: [], // ✅ Add this

  updateTimeline: (newTimeline) =>
    set((state) => ({
      timeline: { ...state.timeline, ...newTimeline },
    })),

  updateTemperature: (id, hour, temp) => {
    set((state) => ({
      polygons: state.polygons.map((polygon) =>
        polygon.id === id
          ? {
              ...polygon,
              temperatures: {
                ...polygon.temperatures,
                [hour]: temp,
              },
            }
          : polygon
      ),
    }));
  },

  setTemperatureData: (data) => set({ temperatureData: data }), // ✅ Add this
}));
