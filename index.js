"use strict";

const express = require('express');
const db = require('./db');
// const userRouter = require('./user_routes');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const app = express();
// app.use(express.json());
// app.use('/api', userRouter);

const getClubs = async () => {
  const users = await db.query('select * from Contracts');
  const rows = users.rows;
  return rows;
}

app.get('/user', async (req, res) => {
  const clubs = await getClubs();
  res.json(clubs);
})

app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => {
  res.send('');
})


app.listen(PORT, () => console.log(`server started on port ${PORT}`));