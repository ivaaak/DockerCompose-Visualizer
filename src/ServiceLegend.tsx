import React from 'react';
import { Service } from './types';

interface ServiceLegendProps {
  services: Record<string, Service>;
}

const colorLegend = [
  { prefix: 'api', color: '#FF6B6B', label: 'API Services' },
  { prefix: 'db', color: '#FFBE76', label: 'Database Services' },
  { prefix: 'cache', color: '#45B7D1', label: 'Cache Services' },
  { prefix: 'queue', color: '#FFA07A', label: 'Queue Services' },
  { prefix: 'web', color: '#98D8C8', label: 'Web Services' },
  { prefix: 'auth', color: '#4ECDC4', label: 'Auth Services' },
  { prefix: 'util', color: '#45B7D1', label: 'Utility Services' },
  { prefix: 'other', color: '#A9A9A9', label: 'Other Services' },
];

const getColorForService = (serviceName: string): string => {
  for (const { prefix, color } of colorLegend) {
    if (serviceName.toLowerCase().startsWith(prefix)) {
      return color;
    }
  }
  return '#A9A9A9';  // Default color (grey) if no matching prefix
};

const ServiceLegend: React.FC<ServiceLegendProps> = ({ services }) => {
  return (
    <div className="service-legend">
      <h3>Services</h3>
      <div className="services-list">
        {Object.keys(services).map(serviceName => (
          <span 
            key={serviceName} 
            className="service-item"
            style={{ backgroundColor: getColorForService(serviceName) }}
          >
            {serviceName}
          </span>
        ))}
      </div>
      <h3>Color Legend</h3>
      <div className="color-legend">
        {colorLegend.map(({ prefix, color, label }) => (
          <div key={prefix} className="legend-item">
            <span className="color-box" style={{ backgroundColor: color }}></span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceLegend;