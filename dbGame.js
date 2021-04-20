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

// {
//     match_no: 1,
//     team1_name:"Australia",
//     team2_name:"England",
//     Team1: {
//       scorelist: [11,12,0,0,0,0,0,0,0,0,0],
//       current: [0,1],
//       status: [0,0,0,0,0,0,0,0,0,0],
//       striker: [0],
//       firstTeam: ['a','b','c','d','e','f','g','h','i','j','k'],
//       score: 23,
//       wickets: 0,
//     },
//     Team2: {
//       scorelist: [22,12,0,0,0,0,0,0,0,0,0],
//       current: [0,1],
//       status: [0,0,0,0,0,0,0,0,0,0],
//       striker: [0],
//       secondTeam: ['l','m','n','o','p','q','r','s','t','u','v'],
//       score: 34,
//       wickets: 0,
//     },
//   }