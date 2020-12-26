"use strict";

import { getData } from '/getData.js';

const main = document.querySelector('main');
const logoWrapper = document.querySelector('.logo');
const logo = logoWrapper.querySelector('div');

const makeAchievementsView = async () => {
  
  logoWrapper.id = 'Real Madrid';
  logo.style['background-image'] = 'url("../images/Real_Madrid_logo.png")';
  
  let block = `<div class="addAchi">
    <input class="addTournament" placeholder="Tournament" type="text">
    <input class="addTournamentPosition" placeholder="Position" type="text">
    <input class="addSeason" placeholder="Season" type="text">
    <input class="addBestMatch" placeholder="bestMatchID" type="text">
    <div class="addButton">+</div>
  </div>`;

  const achievements = await getData('/achi');
  const realMadrid = await getData('/RealMadrid');

  for (const achi of achievements) {
    
    const game = await getData(`/match?id=${achi['bestmatch']}`);
    const owner = (game['opponent'] != game['location']) ? realMadrid : game;
    const guest = (owner === realMadrid) ? game : realMadrid;

    let ownerGoals = 0;
      let guestGoals = 0;
      if (owner == realMadrid) {
        ownerGoals = await getData(`goals?matchid=${game['matchid']}&clubid=8`);
        guestGoals = await getData(`goals?matchid=${game['matchid']}&clubid=${game['opponent']}`);
      } else {
        ownerGoals = await getData(`goals?matchid=${game['matchid']}&clubid=${game['opponent']}`);
        guestGoals = await getData(`goals?matchid=${game['matchid']}&clubid=8`);
      }

    block += `
      <div class=achiWrapper>
	      <div class="gameDate">${game['date'].slice(0, 10)}</div>
	      <div class="gameRow">
	        <img src="images/${owner['emblem']}" class="emblem owner"></img>
	        <div class="name owner">${owner['name']}</div>
	        <div class="score">${ownerGoals['count']} : ${guestGoals['count']}</div>
	        <div class="name guest">${guest['name']}</div>
	        <img src="images/${guest['emblem']}" class="emblem guest"></img>
	      </div>
	      <div id="${achi['id']}" class="achiRow">
	      	<div class="tournament">${achi['tournament']}</div>
	      	<div class="tournamentposition">${achi['tournamentposition']}</div>
	      	<div class="season">${achi['season']}</div>
	      	<div id="${achi['id']}" class="remove">x</div>
	      </div>
      </div>
    `
  }

  main.innerHTML = block;

  const deleteButtons = document.querySelectorAll('.remove');
  const addButton = document.querySelector('.addButton');

  for (const button of deleteButtons) {
    button.addEventListener('click', async () => {
      const id = button.id;
      const response = await fetch(`/delete`, {
      	method: 'POST',
      	body: JSON.stringify({ id }),
      	headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data == 400) {
        alert('Mistake');
      } else {
        alert('Ok');
        main.innerHTML = `<div class="loader"></div>`
        makeAchievementsView();
      }
    })
  }

  addButton.addEventListener('click', async () => {
    const name = document.querySelector('.addTournament').value;
    const position = document.querySelector('.addTournamentPosition').value;
    const season = document.querySelector('.addSeason').value;
    const bestMatchID = document.querySelector('.addBestMatch').value;
    const response = await fetch('/add', {
      method: 'POST',
      body: JSON.stringify({ name, position, season, bestMatchID }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (data == 400) {
      alert('Mistake');
    } else {
      alert('Ok');
      main.innerHTML = `<div class="loader"></div>`;
      makeAchievementsView();
    }
  });  

};

export { makeAchievementsView };