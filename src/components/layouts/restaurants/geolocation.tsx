import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";

// Component to recenter map when position changes
function MapUpdater({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 17);
    }
  }, [position, map]);
  return null;
}

function GeoLocationComponent() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Geocode address
  const handleAddressSubmit = async () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/location/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (response.ok) {
        setPosition([data.latitude, data.longitude]);
        setAddress(data.formatted_address || address);
        setStep(2);
      } else {
        setError(data.error || "Could not find address");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm and save
  const handleSave = async () => {
    if (!position) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          latitude: position[0],
          longitude: position[1],
          geofence_radius: radius,
          confirmed: true,
        }),
      });

      if (response.ok) {
        setStep(3);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Restaurant Location Setup</h1>

      {/* Progress indicator */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= s ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${step > s ? "bg-blue-500" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1: Enter Address */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-gray-600">Enter your restaurant's address</p>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main Street, City, State ZIP"
            className="w-full border rounded-lg px-4 py-3"
            onKeyDown={(e) => e.key === "Enter" && handleAddressSubmit()}
          />
          <button
            onClick={handleAddressSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium disabled:bg-gray-300"
          >
            {loading ? "Searching..." : "Find Location"}
          </button>
        </div>
      )}

      {/* Step 2: Confirm on Map */}
      {step === 2 && position && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Confirm the location is correct. Drag the marker to adjust if
            needed.
          </p>

          <div className="h-80 rounded-lg overflow-hidden border">
            <MapContainer
              center={position}
              zoom={17}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapUpdater position={position} />
              <Marker
                position={position}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    setPosition([lat, lng]);
                  },
                }}
              />
              <Circle
                center={position}
                radius={radius}
                pathOptions={{ color: "#3b82f6", fillOpacity: 0.15 }}
              />
            </MapContainer>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Geofence Radius: {radius}m
            </label>
            <input
              type="range"
              min="30"
              max="300"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Staff must be within this distance to clock in/out
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border py-3 rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium disabled:bg-gray-300"
            >
              {loading ? "Saving..." : "Confirm & Save"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-xl font-bold mb-2">Location Saved!</h2>
          <p className="text-gray-600">
            Your staff can now clock in when they're within {radius}m of the
            restaurant.
          </p>
        </div>
      )}
    </div>
  );
}

export default GeoLocationComponent;
