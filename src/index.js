import $ from 'jquery';
import domUpdates from './domUpdates.js';
import './css/base.scss';
import User from './User';
import Guest from './Guest';
import Manager from './Manager'
import Bookings from './Bookings';

let currentUser, bookings, userBookings, selectedDate, guestNames;
let todaysDate = new Date();
let dd = String(todaysDate.getDate()).padStart(2, '0');
let mm = String(todaysDate.getMonth() + 1).padStart(2, '0');
let yyyy = todaysDate.getFullYear();

todaysDate = mm + '/' + dd + '/' + yyyy;
let todaysDateBookingFormat = yyyy + '/' + mm + '/' + dd;

export let userData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users')
  .then(response => response.json())
  .then(data => data.users);

export let roomData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms')
  .then(response => response.json())
  .then(data => data.rooms);

export let bookingData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings')
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
  .then(response => doThing())

const doThing = () => {
  bookings = new Bookings(roomData, bookingData);
}

const logIn = () => {
  checkForManager();
  checkCredentials(getUserId())
  loadTodaysDate();
}

const getUserId = () => $(".user-input").val().split('').splice(8).join('');

export const returnUser = () => {
  return currentUser;
}

export const returnDate = () => {
  return selectedDate;
}

const checkCredentials = (id) => {
  if((!id || id > 50) && $(".user-input").val() !== "manager" || $(".pw-input").val() !== 'overlook2020') {
    showError();
  }
  if(id <= 50 && $(".pw-input").val() === 'overlook2020' && $(".user-input").val().includes("customer")) {
    let userID = getUserId();
    loadUser(parseInt(userID));
    loadGuestDashboard();
  }
}

const showError = () => {
  $(".invalid-creds").toggleClass("hide-class")
  setTimeout(function(){$(".invalid-creds").toggleClass("hide-class")}, 5000)
}

const checkForManager = (id) => {
  if($(".user-input").val() === 'manager' && $(".pw-input").val() === 'overlook2020') {
    loadManagerDashboard();
  }
}

export const loadUser = (id) => {
  let user = userData.find(user => user.id === id)
  let userBookings = bookings.bookings.filter(booking => id === booking.userID)
  let rooms = bookings.rooms
  currentUser = new Guest(user.id, user.name, userBookings, bookings.rooms)
  console.log(userBookings)
}

const loadManagerDashboard = () => {
  $(".login-pg").toggleClass("hide-class")
  $(".manager-dashboard").toggleClass("hide-class")
  loadRoomsAvailable();
  loadRevenue();
  loadRoomsOccupied();
  loadGuestNames();
}

const loadGuestNames = () =>{
  guestNames = userData.map(user => user.name);
}

const loadRoomsAvailable = () => {
  $(".rooms-avail").text(`Rooms Available: ${bookings.getRoomsAvailable(todaysDateBookingFormat)}/25`)
}

const loadRevenue = () => {
  let bookedRooms = bookings.getRoomsBooked(todaysDateBookingFormat);
  let revenue = bookedRooms.reduce((acc, bookedRoom) => {
    roomData.forEach(room => {
      if(bookedRoom === room.number) {
        acc += room.costPerNight
      }
    })
    return acc
  }, 0)
  $(".revenue").text(`Today's Revenue: $${revenue.toFixed(2)}`)
}

const loadRoomsOccupied = () => {
  let percentOccupied = (bookings.getRoomsBooked(todaysDateBookingFormat).length/25) * 100 + "%";
  $(".rooms-occupied").text(`Rooms Occupied: ${percentOccupied}`)
}

const loadGuestDashboard = () => {
  $(".login-pg").toggleClass("hide-class")
  $(".guest-dashboard").toggleClass("hide-class")
  loadGuestInfo();
  $(".total-spent-val").text(`$${loadTotalSpent().toFixed(2)}`)
  $(".date-input").attr("min", todaysDateBookingFormat.split("/").join("-"))
}

const loadGuestInfo = () => {
  $(".nav-guest-name").text(currentUser.name)
  appendUserBookings();
}

const appendUserBookings = () => {
  currentUser.bookings.forEach(booking => {
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
    currentUser.bookings.forEach(booking => {
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

const getRates = () => {
  loadAvailableRooms();
  appendAvailTitle();
  appendAvailableRooms(loadAvailableRooms());
}

const loadAvailableRooms = () => {
  selectedDate = $(".date-input").val().split("-").join("/");
  let selectedDateBookings = bookings.getRoomsBooked(selectedDate)
  let availableRooms = bookings.rooms.filter(room => !selectedDateBookings.includes(room.number))
  return availableRooms;
}

const appendAvailTitle = () => {
  if (!$(".filter-wrapper").length) {
    $(".total-spent-val").after(`
      <div class="filter-wrapper">
        <label class="search-labels">Filter Rooms:</label>
        <select class="room-type-dropdown">
          <option selected value="all">By Room Type</option>
          <option value="single room">Single Room</option>
          <option value="suite">Suite</option>
          <option value="junior suite">Junior Suite</option>
          <option value="residential suite">Residential Suite</option>
        </select>
      </div>
      <h3 class="avail-rooms-title">Available Rooms<h3>
  `)
    $(".room-type-dropdown").change(filterRooms)
  }
}

const appendAvailableRooms = (bookings) => {
  clearCardsAndError()
  bookings.forEach(booking => {
        $(".avail-rooms-title").after(`
          <div class="available-booking-card" data-room="${booking.number}">
            <div>
              <h4>${booking.roomType.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</h4>
              <p>This ${booking.roomType.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')} features ${booking.bedSize} size beds(${booking.numBeds}) at our luxurious Overlook Resort. The structure of our resort ensures that each and every room guarantees a beach view with East-facing windows and mountain views with West-facing windows.</p>
            </div>
            <div class="priceAndBook">
              <h3>$${booking.costPerNight}</h3>
              <p>(per night)</p>
              <button type="button" id="${booking.number}" class="book-btn">Book</button>
            </div>
          </div>`)
  })
  displayError(bookings);
  $(".book-btn").click(currentUser.bookRoom)
}



const filterRooms = () => {
  clearCardsAndError()
  if ($(".room-type-dropdown").val() !== "all") {
    let filteredRooms = loadAvailableRooms().filter(room => room.roomType === $(".room-type-dropdown").val())
    appendAvailableRooms(filteredRooms)
  }
  if ($(".room-type-dropdown").val() === "all") {
    appendAvailableRooms(loadAvailableRooms());
  }
}

const clearCardsAndError = () => {
  $(".available-booking-card").remove();
  $(".error-msg").remove();
}

const displayError = (array) => {
  if (!array.length && !$(".error-msg").length) {
    $(".avail-rooms-title").after(`
      <p class="error-msg">There are no rooms available for this date and room type.</p>  <p class="error-msg">Please adjust your search criteria and try again!</p>`)
  }
}

// autocomplete func below
const autocomplete = (inp) => {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < guestNames.length; i++) {
        if (guestNames[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + guestNames[i].substr(0, val.length) + "</strong>";
          b.innerHTML += guestNames[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + guestNames[i] + "'>";
              b.addEventListener("click", function(e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  $(".search-input").change(function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  })
  const addActive = (x) => {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  const removeActive = (x) => {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  const closeAllLists = (elmnt) => {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
$(document).click(function (e) {
    closeAllLists(e.target);
})
}

autocomplete(document.querySelector(".search-input"))
$(".login-btn").click(logIn)
$(".total-spent-btn").click(toggleTotalSpent)
$(".check-rates-btn").click(getRates)


export default 'index.js'
