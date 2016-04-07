
import 'babel-polyfill';
import {BwCh} from '../../../src/bwch';
(() => {
  'use strict';
  const bwch = new BwCh('https://cdn.radiantmediatechs.com/rmp/bandwidth', 4, 2500, true, true);
  let bw = bwch.getBandwidth(); 
  bw.then((bandwidth) => {
    document.getElementById('bw').textContent = bandwidth;
  });
})();  