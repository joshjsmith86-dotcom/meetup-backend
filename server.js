// server.js - Complete backend with all API endpoints including Timezone API
const http = require('http');
const https = require('https');
const url = require('url');

// Use environment variable for API key (secure)
const API_KEY = process.env.GOOGLE_API_KEY;
const PORT = process.env.PORT || 3001;

// Simple CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Make HTTPS request helper
function makeGoogleRequest(apiUrl) {
  return new Promise((resolve, reject) => {
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  try {
    if (path === '/api/geocode') {
      const address = query.address;
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
      const data = await makeGoogleRequest(apiUrl);
      
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(data));
      
    } else if (path === '/api/timezone') {
      const { location, timestamp } = query;
      
      if (!location || !timestamp) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'Missing location or timestamp parameter' }));
        return;
      }
      
      const apiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=${timestamp}&key=${API_KEY}`;
      
      console.log(`🌍 Timezone request for: ${location}`);
      
      const data = await makeGoogleRequest(apiUrl);
      
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(data));
      
    } else if (path === '/api/places') {
      const { lat, lng, radius, type, keyword } = query;
      
      // Build the Google Places API URL
      let apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${API_KEY}`;
      
      // Add type parameter if provided (for category searches)
      if (type) {
        apiUrl += `&type=${type}`;
      }
      
      // Add keyword parameter if provided (for custom searches like "Italian restaurant")
      if (keyword) {
        apiUrl += `&keyword=${encodeURIComponent(keyword)}`;
      }
      
      console.log(`🔍 Places search: ${keyword || type || 'undefined'} near ${lat},${lng}`);
      
      const data = await makeGoogleRequest(apiUrl);
      
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(data));
      
    } else if (path === '/api/placedetails') {
      const { place_id } = query;
      
      if (!place_id) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'Missing place_id parameter' }));
        return;
      }
      
      const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=opening_hours,formatted_phone_number,website&key=${API_KEY}`;
      
      console.log(`🏢 Place details search for: ${place_id}`);
      
      const data = await makeGoogleRequest(apiUrl);
      
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(data));
      
    } else if (path === '/api/directions') {
      const { origin, destination, mode, departure_time } = query;
      
      if (!origin || !destination) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'Missing origin or destination parameter' }));
        return;
      }
      
      let apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode || 'driving'}&key=${API_KEY}`;
      
      if (departure_time) {
        apiUrl += `&departure_time=${departure_time}`;
      }
      
      console.log(`🗺️ Directions request: ${origin} to ${destination} via ${mode || 'driving'}`);
      
      const data = await makeGoogleRequest(apiUrl);
      
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(data));
      
    } else if (path === '/api/distancematrix') {
      const { origins, destinations, mode, departure_time } = query;
      let apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&mode=${mode}&units=metric&key=${API_KEY}`;
      
      if (departure_time) {
        apiUrl += `&departure_time=${departure_time}`;
      }
      
      const data = await makeGoogleRequest(apiUrl);
      
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(data));
      
    } else {
      res.writeHead(404, corsHeaders);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log('🔍 API key loaded from environment variables');
  console.log('📡 Ready for geocoding, timezone, places, place details, directions, and distance matrix requests');
  
  // Check if API key is loaded
  if (!API_KEY) {
    console.error('❌ WARNING: GOOGLE_API_KEY environment variable not set!');
  } else {
    console.log('✅ Google API key loaded successfully');
  }
});

// To run:
// 1. Make sure GOOGLE_API_KEY is set in your environment variables
// 2. Save this as server.js  
// 3. Open Command Prompt (cmd) in the same folder
// 4. Run: node server.js
