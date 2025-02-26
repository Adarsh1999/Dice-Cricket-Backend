import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Import the cors middleware
import diceGame from "./dbGame.js";
import playerNames from "./team.js";
import dotenv from 'dotenv';

dotenv.config();



const app = express();

// Use the cors middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Allow both localhost and 127.0.0.1
  credentials: true,
 }));
 

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// Database connection
const connection_url = process.env.MONGODB_URL;

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const con = mongoose.connection;

con.on("open", () => {
  console.log("Connected to MongoDB...");
});

let response = {};

app.get("/teams", (req, res) => {
  const { q, p } = req.query;
  const teams = ["Australia", "New_Zealand", "England", "India"];
  
  if (!teams.includes(q) || !teams.includes(p)) {
    return res.status(400).send("One or both teams not selected correctly");
  }

  const response = {
    team1: playerNames[q],
    team2: playerNames[p]
  };

  res.json(response);
});


app.get("/history/all", async (req, res) => {
  try {
    const data = await diceGame.find({});
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/history/new", async (req, res) => {
  const dbMessage = req.body;
  try {
    const data = await diceGame.create(dbMessage);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/history/delete", async (req, res) => {
  try {
    const data = await diceGame.deleteMany({});
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post(`/history/find`, async (req, res) => {
  const { id } = req.body;

  try {
    const data = await diceGame.find({ _id: id });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});


const port = process.env.PORT || 3001;

app.listen(port, () =>
  console.log(`Server running on ${port}, http://127.0.0.1:${port}`)
);
