"use client";
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import L from 'leaflet';
import { css } from '@emotion/react';

interface MarkerData {
  lat: number;
  lng: number;
  connectionCount: number; // New property to store the connection count
}

interface ConnectionData {
  uid: string;
  employStartDate: Date;
  separationDate: Date | null;
  startLat: number;
  startLng: number;
  destinationLat: number;
  destinationLng: number;
  firstName: string;
  middleName: string;
  lastName: string;
  departingAgencyName: string;
  arrivalAgencyName: string;
  separationCode: string;
}


interface EmploymentData {
  uid: string;
  employ_start_date: string;
  separation_date: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  separation_code: string; 
  agcy_name: string; 
  latitude: string;
  longitude: string;
}

const boxStyle = css({
  position: 'absolute',
  top: '10px',
  left: 'calc(50% + 50px)', // Adjusted to center the box horizontally with a slight right shift
  zIndex: 1000,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '20px',
  borderRadius: '5px',
  width: 'auto',
  minWidth: '400px',
  maxWidth: '60%',
  fontSize: '1rem',
  lineHeight: '1.6',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});


const agencyStyle = css({
  whiteSpace: 'nowrap', // Keeps agency names on a single line if space permits
  overflow: 'hidden', // Hide overflow
  textOverflow: 'ellipsis', // Use ellipsis for text that can't fit
  maxWidth: '100%', // Ensure that the text respects the box boundaries
});

const dateStyle = css({
  paddingBottom: '10px',
  fontSize: '1.1rem',
  textAlign: 'center', // Center the date horizontally
});

const InformationBox = ({ connection }) => {
  if (!connection) {
    return null; // Return null if no connection is selected
  }

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) : '';
  };

  return (
    <div css={boxStyle}>
      <div css={dateStyle}>
        <strong>{formatDate(connection.employStartDate)}</strong>
      </div>
      <div css={agencyStyle}><strong>Departing Agency:</strong> {connection.departingAgencyName}</div>
      <div><strong>Name:</strong> {`${connection.firstName} ${connection.middleName ? connection.middleName + ' ' : ''}${connection.lastName}`}</div>
      <div css={agencyStyle}><strong>Arriving Agency:</strong> {connection.arrivalAgencyName}</div>
      <div css={agencyStyle}><strong>Separation Reason:</strong> {connection.separationCode}</div>
    </div>
  );
};

const calculateIntermediatePoints = (start, end, steps) => {
  // Control point offsets (adjust as needed)
  const controlPointOffsetX = (end[1] - start[1]) * 0.1;
  const controlPointOffsetY = (end[0] - start[0]) * 0.1;

  // Calculate control points
  const controlPoint1 = [
    start[0] + controlPointOffsetX,
    start[1] + controlPointOffsetY
  ];
  const controlPoint2 = [
    end[0] - controlPointOffsetX,
    end[1] - controlPointOffsetY
  ];

  // Calculate intermediate points along the Bézier curve
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) ** 3 * start[0] + 3 * (1 - t) ** 2 * t * controlPoint1[0] + 3 * (1 - t) * t ** 2 * controlPoint2[0] + t ** 3 * end[0];
    const y = (1 - t) ** 3 * start[1] + 3 * (1 - t) ** 2 * t * controlPoint1[1] + 3 * (1 - t) * t ** 2 * controlPoint2[1] + t ** 3 * end[1];
    points.push([x, y]);
  }

  return points;
};

const AnimatedPolyline = ({ connection, animationDuration }) => {
  const [path, setPath] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset states when the connection prop changes
    setPath([]);
    setIsComplete(false);

    const steps = 100; // Number of steps for the animation
    const intervalDuration = animationDuration / steps;
    const start = [connection.startLat, connection.startLng];
    const end = [connection.destinationLat, connection.destinationLng];
    const intermediatePoints = calculateIntermediatePoints(start, end, steps);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(interval);
        setIsComplete(true); // Set complete to true once the end is reached
        setPath((currentPath) => [...currentPath, end]); // Make sure to add the last point
      } else {
        const nextStep = intermediatePoints[currentStep];
        if (nextStep) { // Check if the next step is defined
          setPath((currentPath) => [...currentPath, nextStep]);
        }
        currentStep++;
      }
    }, intervalDuration);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, [connection, animationDuration]); // Make sure connection is a dependency

  // Do not render if path is empty or connection is undefined
  if (path.length === 0 || !connection) {
    return null;
  }

  // Determine the color and opacity based on whether the animation is complete
  let color = isComplete ? "rgba(0, 122, 204, 0.6)" : "rgba(0, 92, 153, 0.6)"; // Default blue with reduced opacity
  const opacity = isComplete ? 0.6 : 1;

  // Check if separationCode is "termination" and change color accordingly
  if (connection.separationCode === "Termination") {
    color = "rgba(204, 0, 0, 0.6)"; // Red with reduced opacity
  }

  return <Polyline positions={path} color={color} opacity={opacity} />;
};


const blackDotIcon = new L.DivIcon({
  className: 'black-dot-icon', // This class name can be anything you choose
  html: '<div class="black-dot"></div>', // This will be the actual dot
  iconSize: [10, 10], // Size of the icon in pixels
});


const mapStyle = {
width: '100%',
height: '75vh', // This sets the map height to 75% of the viewport height
};

