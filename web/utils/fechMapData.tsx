import { Topology } from "topojson-specification";
import { feature, mesh } from "topojson-client";
import { GeometryCollection, GeometryObject } from "topojson-specification";
import { FeatureCollection, MultiLineString, Geometry } from "geojson";
import { promises as fs } from "fs";
import path from "path";

export async function fetchMapData() {
  try {
    const filePath = path.join(process.cwd(), "data", "states.json");

    const fileContents = await fs.readFile(filePath, "utf-8");

    const topology = JSON.parse(fileContents) as Topology;

    const { states } = topology.objects as {
      states: GeometryCollection<GeometryObject>;
    };

    const land = feature(topology, states) as FeatureCollection<Geometry>;
    const interiors = mesh(
      topology,
      states,
      (a, b) => a !== b
    ) as MultiLineString;

    return { land, interiors };
  } catch (error) {
    console.error("Error fetching map data:", error);
    throw new Error("Failed to fetch map data");
  }
}
