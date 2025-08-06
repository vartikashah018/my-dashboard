import React, { useState } from 'react';
interface TimelineSliderProps {
  timeline: Date[];
  temps: number[];
  onTempChange?: (temp: string) => void;
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({ timeline, temps, onTempChange }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [range, setRange] = useState<[number, number]>([0, timeline.length - 1]);
  const [selectedIndex, setSelectedIndex] = useState<number>(timeline.length - 1);

  const visibleRange = timeline.slice(range[0], range[1] + 1);
  const zoomedRange = visibleRange.slice(0, Math.floor(visibleRange.length / zoomLevel));

  const presets = {
    'Last 24 Hours': [timeline.length - 24, timeline.length - 1],
    'Past Week': [timeline.length - 168, timeline.length - 1],
    'Full Range': [0, timeline.length - 1],
  };

  const calculateAverageTemp = (temps: number[], start: number, end: number) => {
    const sliced = temps.slice(start, end + 1);
    const avg = sliced.reduce((acc, val) => acc + val, 0) / sliced.length;
    return avg.toFixed(1);
  };

  const handleChange = (index: number) => {
    setSelectedIndex(index);
    if (onTempChange && zoomedRange[index]) {
      const temp = calculateAverageTemp(temps, index, index);
      onTempChange(temp);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.buttonGroup}>
        {Object.entries(presets).map(([label, [start, end]]) => (
          <button key={label} style={styles.button} onClick={() => setRange([start, end])}>
            {label}
          </button>
        ))}
      </div>

      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}>➖ Zoom Out</button>
        <button style={styles.button} onClick={() => setZoomLevel(Math.min(4, zoomLevel + 1))}>➕ Zoom In</button>
      </div>

      <div style={styles.sliderContainer}>
        <input
          type="range"
          min={0}
          max={zoomedRange.length - 1}
          value={selectedIndex}
          onChange={(e) => handleChange(Number(e.target.value))}
          onMouseMove={(e) => {
            const index = Math.floor((e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * zoomedRange.length);
            setHoverIndex(index);
          }}
          style={styles.slider}
        />
        {hoverIndex !== null && zoomedRange[hoverIndex] && (
          <div style={{ ...styles.tooltip, left: `${(hoverIndex / zoomedRange.length) * 100}%` }}>
            {zoomedRange[hoverIndex].toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineSlider;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '1rem',
    backgroundColor: '#151826',
    borderRadius: '8px',
    fontFamily: 'sans-serif',
    color: 'white',
  },
  buttonGroup: {
    marginBottom: '0.5rem',
  },
  button: {
    marginRight: '0.5rem',
    padding: '0.4rem 0.8rem',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  sliderContainer: {
    position: 'relative',
    marginTop: '1rem',
  },
  slider: {
    width: '100%',
    height: '32px',
    appearance: 'none',
    backgroundColor: '#2c2f3a',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer',
    border: '1px solid #444',
  },
  tooltip: {
    position: 'absolute',
    top: '-30px',
    transform: 'translateX(-50%)',
    backgroundColor: '#333',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
  },
};
