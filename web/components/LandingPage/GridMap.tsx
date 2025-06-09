import React from "react";

interface GridMapProps {
  onStateClick: (state: string) => void;
  onLouisianaClick: () => void;
}

const GridMap: React.FC<GridMapProps> = ({
  onStateClick,
  onLouisianaClick,
}) => {
  const grid = [
    // Row 0
    [
      { state: "AK", col: 0 },
      { state: "ME", col: 10 },
    ],
    // Row 1
    [
      { state: "WI", col: 6 },
      { state: "VT", col: 9 },
      { state: "NH", col: 10 },
    ],
    // Row 2
    [
      { state: "WA", col: 0 },
      { state: "ID", col: 1 },
      { state: "MT", col: 2 },
      { state: "ND", col: 3 },
      { state: "MN", col: 4 },
      { state: "IL", col: 5 },
      { state: "MI", col: 6 },
      { state: "NY", col: 8 },
      { state: "MA", col: 9 },
      { state: "RI", col: 10 },
    ],
    // Row 3
    [
      { state: "OR", col: 0 },
      { state: "UT", col: 1 },
      { state: "WY", col: 2 },
      { state: "SD", col: 3 },
      { state: "IA", col: 4 },
      { state: "IN", col: 5 },
      { state: "OH", col: 6 },
      { state: "PA", col: 7 },
      { state: "NJ", col: 8 },
      { state: "CT", col: 9 },
    ],
    // Row 4
    [
      { state: "CA", col: 0 },
      { state: "NV", col: 1 },
      { state: "CO", col: 2 },
      { state: "NE", col: 3 },
      { state: "MO", col: 4 },
      { state: "KY", col: 5 },
      { state: "WV", col: 6 },
      { state: "VA", col: 7 },
      { state: "MD", col: 8 },
      { state: "DE", col: 9 },
    ],
    // Row 5
    [
      { state: "AZ", col: 1 },
      { state: "NM", col: 2 },
      { state: "KS", col: 3 },
      { state: "AR", col: 4 },
      { state: "TN", col: 5 },
      { state: "NC", col: 6 },
      { state: "SC", col: 7 },
      { state: "DC", col: 8 },
    ],
    // Row 6
    [
      { state: "HI", col: 0 },
      { state: "OK", col: 3 },
      { state: "LA", col: 4 },
      { state: "MS", col: 5 },
      { state: "AL", col: 6 },
      { state: "GA", col: 7 },
    ],
    // Row 7
    [
      { state: "TX", col: 2 },
      { state: "FL", col: 7 },
    ],
  ];

  const stateStatus: Record<string, string> = {
    // Full Data Available (teal)
    WA: "full",
    OR: "full",
    CA: "full",
    ID: "full",
    UT: "full",
    WY: "full",
    AZ: "full",
    NM: "full",
    KS: "full",
    TX: "full",
    MN: "full",
    IL: "full",
    IN: "full",
    OH: "full",
    KY: "full",
    TN: "full",
    NC: "full",
    SC: "full",
    GA: "full",
    MS: "full",
    WV: "full",
    MD: "full",
    DE: "full",
    VT: "full",
    RI: "full",
    FL: "full",
    DC: "full",

    // Data Coming Soon (light green)
    AK: "coming",
    HI: "coming",
    IA: "coming",

    // Some Data Available (yellow)
    LA: "some",
    NE: "technical",

    // No Data (Technical Barrier) (orange)
    NH: "technical",
    MA: "technical",
    CT: "technical",
    NJ: "technical",

    // No Data (Legal Barrier) (pink)
    MT: "legal",
    ND: "legal",
    SD: "legal",
    NV: "legal",
    CO: "legal",
    WI: "legal",
    MI: "legal",
    MO: "legal",
    AR: "legal",
    OK: "legal",
    AL: "legal",
    PA: "legal",
    VA: "legal",
    NY: "legal",
    ME: "legal",
  };

  // States that have data
  const clickableStates = [
    "AZ",
    "CA",
    "FL",
    "GA",
    "IL",
    "ID",
    "IN",
    "KS",
    "KY",
    "LA",
    "MD",
    "MN",
    "MS",
    "NM",
    "NC",
    "OH",
    "OR",
    "SC",
    "TN",
    "TX",
    "UT",
    "WA",
    "VT",
    "WV",
    "WY",
  ];

  const getStateColor = (state: string) => {
    const status = stateStatus[state];
    switch (status) {
      case "full":
        return "#93C5C5"; // Teal
      case "coming":
        return "#C8E6C9"; // Light green
      case "some":
        return "#FFF9C4"; // Light yellow
      case "technical":
        return "#FFCCBC"; // Light orange
      case "legal":
        return "#F8BBD0"; // Light pink
      default:
        return "#E0E0E0"; // Gray
    }
  };

  const formatStateForUrl = (state: string) => {
    return state.replace(/\s+/g, "-");
  };

  const stateFullNames: Record<string, string> = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
    DC: "District of Columbia",
  };

  const handleStateClick = (state: string) => {
    if (!clickableStates.includes(state)) return;

    if (state === "LA") {
      onLouisianaClick();
    } else {
      const fullName = stateFullNames[state] ?? state;
      const urlFormattedState = formatStateForUrl(fullName);
      onStateClick(urlFormattedState);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, state: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleStateClick(state);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="grid grid-cols-11 gap-1">
        {grid.map((row, rowIndex) => {
          const rowKey =
            row.map((state) => state.state).join("-") ||
            `empty-row-${rowIndex}`;
          return (
            <React.Fragment key={rowKey}>
              {Array.from({ length: 11 }, (_, colIndex) => {
                const stateData = row.find((s) => s.col === colIndex);

                if (stateData) {
                  const isClickable = clickableStates.includes(stateData.state);
                  return (
                    <div
                      key={`${stateData.state}-${rowIndex}-${colIndex}`}
                      className={`aspect-square flex items-center justify-center text-sm font-medium rounded-md transition-all ${
                        isClickable
                          ? "cursor-pointer hover:opacity-80 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          : "cursor-default"
                      }`}
                      style={{
                        backgroundColor: getStateColor(stateData.state),
                        gridColumn: colIndex + 1,
                      }}
                      onClick={() => handleStateClick(stateData.state)}
                      onKeyDown={(e) => handleKeyDown(e, stateData.state)}
                      tabIndex={isClickable ? 0 : -1}
                      role={isClickable ? "button" : "presentation"}
                      aria-label={
                        isClickable
                          ? `View data for ${stateFullNames[stateData.state] || stateData.state}`
                          : undefined
                      }
                    >
                      {stateData.state}
                    </div>
                  );
                }
                return (
                  <div
                    key={`cell-${rowIndex * 11 + colIndex}`}
                    className="aspect-square"
                    style={{ gridColumn: colIndex + 1 }}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: "#93C5C5" }}
          />
          <span>Full Data Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: "#C8E6C9" }}
          />
          <span>Data Coming Soon</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: "#FFF9C4" }}
          />
          <span>Some Data Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: "#FFCCBC" }}
          />
          <span>No Data (Technical Barrier)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: "#F8BBD0" }}
          />
          <span>No Data (Legal Barrier)</span>
        </div>
      </div>
    </div>
  );
};

export default GridMap;
