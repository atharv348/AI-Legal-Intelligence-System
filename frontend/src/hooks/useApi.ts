import { useState, useCallback } from "react";

function getApiBaseUrl(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  if (envBase && envBase.trim()) {
    return envBase;
  }

  // Use current host in browser to avoid localhost-only breakage when opened via LAN IP.
  if (typeof window !== "undefined") {
    // If we're on localhost or 127.0.0.1, use that explicitly
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `http://127.0.0.1:8000/api/v1`;
    }
    // If we're in production but VITE_API_BASE_URL isn't set, this might fail,
    // so we warn the developer in the console.
    console.warn("[useApi] VITE_API_BASE_URL is not set. API calls might fail in production.");
  }

  return "http://127.0.0.1:8000/api/v1";
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    try {
      // If it's a FormData or URLSearchParams request, don't set Content-Type header manually
      const isFormData = options.body instanceof FormData;
      const isUrlSearchParams = options.body instanceof URLSearchParams;
      
      const headers: Record<string, string> = {
        ...((options.headers as Record<string, string>) || {}),
      };

      // Add Authorization header if token exists
      const token = localStorage.getItem("alis_token");
      if (token && !headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (!isFormData && !isUrlSearchParams && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }

      const baseUrl = getApiBaseUrl().replace(/\/$/, "");
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const url = `${baseUrl}${cleanEndpoint}`;
      console.log(`[useApi] Fetching: ${url}`, {
        method: options.method || 'GET',
        headers: headers,
        hasBody: !!options.body
      });
      
      const fetchOptions: RequestInit = {
        ...options,
      };
      
      // Only set headers if we have something or we need JSON
      if (Object.keys(headers).length > 0) {
        fetchOptions.headers = headers;
      }

      const response = await fetch(url, fetchOptions);

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
