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

export async function analyzeUrl(url: string) {
  try {
    const response = await fetch(`${BASE_URL}/analyze_url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail?.message || err.detail || 'Analysis failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Analyze URL Error:', error);
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

export async function getModelMetrics() {
  const response = await fetch(`${BASE_URL}/model/metrics`);
  if (!response.ok) throw new Error('Failed to fetch model metrics');
  return await response.json();
}

export async function getModelErrors() {
  const response = await fetch(`${BASE_URL}/model/errors`);
  if (!response.ok) throw new Error('Failed to fetch model errors');
  return await response.json();
}

export async function getDvfTransactions(params: {
  arrondissement?: number;
  min_price?: number;
  max_price?: number;
  min_surface?: number;
  max_surface?: number;
  limit?: number;
  offset?: number;
} = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.set(k, String(v));
  });
  const response = await fetch(`${BASE_URL}/dvf/transactions?${query}`);
  if (!response.ok) throw new Error('Failed to fetch DVF transactions');
  return await response.json();
}

export async function getHiddenGems(params: {
  min_gem_score?: number;
  arrondissement?: number;
  min_surface?: number;
  max_price?: number;
} = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.set(k, String(v));
  });
  const response = await fetch(`${BASE_URL}/hidden_gems?${query}`);
  if (!response.ok) throw new Error('Failed to fetch hidden gems');
  return await response.json();
}
