# Chase Car Dashboard - Deployment Guide

This document outlines how to deploy the Chase Car Dashboard in different environments.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                              │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Serial Radio  │      UDP        │        Convex.dev           │
│   (Local only)  │  (Local/VPN)    │    (Cloud primary)          │
└────────┬────────┴────────┬────────┴──────────────┬──────────────┘
         │                 │                       │
         └─────────────────┼───────────────────────┘
                           ▼
              ┌────────────────────────┐
              │   DataSourceManager    │
              │  (Timestamp dedup)     │
              └───────────┬────────────┘
                          ▼
              ┌────────────────────────┐
              │     Redis Cache        │
              │  Local: TimeSeries     │
              │  Cloud: Sorted Sets    │
              └───────────┬────────────┘
                          ▼
              ┌────────────────────────┐
              │    FastAPI Backend     │
              │   WebSocket + REST     │
              └───────────┬────────────┘
                          ▼
              ┌────────────────────────┐
              │    React Frontend      │
              │      (Vercel)          │
              └────────────────────────┘
```

## Deployment Options

### Option 1: Local Docker (Full Features)

Best for: Development, chase car setup, areas with no internet.

```bash
# Start everything with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

Features:
- ✅ Redis TimeSeries (full time-series queries)
- ✅ Serial radio data source
- ✅ UDP data source
- ✅ Full offline capability

### Option 2: Cloud Deployment (Render + Vercel)

Best for: Remote monitoring, sharing with team.

#### Prerequisites
1. [Render account](https://render.com)
2. [Vercel account](https://vercel.com)
3. [Upstash Redis account](https://upstash.com) (free tier available)
4. [Convex.dev account](https://convex.dev) (for cloud data ingestion)

#### Backend (Render)

1. Connect your GitHub repo to Render
2. Create a new Blueprint deployment using `render.yaml`
3. Set environment variables in Render dashboard:
   - `REDIS_URL`: Your Upstash Redis URL (format: `redis://default:password@host:port`)
   - `CONVEX_URL`: Your Convex deployment URL
   - `CONVEX_DEPLOY_KEY`: Your Convex deploy key

#### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set the root directory to `Frontend`
3. Set environment variables:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://chase-car-backend.onrender.com`)
   - `REACT_APP_WS_URL`: WebSocket URL (e.g., `wss://chase-car-backend.onrender.com`)

#### Data Flow in Cloud Mode

Since serial/UDP aren't available in cloud, use Convex.dev:

1. On the solar car, run a small script that posts telemetry to Convex
2. The cloud backend subscribes to Convex and receives data
3. Data is cached in Upstash Redis for dashboard queries

### Option 3: Hybrid (Local Backend + Cloud Frontend)

Best for: Development with remote access.

```bash
# Run backend locally
cd Backend && poetry run python main.py

# Use ngrok to expose locally
ngrok http 4001

# Deploy frontend to Vercel with ngrok URL
```

## Environment Variables

| Variable | Local Default | Cloud Default | Description |
|----------|---------------|---------------|-------------|
| `DEPLOYMENT_MODE` | `local` | `cloud` | Operating mode |
| `USE_TIMESERIES` | `true` | `false` | Use Redis TimeSeries |
| `REDIS_HOST` | `localhost` | - | Redis host (local) |
| `REDIS_PORT` | `6379` | - | Redis port (local) |
| `REDIS_URL` | - | Required | Redis URL (cloud) |
| `ENABLE_SERIAL` | `true` | `false` | Serial data source |
| `ENABLE_UDP` | `true` | `false` | UDP data source |
| `ENABLE_CONVEX` | `false` | `true` | Convex data source |
| `CONVEX_URL` | - | Required | Convex deployment URL |
| `HOST_PORT` | `4001` | `4001` | Backend API port |

## Convex.dev Setup

1. Create a new Convex project
2. Define a schema for telemetry data:

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  telemetry: defineTable({
    timestamp: v.number(),
    data: v.any(),
  }).index("by_timestamp", ["timestamp"]),
});
```

3. Create a mutation to insert data:

```typescript
// convex/telemetry.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insert = mutation({
  args: { timestamp: v.number(), data: v.any() },
  handler: async (ctx, args) => {
    await ctx.db.insert("telemetry", args);
  },
});

export const getLatest = query({
  handler: async (ctx) => {
    return await ctx.db.query("telemetry")
      .order("desc")
      .first();
  },
});
```

4. On the solar car, post data to Convex using the HTTP API or a client library.

## Troubleshooting

### Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping

# For cloud, verify your Upstash URL format
# Should be: redis://default:password@host:port
```

### WebSocket Connection Issues
- Ensure backend is running on port 4001
- Check browser console for connection errors
- For cloud, ensure Render service is awake (free tier sleeps after inactivity)

### No Data Showing
1. Check data source is enabled in config
2. Verify DataSourceManager started (check backend logs)
3. Check Redis has data: `redis-cli KEYS "*"`
