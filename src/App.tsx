import React, { useState } from 'react';
import FileUpload from './FileUpload';
import Visualizer from './Visualizer';
import ServiceInfo from './ServiceInfo';
import { Service } from './types';
import './App.css';

const App: React.FC = () => {
  const [services, setServices] = useState<Record<string, Service> | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleFileUpload = (parsedServices: Record<string, Service>) => {
    console.log('Services received in App:', parsedServices);  // Log received services
    setServices(parsedServices);
  };

  return (
    <div className="App">
      <h1>Docker Compose Visualizer</h1>
      <FileUpload onFileUpload={handleFileUpload} />
      {services && Object.keys(services).length > 0 ? (
        <>
          <Visualizer
            services={services}
            onSelectService={setSelectedService}
          />
          {selectedService && <ServiceInfo service={selectedService} />}
        </>
      ) : (
        <p>No services loaded or visualizer not rendered</p>
      )}
    </div>
  );
}

export default App;