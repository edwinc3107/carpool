const fromCoords = [-73.985664, 40.748514];
const toCoords = [-73.977224, 40.752726];
const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJiNDVlM2Q5YWE3MjQ4ZjNiMTI5OTc5OGJkYjQyNDQ4IiwiaCI6Im11cm11cjY0In0=';

async function getRoute() {
  const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

  const body = {
    coordinates: [fromCoords, toCoords]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Route data:", data);

    // Extract distance (meters) and duration (seconds)
    const summary = data.features[0].properties.summary;
    console.log(`Distance: ${summary.distance} meters`);
    console.log(`Duration: ${summary.duration} seconds`);

  } catch (error) {
    console.error("Error fetching route:", error);
  }
}

getRoute();
