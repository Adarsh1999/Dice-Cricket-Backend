# Dice Cricket Backend

A Node.js Express backend API for a dice-based cricket simulation game. This server manages game data, team information, and provides endpoints for cricket game mechanics.

## Features

- 🏏 Cricket team management with player data
- 🎯 Game history tracking and management
- 🛡️ Input validation and error handling
- 🚀 Modern Express.js setup with best practices
- 📊 MongoDB integration with Mongoose
- 🔒 CORS configuration for secure cross-origin requests
- ⚡ Environment-based configuration

## Prerequisites

- Node.js (>= 16.0.0)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Dice-Cricket-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
MONGODB_URL=mongodb://localhost:27017/dice-cricket
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on the configured port (default: 3001).

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Teams
- **GET** `/api/teams?q=<team1>&p=<team2>` - Get players for two teams

### Saved Matches
- **GET** `/api/saved-matches` - Get all saved in-progress matches
- **POST** `/api/saved-matches` - Create a saved in-progress match
- **PUT** `/api/saved-matches/:id` - Rename or replace a saved in-progress match
- **DELETE** `/api/saved-matches/:id` - Delete a saved in-progress match

### Game History
- **GET** `/api/history` - Get all game records
- **POST** `/api/history` - Create new game record
- **GET** `/api/history/:id` - Get specific game by ID
- **DELETE** `/api/history` - Delete all game records

### Available Teams
- Australia
- New_Zealand  
- England
- India
- South_Africa

## Project Structure

```
Dice-Cricket-Backend/
├── config/
│   └── database.js          # Database connection configuration
├── data/
│   └── teams.js             # Cricket teams and players data
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── models/
│   └── diceGame.js          # Mongoose schema for game data
│   └── savedMatch.js        # Mongoose schema for in-progress saved matches
├── routes/
│   └── gameRoutes.js        # API route definitions
├── utils/
│   └── validation.js        # Input validation utilities
├── .env.example             # Environment variables template
├── index.js                 # Main application entry point
├── package.json             # Project dependencies and scripts
└── README.md               # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