const SetViewToBounds = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
const map = useMap();
map.fitBounds(bounds);
return null;
};

const processEmploymentData = (data: EmploymentData[]): ConnectionData[] => {
  // Create a map to hold the employment data organized by uid
  const employmentMap = new Map<string, EmploymentData[]>();

  // Convert string dates in the data to Date objects for comparison and sorting
  const dataWithDates = data.map(row => ({
    ...row,
    employ_start_date: new Date(row.employ_start_date),
    separation_date: row.separation_date ? new Date(row.separation_date) : null
  }));

  // Iterate over the data and populate the map
  dataWithDates.forEach(row => {
    const employments = employmentMap.get(row.uid) || [];
    employments.push(row);
    employmentMap.set(row.uid, employments);
  });

  // Create connections based on sorted employments
  const connections: ConnectionData[] = [];
  employmentMap.forEach(employments => {
    employments.sort((a, b) => a.employ_start_date.getTime() - b.employ_start_date.getTime());

    for (let i = 0; i < employments.length - 1; i++) {
      const current = employments[i];
      const next = employments[i + 1];
      // Assuming next is not null because we're not at the last element
      connections.push({
        uid: current.uid,
        employStartDate: current.employ_start_date,
        separationDate: current.separation_date,
        startLat: parseFloat(current.latitude),
        startLng: parseFloat(current.longitude),
        destinationLat: parseFloat(next.latitude),
        destinationLng: parseFloat(next.longitude),
        firstName: current.first_name,
        middleName: current.middle_name,
        lastName: current.last_name,
        departingAgencyName: current.agcy_name,
        arrivalAgencyName: next.agcy_name,
        separationCode: current.separation_code,
      });
    }
  });

  return connections;
};

const extractUniqueLocations = (data: EmploymentData[]): MarkerData[] => {
  const uniqueLocations = new Map<string, MarkerData>();

  data.forEach(row => {
    const lat = parseFloat(row.latitude);
    const lng = parseFloat(row.longitude);
    const key = `${lat}-${lng}`;

    if (!isNaN(lat) && !isNaN(lng) && !uniqueLocations.has(key)) {
      uniqueLocations.set(key, { lat, lng });
    }
  });

  return Array.from(uniqueLocations.values());
};

const MapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [currentConnectionIndex, setCurrentConnectionIndex] = useState(0); // Adjusted to start from 0 for animation initiation
  const [selectedConnection, setSelectedConnection] = useState(null);

// Approximate bounds for the state of Florida
// const floridaBounds: L.LatLngBoundsExpression = [
//   [24.396308, -79.974760], // Southwest corner of Florida
//   [31.000968, -79.974760], // Northeast corner of Florida
// ];


useEffect(() => {
  fetchDataAndSetState();
}, []);

useEffect(() => {
  if (connections.length > 0 && currentConnectionIndex < connections.length) {
    const delayBetweenConnections = 3000; // Delay before drawing the next connection
    const timer = setTimeout(() => {
      setCurrentConnectionIndex(currentIndex => {
        const newIndex = Math.min(currentIndex + 1, connections.length - 1);
        setSelectedConnection(connections[newIndex]); // Update the selected connection information
        return newIndex;
      });
    }, delayBetweenConnections);

    return () => clearTimeout(timer);
  }
}, [currentConnectionIndex, connections]);
const fetchCSV = async (path: string): Promise<string> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.text();
};


const fetchDataAndSetState = async () => {
  const csvString = await fetchCSV('/employment_with_coordinates_georgia_test.csv');
  const parsedData = Papa.parse(csvString, { header: true });
  const rawData = parsedData.data as EmploymentData[];

  // Process the employment data to get connections
  const connectionData = processEmploymentData(rawData);
  setConnections(connectionData);

  // Create markers for all unique locations
  const uniqueLocations = extractUniqueLocations(rawData);
  setMarkers(uniqueLocations);
};


  return (
    <>
    <style jsx global>{`
      .black-dot-icon .black-dot {
        width: 10px;
        height: 10px;
        background-color: black;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `}</style>
      <MapContainer
        center={[27.994402, -81.760254]} // Central Florida coordinates
        zoom={7} // Zoom level, adjust if necessary to better focus on Florida
        style={mapStyle}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        zoomControl={false}
        dragging={true}
        maxBounds={floridaBounds} // Bounds set to the state of Florida
        minZoom={7} // Allows for a slight zoom out, adjust as needed
        maxZoom={10} // Allows for zooming in, adjust as needed
      >
      <SetViewToBounds bounds={floridaBounds} /> {/* Ensure this is correctly integrated */}
    
      <TileLayer
        url="https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXl5dWJpYnJhaGltaSIsImEiOiJjbHNlNnJuaWkxN2VxMmtvNjZvbWgzMWpjIn0.f8SCWs9y7BuXwklThx_rDA"
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
      />
        {markers.map((marker, idx) => (
        <Marker
          key={idx}
          position={[marker.lat, marker.lng]}
          icon={blackDotIcon}
        >
        </Marker>
      ))}
        <InformationBox connection={selectedConnection} />
        {connections.slice(0, currentConnectionIndex + 1).map((connection, idx) => (
        <AnimatedPolyline key={idx} connection={connection} animationDuration={1000} />
        ))}
    </MapContainer>
    </>
  );
};

export default MapComponent;
