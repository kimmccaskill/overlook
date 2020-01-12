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

const checkCredentials = (id) => {
  if((!id || id > 50) && $(".user-input").val() !== "manager") {
    // Error handling for long username needed
    console.log("error handling for improper credentials")
    return;
  }
  if(id <= 50 && $(".pw-input").val() === 'overlook2020' && $(".user-input").val().includes("customer")) {
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
  let userBookings = bookings.bookings.filter(booking => id === booking.userID)
  currentUser = new User(user.id, user.name, userBookings)
}

const loadManagerDashboard = () => {
  $(".login-pg").toggleClass("hide-class")
  $(".manager-dashboard").toggleClass("hide-class")
  loadRoomsAvailable();
  loadRevenue();
  loadRoomsOccupied();
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
  let selectedDateBookings = bookings.getRoomsBooked($(".date-input").val().split("-").join("/"))
  let availableRooms = bookings.rooms.filter(room => !selectedDateBookings.includes(room.number))
  return availableRooms;
}

const appendAvailTitle = () => {
  $(".total-spent-val").after(`
    <div class="filter-wrapper">
      <label class="search-labels">Filter Rooms:</label>
      <select class="room-type-dropdown">
        <option class="test" selected value="all">By Room Type</option>
        <option class="test" value="single room">Single Room</option>
        <option class="test" value="suite">Suite</option>
        <option class="test" value="junior suite">Junior Suite</option>
        <option class="test" value="residential suite">Residential Suite</option>
      </select>
    </div>
    <h3 class="avail-rooms-title">Available Rooms<h3>
`)
  $(".room-type-dropdown").change(filterRooms)
}

const appendAvailableRooms = (bookings) => {
  bookings.forEach(booking => {
        $(".avail-rooms-title").after(`
          <div class="available-booking-card">
          <div>
            <h4>${booking.roomType.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</h4>
            <p>This ${booking.roomType.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')} features ${booking.bedSize} size beds(${booking.numBeds}) at our luxurious Overlook Resort. The structure of our resort ensures that each and every room guarantees a beach view with East-facing windows and mountain views with West-facing windows.</p>
          </div>
          <div class="priceAndBook">
            <h3>$${booking.costPerNight}</h3>
            <p>(per night)</p>
            <button type="button" class="book-btn">Book</button>
          </div>
          </div>`)
  })
}

const filterRooms = () => {
  $(".available-booking-card").remove();
  if ($(".room-type-dropdown").val() !== "all") {
    let filteredRooms = loadAvailableRooms().filter(room => room.roomType === $(".room-type-dropdown").val())
    appendAvailableRooms(filteredRooms)
  }
  if ($(".room-type-dropdown").val() === "all") {
    appendAvailableRooms(loadAvailableRooms());
  }
}

$(".login-btn").click(logIn)
$(".total-spent-btn").click(toggleTotalSpent)
$(".check-rates-btn").click(getRates)
