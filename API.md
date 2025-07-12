# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
Currently, no authentication is required.

## Response Format
All responses follow this structure:
```json
{
  "success": boolean,
  "data": object | array,
  "error": string (only when success is false),
  "message": string (optional),
  "count": number (for list endpoints)
}
```

## Recent Updates

### Version 1.1.0
- Added over tracking functionality
- New fields in team data: `currentOver` and `ballInOver`
- Backward compatibility maintained with default values (0.0) for existing matches

## Endpoints

### Health Check
Check if the server is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "message": "Dice Cricket Backend is running",
  "timestamp": "2025-06-23T19:58:12.815Z",
  "environment": "development"
}
```

### Get Teams
Retrieve player lists for two teams.

**Endpoint:** `GET /api/teams`

**Query Parameters:**
- `q` (required): First team name
- `p` (required): Second team name

**Valid Teams:**
- Australia
- New_Zealand
- England
- India
- South_Africa

**Example Request:**
```
GET /api/teams?q=India&p=Australia
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "team1": {
      "name": "India",
      "players": ["Rohit Sharma", "Shikhar Dhawan", "..."]
    },
    "team2": {
      "name": "Australia", 
      "players": ["Travis Head", "David Warner", "..."]
    }
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "Both team1 and team2 parameters are required"
}
```

### Get Game History
Retrieve all game records.

**Endpoint:** `GET /api/history`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "60f1b2b3c9d1b2c3d4e5f6g7",
      "team1": "India",
      "team2": "Australia",
      "result": "India won by 5 runs",
      "team1_data": { ... },
      "team2_data": { ... },
      "createdAt": "2025-06-23T19:58:12.815Z",
      "updatedAt": "2025-06-23T19:58:12.815Z"
    }
  ]
}
```

### Create Game Record
Save a new game to history.

**Endpoint:** `POST /api/history`

**Request Body:**
```json
{
  "team1": "India",
  "team2": "Australia", 
  "result": "India won by 5 runs",
  "team1_data": {
    "score": 150,
    "wickets": 8,
    "players": ["Rohit Sharma", "..."],
    "scorelist": [4, 6, 0, 1, 2],
    "current": [0, 1],
    "status": [1, 1, 0, 1, 1],
    "striker": [0, 1, 0, 1, 0],
    "fallOn": ["45/2", "78/3"],
    "playerFell": ["Shikhar Dhawan", "Virat Kohli"],
    "currentOver": 25,
    "ballInOver": 2
  },
  "team2_data": {
    "score": 145,
    "wickets": 10,
    "players": ["Travis Head", "..."],
    "scorelist": [2, 4, 1, 0, 6],
    "current": [1, 0],
    "status": [1, 1, 1, 0, 1],
    "striker": [1, 0, 1, 0, 1],
    "fallOn": ["23/1", "67/2"],
    "playerFell": ["David Warner", "Steven Smith"],
    "currentOver": 24,
    "ballInOver": 1
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f1b2b3c9d1b2c3d4e5f6g7",
    "team1": "India",
    "team2": "Australia",
    "result": "India won by 5 runs",
    "createdAt": "2025-06-23T19:58:12.815Z",
    "updatedAt": "2025-06-23T19:58:12.815Z",
    "team1_data": { ... },
    "team2_data": { ... }
  }
}
```

### Get Game by ID
Retrieve a specific game record.

**Endpoint:** `GET /api/history/:id`

**Path Parameters:**
- `id`: MongoDB ObjectId of the game

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f1b2b3c9d1b2c3d4e5f6g7",
    "team1": "India",
    "team2": "Australia",
    "result": "India won by 5 runs",
    "team1_data": { ... },
    "team2_data": { ... },
    "createdAt": "2025-06-23T19:58:12.815Z",
    "updatedAt": "2025-06-23T19:58:12.815Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Game not found"
}
```

### Delete All Games
Remove all game records from the database.

**Endpoint:** `DELETE /api/history`

**Response:**
```json
{
  "success": true,
  "message": "Deleted 5 games",
  "deletedCount": 5
}
```

## Error Codes

- `400` - Bad Request (invalid parameters, validation errors)
- `404` - Not Found (game not found, invalid route)
- `500` - Internal Server Error (database errors, server issues)

## Rate Limiting
Currently, no rate limiting is implemented.

## CORS
The API supports CORS for the following origins:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Additional origins can be configured via the `CORS_ORIGINS` environment variable.
