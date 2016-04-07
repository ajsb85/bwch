# BwCh

BwCh is an open-source JavaScript API to detect bandwidth for web-based environments. 
It uses some of the latest JavaScript innovation (window.navigator.connection currently 
supported in Chrome 48+ for Android as of April 2016)
in order to provide a flexible method to detect bandwidth for both mobile and desktop 
devices. 
It fallbacks to image pre-loading to detect bandwidth where those newest API are not available. 

BwCh is used for some of [Radiant Media Player](https://www.radiantmediaplayer.com) 
newest  features.

BwCh is written with ES2015. It is compiled to classic ES5 JavaScript 
with [Babel](https://babeljs.io/) and [Browserify](http://browserify.org/#install).
The main file consist of an ES2015 class that needs to be imported in a project where 
it can be used. 

A complete implementation example and jasmine-based test suite are provided.

You can see it live at work [here](https://www.radiantmediaplayer.com/blog/detecting-bandwidth-with-bwch.html).

Contributions are welcome.

## Usage
Import BwCh class from bwch.js, create a new instance and call
the getBandwidth method. A `Promise` is returned resolving to the detected bandwidth.
```javascript
import 'babel-polyfill';
import {BwCh} from '../../../src/bwch';
(() => {
  'use strict';
  const bwch = new BwCh('https://cdn.radiantmediatechs.com/rmp/bandwidth', 4, 2000, true, true);
  let bw = bwch.getBandwidth(); 
  bw.then((bandwidth) => {
    console.log(bandwidth);
  });
})();  
```

The `bandwidth` returned value is a `Number` representing the detected bandwidth in 
kbps. If the bandwidth could not be determined 
(no Internet connection or errors while processing the detection) `-1` is returned. 

### Params for the BwCh constructor
```javascript
new BwCh(imagesLoc, steps, timeout, randomQS, debug);
```

`imagesLoc` is a `String` which represents the location of your test images. 
Default: '../img/'. Please do not use the https://cdn.radiantmediatechs.com/rmp/bandwidth base URL 
in your project as this is just a demo. Host the images on your server. Images are PNG because 
it is an uncompressed format best suited for testing download speed.

`steps` is the `Number` of steps for bandwidth detection. Valid values are 1, 2, 3 or 4. 
The more steps the better is the bandwidth detection but at the cost of extra processing.

`timeout` is a `Number` in ms representing the time after which the image preloading 
(for each image) is stopped. Default 2000.

`randomQS` is a `Boolean`. When true it adds a random query string to the image 
preloading URLs. Default true.

`debug` is a `Boolean`. When true it logs BwCh data to the browser console.



## Building
```shell
git clone https://github.com/radiantmediaplayer/bwch.git
npm install
grunt
```

You can use `grunt dev` for watchify tasks. 
You need to have [`jshint`](http://jshint.com/install), 
[`browserify`](http://browserify.org/#install) and 
[`watchify`](https://github.com/substack/watchify) installed globally to make it work!


## License
MIT as outlined in the license.txt file
