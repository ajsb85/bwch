import 'babel-polyfill';
import {BwCh} from '../../../src/bwch';
describe("BwCh testing", () => {
  'use strict';
  it('should get bandwidth', (done) => {
    const bwch = new BwCh('https://cdn.radiantmediatechs.com/rmp/bandwidth', 4, 2000, true, true);
    let bw = bwch.getBandwidth();
    bw.then((bandwidth) => {
      console.log(bandwidth);
      expect(bandwidth).toMatch(/\d+/gi);
      expect(bandwidth).toBeGreaterThan(0);
      done();
    });
  });   
  it('should not get bandwidth', (done) => {      
    const bwch = new BwCh('https://myfakedomain.com', 4, 2000, true, true);
    let bw = bwch.getBandwidth();
    bw.then((bandwidth) => {
      console.log(bandwidth);   
      expect(bandwidth).toEqual(-1);
      done();
    });
  });
});
