"use strict";

import { makeFootballersView } from '/views/footballersView.js';
import { makeGamesView } from '/views/gamesView.js';

const main = document.querySelector('main');

const func = async url => {

  const response = await fetch('/user');
  const data = await response.json();
  console.log(data);

}

const hashChange = () => {
	
	main.innerHTML = `<div class="loader"></div>`;

	if (document.location.hash === '#footballers') {
	  makeFootballersView();
	} else if (document.location.hash === '#achievements') {
	
	} else {	
	  document.location.hash = '#games';
	  makeGamesView();
	}
};

globalThis.addEventListener('hashchange', hashChange);
globalThis.onload = hashChange;