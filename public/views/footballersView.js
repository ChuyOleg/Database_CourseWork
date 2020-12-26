"use strict";

import { getData } from '/getData.js';

const main = document.querySelector('main');
const updateValue = document.querySelector('updateValue');
const updateButton = document.querySelector('updateButton');

const addListener = elements => {
  elements.forEach(elem => {
    elem.addEventListener('click', () => {
      render(elem.id, elem.classList[0]);
    })
  });  
};

const makeFootballersView = async () => {
  const clubs = await getData('/allClubs');

  let startBlock = `
    <input type="text" class="updateValue" placeholder="new value">
    <div class="updateButton">Update</div>
    <div class="pickClub">
      <p>Pick a club</p>
      <div class="clubList container">
        <div class="row listRow">
  `;

  clubs.forEach(club => {
    startBlock += `<div id="${club['name'].replace(/\s+/g, '')}" class="${club['emblem']} col-4 clubInList">${club['name']}</div>`
  });

  startBlock += `</div></div></div>`;

  main.innerHTML = startBlock;

  const cellClubs = document.querySelectorAll('.clubInList');
  addListener(cellClubs);
};

const render = async (name, emblem) => {
  const logoWrapper = document.querySelector('.logo');
  const logo = logoWrapper.querySelector('div');
  logoWrapper.id = name;
  logo.style['background-image'] = `url(../images/${emblem})`;

  if (main.lastElementChild.id == 'bigTable') main.removeChild(main.lastElementChild);

  let block = '';

  block += `
    <div id="bigTable" class="container">
      <div class="row">
        <div class="col-12 footballerRow playerRowExample">
          <div class="cell gameNumber">№</div>
          <div class="cell secondName">SecondName</div>
          <div class="cell firstName">FirstName</div>
          <div class="cell birthDate">BirthDate (age)</div>
          <div class="cell country">Country</div>
          <div class="cell agent">Agent</div>
          <div class="cell fieldPosition">FieldPosition</div>
          <div class="cell goals">Goals</div>
          <div class="cell assists">Assists</div>
        </div>
  `;

  const footballers = await getData(`/footballers?clubName=${name}`);
  for (const footballer of footballers) {
  	const newBirthDate = footballer['birthdate'].slice(0, 10);
    const statistic = await getData(`/personStatistic?personID=${footballer['footballerid']}`);
    block += `<div class="col-12 footballerRow">
	    <div id="${footballer['footballerid']}" class="cell canChange gameNumber">${footballer['gamenumber']}</div>
	    <div id="${footballer['footballerid']}" class="cell canChange secondName">${footballer['secondname']}</div>
	    <div id="${footballer['footballerid']}" class="cell canChange firstName">${footballer['firstname']}</div>
	    <div id="${footballer['footballerid']}" class="cell canChange birthDate">${newBirthDate} (${footballer['age']})</div>
	    <div id="${footballer['footballerid']}" class="cell canChange country">${footballer['country']}</div>
	    <div id="${footballer['footballerid']}" class="cell canChange agent">${footballer['agent']}</div>
	    <div id="${footballer['footballerid']}" class="cell canChange fieldPosition">${footballer['fieldposition']}</div>
	    <div id="${footballer['footballerid']}" class="cell goals">${statistic['goals']}</div>
      <div id="${footballer['footballerid']}" class="cell assists">${statistic['assists']}</div>
	    </div>`;
  };

  block += `</div></div>`;

  main.innerHTML += block;
  
  const allChangedCells = document.querySelectorAll('.canChange');

  allChangedCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const oldCell = document.querySelector('.changedCell');
      const updateValue = document.querySelector('.updateValue');
      const updateButton = document.querySelector('.updateButton');
      if (oldCell != null) oldCell.classList.remove('changedCell');
      cell.classList.add('changedCell');
      updateValue.style.display = 'block';
      updateButton.style.display = 'block';
    })
  });

  const updateButton = document.querySelector('.updateButton');
  updateButton.addEventListener('click', async () => {
    const updateValue = document.querySelector('.updateValue');
    if (updateValue.value == '') {
      alert('please, enter a new value');
    } else {
      const activeCell = document.querySelector('.changedCell');
      const activeID = activeCell.id;
      const columnName = activeCell.classList[2];
      const newValue = updateValue.value;
      
      let check = false;
      footballers.forEach(player => {
        if (player['footballerid'] != activeID && player['gamenumber'] == newValue && columnName == 'gameNumber') {
          alert('Enter another gameNumber');
          check = true;
          return;
        }
      });
      if (check == true) return;
      const response = await fetch('/update', {
        method: 'POST',
        body: JSON.stringify({ id: activeID, columnName, newValue }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data == 400) {
        alert('Wrong data type');
      } else {
        alert('Ok');
        main.innerHTML = `<div class="loader"></div>`;
        makeFootballersView();
        render(name, emblem);
      }
    }
  });

  const cellClubs = document.querySelectorAll('.clubInList');
  addListener(cellClubs);

};

export { makeFootballersView };
