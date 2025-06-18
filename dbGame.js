import mongoose from "mongoose";
const diceGameSchema = mongoose.Schema({
  // timestamp: String,
  team1:String,
  team2:String,
  result:String,
  team1_data: {
    scorelist: [Number],
    current: [Number],
    status: [Number],
    striker: [Number],
    firstTeam: [String],
    score: Number,
    wickets: Number,
    fallOn:[String],
    playerFell:[String],
  },
  team2_data: {
    scorelist: [Number],
    current: [Number],
    status: [Number],
    striker: [Number],
    secondTeam: [String],
    score: Number,
    wickets: Number,
    fallOn:[String],
    playerFell:[String],
  },
// message:String,
// name:String
});

export default mongoose.model("diceCricket", diceGameSchema);
