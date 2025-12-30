/**
 * API utility functions for making requests to backend services
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint: string, options?: RequestInit) {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured. Please set EXPO_PUBLIC_API_URL or NEXT_PUBLIC_API_URL environment variable.");
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

export async function get(endpoint: string) {
  return apiRequest(endpoint, { method: "GET" });
}

export async function post(endpoint: string, data: any) {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function put(endpoint: string, data: any) {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function del(endpoint: string) {
  return apiRequest(endpoint, { method: "DELETE" });
}
