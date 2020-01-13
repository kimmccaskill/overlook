import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
import User from "../src/User"
chai.use(spies);

let user;

describe('User Class', function() {
  beforeEach(() => {
    // chai.spy.on(User, ['returnDate','returnUser'], () => {})
    user = new User()
    chai.spy.on(user, ['bookRoom'], () => {const sendBooking = () => {}; sendBooking()})
  });
  it.skip('should check that sendBooking is called', function() {
    user.bookRoom();
    console.log(user.bookRoom.sendBooking)
    expect(user.bookRoom().sendBooking()).toHaveBeenCalled();
  });
});
