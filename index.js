"use strict";

const express = require('express');
const db = require('./db');
// const userRouter = require('./user_routes');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const app = express();

app.get('/footballers', async (req, res) => {
  const footballers = await db.query(`select * from Footballers 
  	where club = (select clubID from FootballClubs where replace(initcap(name), ' ', '') = '${req.query.clubName}')`);
  const rows = footballers.rows;
  res.json(rows);
});

app.get('/personStatistic', async (req, res) => {
  const statistic = await db.query(`select count(*) from Goals
  	where FootballerID = ${req.query.personID}`);
  const rows = statistic.rows;
  res.json(rows);
});

app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => {
  res.send('');
});


app.listen(PORT, () => console.log(`server started on port ${PORT}`));