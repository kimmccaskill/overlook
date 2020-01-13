import Bookings from "./Bookings"
import User from "./User"
import $ from 'jquery';

class Guest extends User{
  constructor(id, name, bookings, rooms) {
    super();
    this.id = id;
    this.name = name;
    this.bookings = bookings;
    this.rooms = rooms;
  }
}

export default Guest;
