import React, { useEffect, useState, useRef } from "react";
import { geoPath, geoAlbersUsa } from "d3-geo";
import {
  FeatureCollection,
  MultiLineString,
  Geometry,
  Feature,
  GeoJsonProperties,
} from "geojson";
import * as d3 from "d3";
import { useRouter } from "next/navigation";
import mapColors from "@/styles/mapColors";
const stateDataStatus: { [stateName: string]: number } = {
  Alabama: 0,
  Alaska: 75,
  Arizona: 100,
  Arkansas: 0,
  California: 100,
  Colorado: 0,
  Connecticut: 0,
  Delaware: 0,
  "D.C.": 75,
  Florida: 100,
  Georgia: 100,
  Hawaii: 75,
  Idaho: 100,
  Illinois: 100,
  Indiana: 75,
  Iowa: 75,
  Kansas: 75,
  Kentucky: 100,
  Louisiana: 50,
  Maine: 25,
  Maryland: 100,
  Massachusetts: 25,
  Michigan: 0,
  Minnesota: 75,
  Mississippi: 75,
  Missouri: 0,
  Montana: 0,
  Nebraska: 25,
  Nevada: 0,
  "New Hampshire": 0,
  "New Jersey": 0,
  "New Mexico": 100,
  "New York": 0,
  "North Carolina": 75,
  "North Dakota": 75,
  Ohio: 100,
  Oklahoma: 0,
  Oregon: 100,
  Pennsylvania: 0,
  "Rhode Island": 25,
  "South Carolina": 100,
  "South Dakota": 0,
  Tennessee: 100,
  Texas: 100,
  Utah: 100,
  Vermont: 100,
  Virginia: 0,
  Washington: 100,
  "West Virginia": 100,
  Wisconsin: 0,
  Wyoming: 100,
};

interface MapProps {
  data: {
    land: FeatureCollection<Geometry> | null;
    interiors: MultiLineString | null;
  } | null;
  availableStates: string[];
}

const projection = geoAlbersUsa();
const path = geoPath(projection);

export const Map = ({ data, availableStates }: MapProps) => {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const themeColors = mapColors["light"];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data || !data.land || !data.interiors || !svgRef.current) return;

    // Create svg element
    const svg = d3.select(svgRef.current);

    // Draw map
    svg
      .selectAll(".land")
      .data(data.land.features)
      .join("path")
      .attr("class", "land")
      .attr("d", (feature) => path(feature)!)
      .attr("fill", (feature) => {
        const stateName = feature.properties?.name;
        const amount = stateDataStatus[stateName as string];

        return themeColors[amount];
      })
      .attr("stroke", themeColors.stateBorder)
      .attr("stroke-width", "1")
      .on("click", (event, feature) => {
        const stateName = feature.properties?.name;
        if (stateName && availableStates.includes(stateName)) {
          router.push("/state/" + stateName);
        }
      })
      .transition();

    svg
      .selectAll(".interiors")
      .data([data.interiors])
      .join("path")
      .attr("class", "interiors")
      .attr("d", path)
      .attr("fill", "none");

    // Create tooltip background
    const tooltipBg = svg
      .append("rect")
      .attr("class", "tooltip-bg")
      .attr("fill", "rgb(255, 255, 255, 0.8)")
      .style("visibility", "hidden");

    // Create tooltip
    const tooltip = svg
      .append("text")
      .attr("class", "tooltip")
      .attr("fill", "black")
      .style("pointer-events", "none")
      .style("visibility", "hidden");

    // Add tooltip to map, change state color on hover
    svg
      .selectAll(".land")
      .on("mouseover", (event, feature) => {
        const typedFeature = feature as Feature<Geometry, GeoJsonProperties>;
        const [mx, my] = d3.pointer(event);
        tooltip
          .attr("x", mx + 20)
          .attr("y", my + 20)
          .text(typedFeature.properties?.name)
          .style("visibility", "visible");

        const tooltipNode = tooltip.node();
        if (tooltipNode) {
          const bbox = tooltipNode.getBBox();
          tooltipBg
            .attr("x", bbox.x - 5)
            .attr("y", bbox.y - 5)
            .attr("width", bbox.width + 10)
            .attr("height", bbox.height + 5)
            .style("visibility", "visible");
        }

        const stateName = typedFeature.properties?.name;
        if (availableStates.includes(stateName)) {
          const status = stateDataStatus[stateName];
          d3.select(event.target)
            .attr("fill", themeColors.hover)
            .attr("cursor", "pointer");
        }
      })
      .on("mouseout", (event, feature) => {
        const typedFeature = feature as Feature<Geometry, GeoJsonProperties>;
        tooltip.style("visibility", "hidden");
        tooltipBg.style("visibility", "hidden");
        const stateName = typedFeature.properties?.name;
        if (availableStates.includes(stateName)) {
          const status = stateDataStatus[stateName];
          d3.select(event.target).attr("fill", themeColors[status]);
        }
      })
      .on("mousemove", (event) => {
        const [mx, my] = d3.pointer(event);
        tooltip.attr("x", mx + 20).attr("y", my + 20);

        const tooltipNode = tooltip.node();
        if (tooltipNode) {
          const bbox = tooltipNode.getBBox();
          tooltipBg
            .attr("x", bbox.x - 5)
            .attr("y", bbox.y - 5)
            .attr("width", bbox.width + 10)
            .attr("height", bbox.height + 10);
        }
      });

    setLoading(false);

    return () => {
      tooltip.remove();
      tooltipBg.remove();
    };
  }, [data, availableStates, themeColors, router]);

  return (
    <div>
      <svg ref={svgRef} viewBox="80 0 870 500" />
    </div>
  );
};

export default Map;
