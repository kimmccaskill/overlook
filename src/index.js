import $ from 'jquery';
import domUpdates from './domUpdates.js'
import './css/base.scss';
import User from './User'
import Bookings from './Bookings'

let currentUser, bookings, userBookings;
let todaysDate = new Date();
let dd = String(todaysDate.getDate()).padStart(2, '0');
let mm = String(todaysDate.getMonth() + 1).padStart(2, '0');
let yyyy = todaysDate.getFullYear();

todaysDate = mm + '/' + dd + '/' + yyyy;
let todaysDateBookingFormat = yyyy + '/' + mm + '/' + dd;

let userData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users')
  .then(response => response.json())
  .then(data => data.users);

let roomData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms')
  .then(response => response.json())
  .then(data => data.rooms);

let bookingData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings')
  .then(response => response.json())
  .then(data => data.bookings)
  .then(data => {
    return data.sort(function(a, b){
    return new Date(b.date) - new Date(a.date);
  })});

Promise.all([userData, roomData, bookingData])
  .then(data => {
    userData = data[0];
    roomData = data[1];
    bookingData = data[2];
  })
  .then(response => doThing());

const doThing = () => {
  bookings = new Bookings(roomData, bookingData);
}

const logIn = () => {
  checkForManager();
  checkCredentials(getUserId())
  loadTodaysDate();
}

const getUserId = () => $(".user-input").val().split('').splice(8).join('');

const checkCredentials = (id) => {
  if((!id || id > 50) && $(".user-input").val() !== "manager") {
    // Error handling for long username needed
    console.log("error handling for improper credentials")
    return;
  }
  if(id <= 50 && $(".pw-input").val() === 'overlook2020' && $(".user-input").val() !== "manager" && $(".user-input").val().includes("customer")) {
    let userID = getUserId();
    loadUser(parseInt(userID));
    loadGuestDashboard();
  }
}

const checkForManager = (id) => {
  if($(".user-input").val() === 'manager' && $(".pw-input").val() === 'overlook2020') {
    loadManagerDashboard();
  }
}

const loadUser = (id) => {
  let user = userData.find(user => user.id === id)
  currentUser = new User(user.id, user.name)
  console.log(currentUser)
}

const loadManagerDashboard = () => {
  $(".login-pg").toggleClass("hide-class")
  $(".manager-dashboard").toggleClass("hide-class")
  loadRoomsAvailable();
  console.log(bookings.getRoomsBooked(todaysDateBookingFormat))
}

const loadRoomsAvailable = () => {
  $(".rooms-avail").text(`Rooms Available: ${bookings.getRoomsAvailable(todaysDateBookingFormat)}/25`)
}

const loadGuestDashboard = () => {
  $(".login-pg").toggleClass("hide-class")
  $(".guest-dashboard").toggleClass("hide-class")
  loadGuestInfo();
  $(".total-spent-val").text(`$${loadTotalSpent().toFixed(2)}`)
}

const loadGuestInfo = () => {
  $(".nav-guest-name").text(currentUser.name)
  getUserBookings();
  appendUserBookings();
}

const getUserBookings = () => {
  userBookings = bookings.bookings.filter(booking => {
    return currentUser.id === booking.userID
  })
}

const appendUserBookings = () => {
  userBookings.forEach(booking => {
    roomData.find(room => {
      if(room.number === booking.roomNumber){
        const changeDateFormat = () => {
          let newDate = booking.date.split("/");
          newDate.push(newDate.shift());
          newDate = newDate.join("/");
          return newDate;
        }
        $(".upcoming").after(`
          <div class="booking-card">
          <p class="card-date">${changeDateFormat()}</p>
          <p>${room.roomType.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</p>
          <p>$${room.costPerNight}</p>
          </div>`)
      }}
    )
  })
}

const loadTotalSpent = () => {
  return roomData.reduce((acc, room) => {
    userBookings.forEach(booking => {
      if(room.number === booking.roomNumber){
      acc += room.costPerNight
      }
    })
    return acc
  }, 0)
}

const toggleTotalSpent = () => {
  $(".total-spent-val").toggleClass("hide-class")
}

const loadTodaysDate = () => {
  $(".todays-date").text(todaysDate)
  $(".date-input").val(todaysDate)
}



$(".login-btn").click(logIn)
$(".total-spent-btn").click(toggleTotalSpent)
