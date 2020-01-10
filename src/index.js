import $ from 'jquery';
import domUpdates from './domUpdates.js'
import './css/base.scss';
import User from './User'
import Bookings from './Bookings'

let currentUser;

let userData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users')
  .then(response => response.json())
  .then(data => data.users);

let roomData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms')
  .then(response => response.json())
  .then(data => data.rooms);

let bookingData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings')
  .then(response => response.json())
  .then(data => data.bookings);

Promise.all([userData, roomData, bookingData])
  .then(data => {
    userData = data[0];
    roomData = data[1];
    bookingData = data[2];
  })
  .then(response => doThing());

const doThing = () => {
  console.log(userData)
}

const logIn = () => {
  checkCredentials(getUserId())
}

const getUserId = () => $(".user-input").val().split('').splice(8, 2).join('');

const checkCredentials = (id) => {
  if(id <= 50 && $(".pw-input").val() === 'overlook2020') {
    let userID = getUserId();
    loadUser(parseInt(userID));
  }
}

const loadUser = (id) => {
  let user = userData.find(user => user.id === id)
  currentUser = new User(user.id, user.name)
  console.log(currentUser)
}

$(".login-btn").click(logIn)
