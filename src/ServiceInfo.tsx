import React from 'react';
import { Service } from './types';

interface ServiceInfoProps {
  service: Service;
}

const ServiceInfo: React.FC<ServiceInfoProps> = ({ service }) => {
  return (
    <div>
      <h2>{service.name}</h2>
      <ul>
        <li>Image: {service.image || 'N/A'}</li>
        <li>Ports: {service.ports ? service.ports.join(', ') : 'N/A'}</li>
        <li>Environment: {service.environment ? Object.entries(service.environment).map(([key, value]) => `${key}=${value}`).join(', ') : 'N/A'}</li>
        <li>Volumes: {service.volumes ? service.volumes.join(', ') : 'N/A'}</li>
      </ul>
    </div>
  );
}

export default ServiceInfo;