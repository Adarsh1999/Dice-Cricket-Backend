import mongoose from "mongoose";

const teamDataSchema = new mongoose.Schema({
  scorelist: {
    type: [Number],
    default: []
  },
  current: {
    type: [Number],
    default: []
  },
  status: {
    type: [Number],
    default: []
  },
  striker: {
    type: [Number],
    default: []
  },
  players: {
    type: [String],
    default: []
  },
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  wickets: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  fallOn: {
    type: [String],
    default: []
  },
  playerFell: {
    type: [String],
    default: []
  }
}, { _id: false });

const diceGameSchema = new mongoose.Schema({
  team1: {
    type: String,
    required: [true, 'Team1 name is required'],
    trim: true
  },
  team2: {
    type: String,
    required: [true, 'Team2 name is required'],
    trim: true
  },
  result: {
    type: String,
    trim: true
  },
  team1_data: {
    type: teamDataSchema,
    default: () => ({})
  },
  team2_data: {
    type: teamDataSchema,
    default: () => ({})
  },
  gameStatus: {
    type: String,
    enum: ['ongoing', 'completed', 'abandoned'],
    default: 'ongoing'
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false
});

// Add indexes for better query performance
diceGameSchema.index({ createdAt: -1 });
diceGameSchema.index({ team1: 1, team2: 1 });

export default mongoose.model("DiceGame", diceGameSchema);
