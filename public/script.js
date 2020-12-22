"use strict";

const logo = document.querySelector('.logo a');

const func = async () => {

  const response = await fetch('/user');
  const data = await response.json();
  console.log(data);

}

logo.addEventListener('click', func);