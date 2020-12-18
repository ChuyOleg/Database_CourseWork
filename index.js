"use strict";

const express = require('express');
const db = require('./db');
// const userRouter = require('./user_routes');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const app = express();
// app.use(express.json());
// app.use('/api', userRouter);

const func = async () => {
  const users = await db.query('select * from person');
  const rows = users.rows;
  // console.log(rows[0]);
}

app.get('/user', (req, res) => {
  res.json({ name: 'Oleg' });
})

app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => {
  func();
  res.send('');
})


app.listen(PORT, () => console.log(`server started on port ${PORT}`));