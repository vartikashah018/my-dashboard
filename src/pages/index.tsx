import dynamic from 'next/dynamic';
import { useState } from 'react';
import TimelineSlider from '@/components/TimelineSlider';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function Home() {
  const [currentTemp, setCurrentTemp] = useState<string>('N/A');
  const [darkMode, setDarkMode] = useState(true);

  const generateTimeline = () => {
    const now = new Date();
    const timeline: Date[] = [];
    for (let i = -15 * 24; i <= 15 * 24; i++) {
      timeline.push(new Date(now.getTime() + i * 60 * 60 * 1000));
    }
    return timeline;
  };

  const timeline = generateTimeline();
  const temperatureArray = timeline.map(() => Math.floor(Math.random() * 35));

  const theme = {
    background: darkMode ? '#0f111a' : '#f5f5f5',
    text: darkMode ? '#ffffff' : '#1a1a1a',
    header: darkMode ? '#151826' : '#ffffff',
    shadow: darkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          backgroundColor: theme.header,
          boxShadow: theme.shadow,
          padding: '24px 32px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: '700',
                margin: 0,
                color: theme.text,
                letterSpacing: '-0.5px',
              }}
            >
              Analytics Dashboard
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                backgroundColor: darkMode ? '#2c2f3a' : '#ddd',
                color: darkMode ? '#fff' : '#333',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          <div style={{ marginTop: '16px' }}>
            <TimelineSlider timeline={timeline} temps={temperatureArray} onTempChange={setCurrentTemp} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          display: 'flex',
          flexDirection: 'row',
          paddingTop: '320px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: '240px',
            backgroundColor: darkMode ? '#1f2333' : '#eaeaea',
            padding: '16px',
            borderRadius: '8px',
            marginRight: '24px',
            height: 'fit-content',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Tools</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>📍 Draw Polygon</li>
            <li style={{ marginBottom: '0.5rem' }}>🌡️ Temperature Rules</li>
            <li style={{ marginBottom: '0.5rem' }}>🗺️ Map Layers</li>
          </ul>
        </aside>

        {/* Map View */}
        <section style={{ flexGrow: 1 }}>
          <MapView currentTemp={currentTemp} />
        </section>
      </main>
    </div>
  );
}
import { Box, Typography, Button, IconButton, Select } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStore } from '@/state/store';