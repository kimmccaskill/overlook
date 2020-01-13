import Bookings from "./Bookings"
import $ from 'jquery';
import {returnUser, returnDate} from './index.js'


class User {
  constructor() {
  }

  bookRoom(event) {
    let roomNum = event.currentTarget.id;
    let roomToBook = returnUser().rooms.find(room => room.number === parseInt(roomNum))
    let date = returnDate();
    roomToBook = {
      "userID": returnUser().id,
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
  }
}

export default User;
