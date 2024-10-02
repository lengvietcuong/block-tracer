"use client";

import createGlobe, { Marker } from "cobe";
import { useEffect, useRef } from "react";

const CRIMINAL_LOCATIONS: Marker[] = [
  { location: [37.7595, -122.4367], size: 0.03 },
  { location: [40.7128, -74.006], size: 0.04 },
  { location: [35.6762, 139.6503], size: 0.05 },
  { location: [51.5074, -0.1278], size: 0.06 },
  { location: [-33.8688, 151.2093], size: 0.06 },
  { location: [48.8566, 2.3522], size: 0.04 },
  { location: [55.7558, 37.6173], size: 0.05 },
  { location: [19.4326, -99.1332], size: 0.05 },
  { location: [34.0522, -118.2437], size: 0.03 },
  { location: [-23.5505, -46.6333], size: 0.05 },
  { location: [28.6139, 77.209], size: 0.06 },
];

const DARK_MUTED_GREEN: [number, number, number] = [
  82 / 255,
  122 / 255,
  97 / 255,
];
const LIGHT_MUTED_GREEN: [number, number, number] = [
  133 / 255,
  173 / 255,
  148 / 255,
];
const RED: [number, number, number] = [191 / 255, 64 / 255, 64 / 255];

export default function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    // Get computed width and height from the canvas element based on the className
    const canvasElement = canvasRef.current;
    const computedStyle = window.getComputedStyle(canvasElement);
    const width = parseFloat(computedStyle.width);
    const height = parseFloat(computedStyle.height);

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: height * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: DARK_MUTED_GREEN,
      markerColor: RED,
      glowColor: LIGHT_MUTED_GREEN,
      markers: CRIMINAL_LOCATIONS,
      onRender: (state) => {
        // Called on every animation frame.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [className]); // Add className as a dependency to recompute on class change

  return <canvas ref={canvasRef} className="w-full h-full aspect-square" />;
}
