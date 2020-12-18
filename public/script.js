"use strict";

const button = document.querySelector('div');

const func = async () => {

  const response = await fetch('/user');
  const data = await response.json();
  console.log(data);
}

button.addEventListener('click', func);