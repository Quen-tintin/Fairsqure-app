/**
 * API Service for FairSquare
 * Replace BASE_URL with your FastAPI backend URL.
 */

const BASE_URL = 'https://fairsquare-api.onrender.com';

export async function predictListing(data: any) {
  try {
    const response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Prediction failed');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function checkHealth() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    return { status: 'offline' };
  }
}
