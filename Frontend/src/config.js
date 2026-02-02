/**
 * Frontend configuration for API endpoints.
 * 
 * In development: Uses localhost (via proxy or direct connection)
 * In production:  Uses REACT_APP_API_URL environment variable
 * 
 * Build for production with:
 *   REACT_APP_API_URL=https://your-app.onrender.com npm run build
 * 
 * Or set REACT_APP_API_URL as a GitHub repository variable for CI/CD.
 */

// API base URL for HTTP requests
// Empty string means relative URLs (works with proxy in dev)
const API_BASE = process.env.REACT_APP_API_URL || '';

// WebSocket base URL
// - If REACT_APP_WS_URL is set, use it directly
// - Otherwise derive from REACT_APP_API_URL (https -> wss, http -> ws)
// - Fallback to localhost for development
const getWebSocketBase = () => {
  if (process.env.REACT_APP_WS_URL) {
    return process.env.REACT_APP_WS_URL;
  }
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/^http/, 'ws');
  }
  return 'ws://localhost:4001';
};

const WS_BASE = getWebSocketBase();

export { API_BASE, WS_BASE };
