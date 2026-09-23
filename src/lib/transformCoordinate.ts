import proj4 from "proj4";

// Define the coordinate reference systems
// EPSG:25000 - Ghana National Grid
// EPSG:4326 - WGS84 (standard lat/lon)
// proj4.defs([
//   ['EPSG:2136', '+proj=tmerc +lat_0=4.66666666666667 +lon_0=-1 +k=0.99975 +x_0=274319.739163358 +y_0=0 +a=6378300 +rf=296 +towgs84=-170,33,326,0,0,0,0 +to_meter=0.304799710181509 +no_defs +type=crs'],
//   ['EPSG:4326', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees']
// ]);
proj4.defs(
  "EPSG:2136",
  "+proj=tmerc +lat_0=4.66666666666667 +lon_0=-1 +k=0.99975 +x_0=274319.739163358 +y_0=0 +a=6378300 +rf=296 +towgs84=-170,33,326,0,0,0,0 +to_meter=0.304799710181509 +no_defs +type=crs",
);

// interface Point {
//   X: number;  // Easting (Ghana Grid)
//   Y: number;  // Northing (Ghana Grid)
//   Bearing?: string;
//   Distance?: string;
//   lng: number;  // Longitude (WGS84)
//   lat: number;  // Latitude (WGS84)

// }

interface Point {
  X: number;
  Y: number;
  lat: number;
  lng: number;
  Bearing: number;
  Distance: number;
}

export function transformGhanaGridToWGS84(points: Point[]): Point[] {
  return points.map((point) => {
    // Transform Ghana Grid (X=Easting, Y=Northing) to WGS84 (lng, lat)
    const [lng, lat] = proj4("EPSG:2136", "EPSG:4326", [point.Y, point.X]);

    return {
      ...point,
      lng: lng,
      lat: lat,
    };
  });
}

// Example usage with Ghana National Grid coordinates:
// const ghanaGridPoints = [
//  { X: 340930.05, Y: 1192598.06, Bearing: "251", Distance: "135.23" },
//  { X: 340911.01, Y: 1192464.18, Bearing: "251", Distance: "135.23" },
//  { X: 340915.22, Y: 1192361.72, Bearing: "251", Distance: "135.23" },
//  { X: 340918.05, Y: 1192344.97, Bearing: "251", Distance: "135.23" },
//  { X: 341105.83, Y: 1192142.54, Bearing: "251", Distance: "135.23" },
//  { X: 341120.00, Y: 1192190.00, Bearing: "251", Distance: "135.23" },
//  { X: 341080.00, Y: 1192205.00, Bearing: "251", Distance: "135.23" },
//  { X: 341120.00, Y: 1192410.00, Bearing: "251", Distance: "135.23" },
//  { X: 341151.45, Y: 1192408.18, Bearing: "251", Distance: "135.23" },
//  { X: 341164.74, Y: 1192510.55, Bearing: "251", Distance: "135.23" },
//  { X: 341145.76, Y: 1192569.74, Bearing: "251", Distance: "135.23" },
// ];
