import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
import User from "../src/User"

chai.use(spies);

describe('See if the tests are running', function() {
  // beforeEach(() => {
  //   chai.spy.on(index, ['returnDate'], () => {})
  // });
  it('should return true', function() {
    expect(true).to.equal(true);
  });
});
