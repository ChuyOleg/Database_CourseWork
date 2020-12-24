"use strict";

import { makeView } from '/footballersView.js';

const logo = document.querySelector('.logo a');

const func = async url => {

  const response = await fetch('/user');
  const data = await response.json();
  console.log(data);

}

const hashChange = () => {
	if (document.location.hash === '#footballers') {
	  makeView();
	} else if (document.location.hash === '#achievements') {
	
	} else {
	  document.location.hash = '#';
	}
};

globalThis.addEventListener('hashchange', hashChange);
globalThis.onload = hashChange;

logo.addEventListener('click', func);