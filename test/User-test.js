import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
import User from "../src/User"
chai.use(spies);

let user;

describe('User Class', function() {
  beforeEach(() => {
    user = new User()
    chai.spy.on(user, ['bookRoom'], () => {})
  });
  it('should check that bookRoom is called', function() {
    user.bookRoom();
    expect(user.bookRoom).to.have.been.called();
  });
});
