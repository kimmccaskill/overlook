import Bookings from "./Bookings"
import User from "./User"
import $ from 'jquery';

class Manager extends User{
  constructor() {
    super();
  }

  deleteBooking(bookings, target) {
    let bookingId = $(target).attr("id")
    let roomToDelete;
    if ($.isNumeric(bookingId)) {
      roomToDelete = parseInt(bookings.find(booking => booking.id === parseInt(bookingId)).id)
    } else {
      roomToDelete = bookings.find(booking => booking.id === bookingId).id
    }

    fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: roomToDelete
      })
    })
    fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: `${roomToDelete.id}`
      })
    })
    $(target).closest(".guest-booking-card").remove()
  }
}

export default Manager;
