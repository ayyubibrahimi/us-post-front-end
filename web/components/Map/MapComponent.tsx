"use client";
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { css } from '@emotion/react';
import { fetchCSV, parseCsvData } from '../../utils/fetchCsvData';

interface MarkerData {
  lat: number;
  lng: number;
  isConnected: boolean; // New property to indicate if a connection has been made to this marker
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

interface Bounds {
  [key: string]: [[number, number], [number, number]]; // Southwest corner, Northeast corner
}


const boxStyle = css({
  position: 'absolute',
  top: '10px',
  left: '70vw', // Use viewport width to position the box further to the right
  zIndex: 1000,
  backgroundColor: 'rgba(200, 200, 200, .5)', // Adjusted to a light grey
  color: 'black',
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

const calculateArcedIntermediatePoints = (start, end, steps) => {
  // Ensure valid numbers for start and end coordinates
  if (!start || !end || isNaN(start[0]) || isNaN(start[1]) || isNaN(end[0]) || isNaN(end[1])) {
    console.error('Invalid start or end coordinates:', start, end);
    return []; // return an empty array to handle the error
  }

  // Calculate the midpoint, then raise it by a factor of the distance (to create the arc height)
  const midPointX = (start[0] + end[0]) / 2;
  const midPointY = (start[1] + end[1]) / 2;
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];

  // Pythagorean distance formula for the distance between points
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Increase the height of the arc relative to the distance
  const arcHeight = distance * 0.3; // Adjust this factor to increase arc height

  // Normal vector to the line segment points upwards for the arc
  const normal = { x: -dy, y: dx };
  const normalLength = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
  normal.x /= normalLength;
  normal.y /= normalLength;

  // Control point is the midpoint raised by the arc height
  const controlPoint = [midPointX + normal.x * arcHeight, midPointY + normal.y * arcHeight];

  // Calculate intermediate points along the quadratic Bezier curve
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic Bezier curve formula
    const x = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * controlPoint[0] + t * t * end[0];
    const y = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * controlPoint[1] + t * t * end[1];

    // Check for NaN results and ensure that values are defined
    if (isNaN(x) || isNaN(y)) {
      console.error(`Calculated NaN values for intermediate points: t=${t}, x=${x}, y=${y}`);
      continue; // Skip adding this point
    }

    points.push([x, y]);
  }

  return points;
};

const CreateCustomPane = () => {
  const map = useMap();

  useEffect(() => {
    if (!map.getPane('polylinePane')) {
      // Create a custom pane with a higher z-index than the default marker pane
      map.createPane('polylinePane');
      map.getPane('polylinePane').style.zIndex = 650; // Default marker pane is 600
    }
  }, [map]);

  return null;
};


const AnimatedPolyline = ({ connection, animationDuration }) => {
  const [redSegments, setRedSegments] = useState([]);
  const [blueSegments, setBlueSegments] = useState([]);
  const [animationPhase, setAnimationPhase] = useState('initial');

  useEffect(() => {
    if (!connection) return;

    const steps = 50; // Defines the granularity of the animation
    const intervalDuration = animationDuration / steps;
    const start = [connection.startLat, connection.startLng];
    const end = [connection.destinationLat, connection.destinationLng];
    const intermediatePoints = calculateArcedIntermediatePoints(start, end, steps);

    if (intermediatePoints.length === 0 || !start || !end) {
      console.error("Invalid start, end, or intermediate points.");
      return;
    }

    setRedSegments([start, ...intermediatePoints]);
    setAnimationPhase('red');

    // Start the blue line animation with a slight delay to ensure the red line is drawn first
    setTimeout(() => {
      animateBlueLine(intermediatePoints);
    }, intervalDuration * steps);
  }, [connection, animationDuration]);

  const animateBlueLine = (intermediatePoints) => {
    setAnimationPhase('blue');
    let currentStep = 0;
    const fullLength = intermediatePoints.length;
    const intervalDuration = animationDuration / (2 * fullLength); // Half duration for drawing, half for fading

    // Drawing phase: extend the blue line towards the destination
    let drawIntervalId = setInterval(() => {
      if (currentStep < fullLength) {
        setBlueSegments(intermediatePoints.slice(0, currentStep + 1));
        currentStep++;
      } else {
        clearInterval(drawIntervalId);
        fadeOutBlueLine(); // Start fading phase after drawing phase is complete
      }
    }, intervalDuration);

    // Fading phase: gradually remove segments from the start, making the line "shrink"
    const fadeOutBlueLine = () => {
      let fadeStep = 0;
      let fadeIntervalId = setInterval(() => {
        if (fadeStep < fullLength) {
          setBlueSegments(segments => segments.slice(1));
          fadeStep++;
        } else {
          clearInterval(fadeIntervalId);
          setAnimationPhase('completed');
          // Reset states for the next animation cycle
          setTimeout(() => {
            setAnimationPhase('initial');
            setBlueSegments([]); // Clear blue segments to prepare for the next animation
          }, 1000); // Delay to ensure the fade-out effect is visible
        }
      }, intervalDuration);
    };

    return () => {
      clearInterval(drawIntervalId);
      fadeOutBlueLine();
    };
  };

  return (
    <>
      {redSegments.length > 0 && (
        <Polyline
          positions={redSegments}
          color="rgba(0, 0, 255, .2)"
          opacity={1}
          pane="polylinePane"
        />
      )}
      {animationPhase === 'blue' && blueSegments.length > 0 && (
        <Polyline
          positions={blueSegments}
          color="rgba(34, 139, 34, .5)"
          opacity={1}
          pane="polylinePane"
        />
      )}
    </>
  );
};

// Icon for unconnected markers
const blackDotIcon = new L.DivIcon({
  className: 'marker-icon',
  html: '<div class="dot"></div>',
  iconSize: [10, 10],
  iconAnchor: [5, 5]
});

// Icon for connected markers
const connectedMarkerIcon = new L.DivIcon({
  className: 'connected-marker-icon',
  html: `
    <div class="halo"></div>
    <div class="dot"></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const mapStyle = {
width: '100%',
height: '60vh', // This sets the map height to 75% of the viewport height
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

function UpdateView({ center, bounds }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  map.setMaxBounds(bounds);
  return null;
}


const MapComponent: React.FC<{ filteredData: any[]; selectedState: any[] }> = ({ filteredData, selectedState }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [currentConnectionIndex, setCurrentConnectionIndex] = useState(0);
  const [selectedConnection, setSelectedConnection] = useState(null);


  const updateMarkerConnectionStatus = (destinationLat: number, destinationLng: number) => {
    setMarkers(markers => markers.map(marker => {
      if (marker.lat === destinationLat && marker.lng === destinationLng) {
        return { ...marker, isConnected: true };
      } else {
        return marker;
      }
    }));
  };

  const bounds = {
    Georgia: [
      [30.3554, -85.605], // Southwest corner
      [35.0007, -80.840], // Northeast corner
    ],
    Florida: [
      [24.396, -87.634], // Southwest corner
      [31.0007, -79.974], // Northeast corner
    ],
  };

  const Centralbounds = {
    Georgia: [[32.67805, -83.2225]],
    Florida: [[27.69835, -83.804]]
  };
  

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        // Process the employment data to get connections
        const connectionData = processEmploymentData(filteredData);
        setConnections(connectionData);

        // Create markers for all unique locations
        const uniqueLocations = extractUniqueLocations(filteredData);
        setMarkers(uniqueLocations);

        // If there are connections, set the first one as the selected connection
        if (connectionData.length > 0) {
          setSelectedConnection(connectionData[0]);
        }
      } catch (error) {
        console.error('Error parsing filtered data:', error);
      }
    };

    fetchDataAndSetState();
  }, [filteredData, selectedState]);


  useEffect(() => {
    if (connections.length > 0 && currentConnectionIndex < connections.length) {
      const delayBetweenConnections = 3000; // Delay before drawing the next connection
      const timer = setTimeout(() => {
        setCurrentConnectionIndex(currentIndex => {
          const newIndex = Math.min(currentIndex + 1, connections.length - 1);
          setSelectedConnection(connections[newIndex]);
          return newIndex;
        });
      }, delayBetweenConnections);

      return () => clearTimeout(timer);
    }
  }, [currentConnectionIndex, connections]);

  const mapCenter = selectedState === 'Florida' ? Centralbounds.Florida[0] : Centralbounds.Georgia[0];
  const selectedBounds = selectedState === 'Florida' ? bounds.Florida : bounds.Georgia;


  return (
    <>
      <style jsx global>{`
        .marker-icon .dot {
          width: 10px;
          height: 10px;
          background-color: black;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
  
        .connected-marker-icon .halo {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          box-shadow: 0 0 6px 2px orange;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
        }
  
        .connected-marker-icon .dot {
          width: 10px;
          height: 10px;
          background-color: black;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        }
      `}</style>
      <MapContainer
        center={mapCenter} // Set dynamically based on selectedState
        zoom={7} // Set the initial zoom level to frame the selected state appropriately
        style={mapStyle}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        zoomControl={true}
        dragging={true}
        // maxBounds={L.latLngBounds(L.latLng(selectedBounds[0]), L.latLng(selectedBounds[1]))} // Set dynamically based on selectedState
        minZoom={7}
        maxZoom={20}
      >
      {/* <UpdateView center={L.latLng(mapCenter)} bounds={L.latLngBounds(L.latLng(selectedBounds[0]), L.latLng(selectedBounds[1]))} /> */}
      <CreateCustomPane /> {/* This is where you add the CreateCustomPane component */}
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXl5dWJpYnJhaGltaSIsImEiOiJjbHNlNnJuaWkxN2VxMmtvNjZvbWgzMWpjIn0.f8SCWs9y7BuXwklThx_rDA"
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        />
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={[marker.lat, marker.lng]}
            icon={marker.isConnected ? connectedMarkerIcon : blackDotIcon}
          />
        ))}
        {connections.slice(0, currentConnectionIndex + 1).map((connection, idx) => (
          <AnimatedPolyline
            key={idx}
            connection={connection}
            animationDuration={1000}
            updateMarkerConnectionStatus={updateMarkerConnectionStatus} // Pass the function as a prop
          />
        ))}
        <InformationBox connection={selectedConnection} />
      </MapContainer>
    </>
  );
  }

export default MapComponent;

