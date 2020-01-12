class Bookings {
  constructor(rooms, bookings) {
    this.rooms = rooms;
    this.bookings = bookings;
  }

  getRoomsAvailable(date) {
    return this.rooms.length - this.getRoomsBooked(date).length
  }

  getRoomsBooked(date) {
    return this.rooms.reduce((acc, room) => {
      this.bookings.forEach(booking =>{
        if (room.number === booking.roomNumber && booking.date === date) {
          acc.push(booking.roomNumber)
        }
      })
      return acc
    }, [])
  }
}

export default Bookings;
