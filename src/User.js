import Bookings from "./Bookings"
import $ from 'jquery';
import {returnUser, returnDate} from './index.js'


class User {
  constructor() {
  }

  bookRoom(date, user, rooms, target) {
    let roomNum = $(this).attr('id');
    let roomToBook = rooms.find(room => room.number === roomNum)
    roomToBook = {
      "userID": user.id,
      "date": date,
      "roomNumber": roomToBook.number
    }
    const sendBooking = async (booking) => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
      };
      const response = await fetch(
        'https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings',
        options
      );
      if (!response.ok) {
        throw new Error(
          `Could not book your room.  Try again.`
        );
      }
      const data = await response.json();
      return data;
    };
    sendBooking(roomToBook);
    $(target).closest(".available-booking-card").remove()
    alert("Booking confirmed! Please refresh the page to see changes in your Trips")
  }
}

export default User;
