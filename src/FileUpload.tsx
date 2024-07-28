import React from 'react';
import yaml from 'yaml';
import { Service } from './types';

interface FileUploadProps {
  onFileUpload: (services: Record<string, Service>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result as string;
        const parsedYaml = yaml.parse(content);
        const services: Record<string, Service> = parsedYaml.services || {};
        Object.keys(services).forEach(key => {
          services[key].name = key;
        });
        console.log('Parsed services:', services);  // Log parsed services
        onFileUpload(services);
      } catch (error) {
        console.error('Error parsing YAML:', error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".yml,.yaml" />
    </div>
  );
}

export default FileUpload;