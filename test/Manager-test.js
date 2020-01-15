import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
chai.use(spies);
import Manager from "../src/Manager"

let manager;

describe('Manager Class', function() {
  it('be able to check that deleteBooking is called', function() {
    manager = new Manager()
    chai.spy.on(manager, ['deleteBooking'], () => {})

    manager.deleteBooking();
    expect(manager.deleteBooking).to.have.been.called();
  });
});
