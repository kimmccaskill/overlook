class Bookings {
  constructor(rooms, bookings) {
    this.rooms = rooms;
    this.bookings = bookings;
  }

  getRoomsBooked(date) {
    return this.rooms.reduce((acc, room) => {
      this.bookings.forEach(booking =>{
        if (room.number === booking.roomNumber && booking.date === date) {
          acc.push(booking)
        }
      })
      return acc
    }, [])
  }
}

export default Bookings;
