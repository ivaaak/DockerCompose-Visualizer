import React, { useEffect, useState } from 'react';
import createEngine, {
  DiagramModel,
  DefaultNodeModel,
  DefaultLinkModel,
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { Service } from './types';
import ServiceLegend from './ServiceLegend';
import ServiceDetailsDialog from './ServiceDetailsDialog';
import './App.css';
import './ServiceDetailsDialog.css';

interface VisualizerProps {
  services: Record<string, Service>;
  onSelectService: (service: Service) => void;
}

const Visualizer: React.FC<VisualizerProps> = ({ services, onSelectService }) => {
  const [engine, setEngine] = useState<ReturnType<typeof createEngine> | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const engine = createEngine();
    const model = new DiagramModel();

    const nodes: Record<string, DefaultNodeModel> = {};
    const links: DefaultLinkModel[] = [];

    // Group services by prefix
    const groupedServices: Record<string, string[]> = {};
    Object.keys(services).forEach(serviceName => {
      const prefix = serviceName.split('-')[0];
      if (!groupedServices[prefix]) {
        groupedServices[prefix] = [];
      }
      groupedServices[prefix].push(serviceName);
    });

    // Layout configuration
    const nodeWidth = 200;
    const nodeHeight = 50;
    const nodePadding = 10;
    const groupPadding = 20;
    const groupsPerRow = 3;

    // Calculate positions for each group
    const groupPositions: Record<string, { x: number, y: number }> = {};
    let maxGroupWidth = 0;
    let maxGroupHeight = 0;

    Object.entries(groupedServices).forEach(([prefix, serviceNames], groupIndex) => {
      const itemsPerRow = Math.ceil(Math.sqrt(serviceNames.length));
      const groupWidth = itemsPerRow * (nodeWidth + nodePadding) - nodePadding + groupPadding * 2;
      const groupHeight = Math.ceil(serviceNames.length / itemsPerRow) * (nodeHeight + nodePadding) - nodePadding + groupPadding * 2;

      maxGroupWidth = Math.max(maxGroupWidth, groupWidth);
      maxGroupHeight = Math.max(maxGroupHeight, groupHeight);

      const row = Math.floor(groupIndex / groupsPerRow);
      const col = groupIndex % groupsPerRow;

      groupPositions[prefix] = {
        x: col * (maxGroupWidth + groupPadding),
        y: row * (maxGroupHeight + groupPadding)
      };
    });

    // Create nodes
    Object.entries(services).forEach(([serviceName, serviceConfig]) => {
      const prefix = serviceName.split('-')[0];
      const groupPosition = groupPositions[prefix];
      const servicesInGroup = groupedServices[prefix].length;
      const indexInGroup = groupedServices[prefix].indexOf(serviceName);

      const itemsPerRow = Math.ceil(Math.sqrt(servicesInGroup));
      const row = Math.floor(indexInGroup / itemsPerRow);
      const col = indexInGroup % itemsPerRow;

      const x = groupPosition.x + col * (nodeWidth + nodePadding) + nodeWidth / 2 + groupPadding;
      const y = groupPosition.y + row * (nodeHeight + nodePadding) + nodeHeight / 2 + groupPadding;

      const node = new DefaultNodeModel({
        name: serviceName,
        color: getColorForService(serviceName)
      });
      node.setPosition(x, y);
      nodes[serviceName] = node;

      node.registerListener({
        selectionChanged: (event: any ) => {
          console.log('Selection changed for node:', serviceName, 'Selected:', event.isSelected);
          if (event.isSelected) {
            console.log('Node selected:', serviceName);
            setSelectedService(serviceConfig);
            onSelectService(serviceConfig);
          }
        }
      });
    });

    // Create links
    Object.entries(services).forEach(([serviceName, serviceConfig]) => {
      if (serviceConfig.depends_on) {
        serviceConfig.depends_on.forEach((dependency) => {
          if (nodes[dependency]) {
            const link = new DefaultLinkModel();
            link.setSourcePort(nodes[serviceName].getPort('out'));
            link.setTargetPort(nodes[dependency].getPort('in'));
            links.push(link);
          }
        });
      }
    });

    model.addAll(...Object.values(nodes), ...links);
    engine.setModel(model);

    setEngine(engine);
  }, [services]);


  useEffect(() => {
    console.log('Selected service changed:', selectedService);
  }, [selectedService]);

  const getColorForService = (serviceName: string): string => {
    const prefixes = {
      'api': '#FF6B6B',  // Red
      'db': '#FFBE76',   // Teal
      'cache': '#45B7D1', // Light Blue
      'queue': '#FFA07A', // Light Salmon
      'web': '#98D8C8',  // Pale Green
      'auth': '#4ECDC4', // Light Orange
      'util': '#45B7D1', // Light Orange
    };

    for (const [prefix, color] of Object.entries(prefixes)) {
      if (serviceName.toLowerCase().startsWith(prefix)) {
        return color;
      }
    }

    return '#A9A9A9';
  };

  if (!engine) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="visualizer-container">
        <div style={{ height: '800px', width: '100%', overflow: 'hidden' }}>
          <CanvasWidget
            engine={engine}
            className="diagram-container"
          />
        </div>
        <ServiceLegend services={services} />
        {selectedService && (
          <ServiceDetailsDialog 
            service={selectedService} 
            onClose={() => {
              console.log('Closing dialog');
              setSelectedService(null);
            }}
          />
        )}
      </div>
      <div>
        <h3>Nodes:</h3>
        <ul>
          {engine.getModel().getNodes().map(node => (
            <li key={node.getID()}>{node.getOptions().type} - Position: ({node.getPosition().x}, {node.getPosition().y})</li>
          ))}
        </ul>
      </div>

    </>
  );
}

export default Visualizer;