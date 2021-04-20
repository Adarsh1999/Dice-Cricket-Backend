import express from "express";
const app = express();
import mongoose from "mongoose";
//always use .js in the end of the file extension as in bcoz of es6
import diceGame from "./dbGame.js";
// app.use(cors({
//   origin: true,
//   credentials: true
// }));
import playerNames from "./team.js";

app.use(express.json());

// https://stackoverflow.com/questions/16810449/when-to-use-next-and-return-next-in-node-js
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

//database connection

const connection_url =
  "mongodb+srv://admin:pass@word@cluster0.caap5.mongodb.net/dice-criket?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const con = mongoose.connection;

con.on("open", () => {
  console.log("connected....");
});

let response = {};
app.get("/teams", (req, res) => {
  let q = req.query.q;
  let p = req.query.p;
  // if (q === "Australia") {
  //   response={
  //     "team1":playerNames.Australia,
  //   }
  console.log(p, q);
  q === "Australia"
    ? (response = {
        team1: playerNames.Australia,
      })
    : q === "New Zealand"
    ? (response = {
        team1: playerNames.New_Zealand,
      })
    : q === "England"
    ? (response = {
        team1: playerNames.England,
      })
    : q === "India"
    ? (response = {
        team1: playerNames.India,
      })
    : console.log("no team");

  if (p === "England") {
    response = {
      ...response,
      team2: playerNames.England,
    };
    res.json(response);
  } else if (p === "Australia") {
    response = {
      ...response,
      team2: playerNames.Australia,
    };
    res.json(response);
  } else if (p === "New Zealand") {
    response = {
      ...response,
      team2: playerNames.New_Zealand,
    };
    res.json(response);
  } else if (p === "India") {
    response = {
      ...response,
      team2: playerNames.India,
    };
    res.json(response);
  } else {
    res.send("2nd team not selected correctly");
  }
});
app.get("/history/all", (req, res) => {
  const dbMessage = req.body;
  diceGame.find(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/history/new", (req, res) => {
  const dbMessage = req.body;
  diceGame.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/history/delete", (req, res) => {
  diceGame.remove({}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  });
});

app.post(`/history/find`, (req, res) => {
  const { id } = req.body;

  diceGame.find({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
const port = process.env.PORT || 3001;

app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
