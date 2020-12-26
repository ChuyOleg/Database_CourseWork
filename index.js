"use strict";

const express = require('express');
const db = require('./db');
// const userRouter = require('./user_routes');
const fs = require('fs');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/footballers', async (req, res) => {
  const footballers = await db.query(`select * from Footballers 
  	where club = (select clubID from FootballClubs where replace(name, ' ', '') = '${req.query.clubName}')`);
  
  const rows = footballers.rows;
  res.json(rows);
});

app.get('/personStatistic', async (req, res) => {
  const goals = await db.query(`select count(*) from Goals
  	where FootballerID = ${req.query.personID}`);
  const assists = await db.query(`select count(*) from Goals
  	where assistant = ${req.query.personID}`);
  const statistic = { goals: goals.rows[0]['count'], assists: assists.rows[0]['count']};
  res.json(statistic);
});

app.get('/games', async (req, res) => {
  const games = await db.query(`select matchid, location, clubID, tournament, date, opponent, name, emblem from matches m
   join footballClubs f on (m.opponent = f.clubID);`);
  const rows = games.rows;
  res.json(rows);
})

app.get('/opponent', async (req, res) => {
  const opponent = await db.query(`select * from FootballClubs
  	where clubID = ${req.query.opponentid}`);
  const row = opponent.rows[0];
  res.json(row);
})

app.get('/RealMadrid', async (req, res) => {
  const club = await db.query(`select * from FootballCLubs where name = 'Real Madrid'`);
  const row = club.rows[0];
  res.json(row);
})

app.get('/allClubs', async(req, res) => {
  const clubs = await db.query(`select name, emblem from FootballClubs`);
  const rows = clubs.rows;
  res.json(rows);
});

app.get('/achi', async (req, res) => {
  const achi = await db.query('select * from achievements');
  const rows = achi.rows;
  res.json(rows);
}); 

app.get('/match', async (req, res) => {
  const match = await db.query(`select * from matches m join
   footballClubs f on (m.opponent = f.clubID)
   where matchID = ${req.query.id};`);
  const rows = match.rows[0];
  res.json(rows);
})

app.post('/update', async (req, res) => {
  try {
    const body = req.body;
    await db.query(`update footballers set ${req.body.columnName} = '${req.body.newValue}' where footballerID = ${req.body.id}`);
    res.json(200);
  } catch (e) {
    res.json(400);
  }
});

app.post('/add', async (req, res) => {
  try {
    const body = req.body;
    await db.query(`insert into Achievements(tournament, tournamentposition, season, bestMatch)
      values('${body.name}', ${body.position}, '${body.season}', ${body.bestMatchID})`);
    res.json(200);
  } catch (e) {
    res.json(400);
  }
});

app.post('/delete', async (req, res) => {
  try {
    const body = req.body;
    await db.query(`delete from Achievements where id = ${body.id}`);
    res.json(200);
  } catch (e) {
    console.log(e);
    res.json(400);
  }
});

app.get('/goals', async(req, res) => {
  const match = req.query.matchid;
  const club = req.query.clubid;
  const goals = await db.query(`select count(*) from goals
  	where footballerID = any(select FootballerID from footballers where club = '${club}')
  	and matchid = ${match}`);
  const rows = goals.rows[0];
  res.json(rows);
})

app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => {
  res.send('');
});


app.listen(PORT, () => console.log(`server started on port ${PORT}`));