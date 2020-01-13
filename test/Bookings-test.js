import chai from 'chai';
const expect = chai.expect;
import Bookings from "../src/Bookings"
import rooms from "./rooms-data"
import bookings from "./bookings-data"

let bookingClass;

describe('Class Bookings', function() {
  beforeEach(() => {
    bookingClass = new Bookings(rooms, bookings)
  });

  it('should hold rooms data', function() {
    expect(bookingClass.rooms).to.deep.equal(rooms);
  });

  it('should hold bookings data', function() {
    expect(bookingClass.bookings).to.deep.equal(bookings);
  });

  it('should get how many rooms are available', function() {
    expect(bookingClass.getRoomsAvailable("2020/02/04")).to.deep.equal(24);
  });

  it('should get bookings for specific date', function() {
    expect(bookingClass.getRoomsBooked("2020/02/04")).to.deep.equal([15]);
  });
});
