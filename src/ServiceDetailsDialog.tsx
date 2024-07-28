import React from 'react';
import { Service } from './types';
import './App.css';

interface ServiceDetailsDialogProps {
  service: Service | null;
  onClose: () => void;
}

const ServiceDetailsDialog: React.FC<ServiceDetailsDialogProps> = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{service.name}</h2>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="service-details">
          <p><strong>Image:</strong> {service.image || 'N/A'}</p>
          {service.ports && (
            <div>
              <strong>Ports:</strong>
              <ul>
                {service.ports.map((port, index) => <li key={index}>{port}</li>)}
              </ul>
            </div>
          )}
          {service.environment && (
            <div>
              <strong>Environment Variables:</strong>
              <ul>
                {Object.entries(service.environment).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </div>
          )}
          {service.volumes && (
            <div>
              <strong>Volumes:</strong>
              <ul>
                {service.volumes.map((volume, index) => <li key={index}>{volume}</li>)}
              </ul>
            </div>
          )}
          {service.depends_on && (
            <div>
              <strong>Depends On:</strong>
              <ul>
                {service.depends_on.map((dep, index) => <li key={index}>{dep}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsDialog;