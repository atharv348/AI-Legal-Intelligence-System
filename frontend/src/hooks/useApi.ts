import { useState, useCallback } from "react";

function getApiBaseUrl(): string {
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envBase && envBase.trim()) {
    return envBase;
  }

  // Use current host in browser to avoid localhost-only breakage when opened via LAN IP.
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8000/api/v1`;
  }

  return "http://localhost:8000/api/v1";
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    try {
      // If it's a FormData request, don't set Content-Type header manually
      const isFormData = options.body instanceof FormData;
      
      const headers: Record<string, string> = {
        ...((options.headers as Record<string, string>) || {}),
      };

      if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }

      const url = `${getApiBaseUrl()}${endpoint}`;
      console.log(`[useApi] Fetching: ${url}`, {
        method: options.method || 'GET',
        headers: headers,
        hasBody: !!options.body
      });
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        const errorMessage = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : (typeof errorData.message === 'string' 
            ? errorData.message 
            : JSON.stringify(errorData.detail || errorData.message || errorData));
        throw new Error(errorMessage || "An unknown error occurred");
      }

      return await response.json();
    } catch (err: any) {
      console.error("API Fetch Error:", err);
      setError(err.message || "Failed to fetch data from the server.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}
