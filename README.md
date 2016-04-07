# BwCh

BwCh is a JavaScript API to detect bandwidth for web-based environments. 
It uses some of the latest JavaScript innovation (window.navigator.connection currently 
supported in Chrome 48+ for Android as of April 2016)
in order to provide a flexible method to detect bandwidth for both mobile and desktop 
devices. 
It fallbacks to image pre-loading to detect bandwidth where those newest API are not available. 

BwCh is used for some of [Radiant Media Player](https://www.radiantmediaplayer.com) features.

BwCh is written with ES2015. It is compiled to classic ES5 JavaScript 
with [Babel](https://babeljs.io/) and [Browserify](http://browserify.org/#install).
The main file consist of an ES2015 class that needs to be imported in a project where 
it can be used. 

A complete implementation example and jasmine-based test suite are provided.

Contributions are welcome.

## Usage
Include the bwch.js file in your project. 

Import the class, create a new instance and call
the getBandwidth method. A Promise is returned with the detected bandwidth.
```javascript
import 'babel-polyfill';
import {BwCh} from '../../../src/bwch';
(() => {
  'use strict';
  const bwch = new BwCh('https://cdn.radiantmediatechs.com/rmp/bandwidth', 4, 2500, true, true);
  let bw = bwch.getBandwidth(); 
  bw.then((bandwidth) => {
    console.log(bandwidth);
  });
})();  
```
### Params for the BwCh constructor
```javascript
new BwCh(imagesLoc, steps, timeout, randomQS, debug);
```

`imagesLoc` is a `string` which represents the location of your test images. 
Default: '../img/'.

`steps` is the `number` of steps for bandwidth detection. Valid values are 1, 2, 3 or 4. 
The more steps the better is the bandwidth detection but at the cost of extra processing.

`timeout` is a `number` in ms representing the time after which the image preloading 
(for each image) is stopped. Default 2000.

`randomQS` is a `boolean`. When true it adds a random query string to the image 
preloading URLs. Default true.

`debug` is a `boolean`. When true it logs BwCh data to the browser console.



## Building
```shell
git clone https://github.com/radiantmediaplayer/bwch.git
npm install
grunt
```

You can use `grunt dev` for watchify
You need to have [`jshint`](http://jshint.com/install), 
[`browserify`](http://browserify.org/#install) and [`watchify`](https://github.com/substack/watchify) installed globally to make it work!


## License
MIT as outlined in the license.txt file
