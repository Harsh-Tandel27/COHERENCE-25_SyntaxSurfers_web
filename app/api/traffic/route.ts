export async function GET(req: Request) {
  const apiKey = process.env.TOMTOM_API_KEY;
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const type = searchParams.get("type"); // Determines the requested data type

  if (!lat || !lng || !type) {
    return new Response(JSON.stringify({ error: "Missing parameters" }), {
      status: 400,
    });
  }

  let url = "";

  switch (type) {
    case "travel-time":
      url = `https://api.tomtom.com/routing/1/calculateRoute/${lat},${lng}:${
        parseFloat(lat) + 0.1
      },${parseFloat(lng) + 0.1}/json?key=${apiKey}&traffic=true`;
      break;

    case "traffic-jams":
      url = `https://api.tomtom.com/traffic/services/5/incidents/box/${
        parseFloat(lat) - 0.05
      },${parseFloat(lng) - 0.05},${parseFloat(lat) + 0.05},${
        parseFloat(lng) + 0.05
      }/json?key=${apiKey}`;
      break;

    case "speed":
    case "average-travel-time":
    case "average-speed":
      url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&key=${apiKey}`;
      break;

    default:
      return new Response(JSON.stringify({ error: "Invalid type parameter" }), {
        status: 400,
      });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Extract relevant information
    if (type === "average-travel-time") {
      return new Response(
        JSON.stringify({
          averageTravelTime: data.flowSegmentData?.currentTravelTime ?? "N/A",
        }),
        { status: 200 }
      );
    }

    if (type === "average-speed") {
      return new Response(
        JSON.stringify({
          averageSpeed: data.flowSegmentData?.currentSpeed ?? "N/A",
        }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
