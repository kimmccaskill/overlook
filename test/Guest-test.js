import chai from 'chai';
const expect = chai.expect;
import Guest from "../src/Guest"
import rooms from "./rooms-data"

let guest, userBookings;

describe('Guest Class', function() {
  beforeEach(() => {
    userBookings = [{
      id: "5fwrgu4i7k55hl6t5",
      userID: 2,
      date: "2020/01/24",
      roomNumber: 24,
      roomServiceCharges: [ ]
    },{
      id: "5fwrgu4i7k55hl6t9",
      userID: 2,
      date: "2020/02/14",
      roomNumber: 14,
      roomServiceCharges: [ ]
    }];
    guest = new Guest(2, "Rocio Schuster",userBookings, rooms)
  });
  it('should have an id', function() {
    expect(guest.id).to.equal(2);
  });

  it('should have a name', function() {
    expect(guest.name).to.equal("Rocio Schuster");
  });

  it('should have bookings', function() {
    expect(guest.bookings).to.equal(userBookings);
  });

  it('be able to book any room', function() {
    expect(guest.rooms).to.equal(rooms);
  });
});
