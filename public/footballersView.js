"use strict";

import { getData } from '/getData.js';

const main = document.querySelector('main');

const makeFootballersView = async () => {
  
  let block = `
    <div class="container">
      <div class="row">
        <div class="col-12 pickClub">Pick a club</div>
        <div class="col-12 footballerRow playerRowExample">
          <div class="cell number">№</div>
          <div class="cell secondName">SecondName</div>
          <div class="cell firstName">FirstName</div>
          <div class="cell birthDate">BirthDate (age)</div>
          <div class="cell country">q</div>
          <div class="cell agent">Agent</div>
          <div class="cell fieldPosition">FieldPosition</div>
          <div class="cell goals">Goals</div>
          <div class="cell assists">Assists</div>
        </div>
  `;

  const footballers = await getData('/footballers?clubName=RealMadrid');
  for (const footballer of footballers) {
  	const newBirthDate = footballer['birthdate'].slice(0, 10);
    const statistic = await getData(`/personStatistic?personID=${footballer['footballerid']}`);
    block += `<div class="col-12 footballerRow">
	    <div class="cell number">${footballer['gamenumber']}</div>
	    <div class="cell secondName">${footballer['secondname']}</div>
	    <div class="cell firstName">${footballer['firstname']}</div>
	    <div class="cell birthDate">${newBirthDate} (${footballer['age']})</div>
	    <div class="cell country">${footballer['country']}</div>
	    <div class="cell agent">${footballer['agent']}</div>
	    <div class="cell fieldPosition">${footballer['fieldposition']}</div>
	    <div class="cell goals">${statistic['goals']}</div>
      <div class="cell assists">${statistic['assists']}</div>
	    </div>`;
  };

  block += `</div></div>`;

  main.innerHTML = block;

};

export { makeFootballersView };
