export class BwCh {

  constructor(imagesLoc, steps, timeout, randomQS, debug) {
    if (typeof imagesLoc !== 'string') {
      imagesLoc = '../img/';
    }
    if (typeof steps !== 'number' || steps < 1 || steps > 4) {
      steps = 3;
    }
    let lastChar = imagesLoc.slice(-1);
    if (lastChar !== '/') {
      imagesLoc += '/';
    }
    if (typeof timeout !== 'number') {
      steps = 2000;
    }
    if (typeof randomQS !== 'boolean') {
      debug = true;
    }
    if (typeof debug !== 'boolean') {
      debug = false;
    }
    this.imagesLoc = imagesLoc;
    this.steps = parseInt(steps);
    this.randomQS = randomQS;
    this.debug = debug;
    this.timeout = timeout;
    this.bytes = [11773, 40836, 165544, 382946];
    this.kbpsThreshold = [50, 250, 750, 4000];
  }

  isNumber(n) {
    if (typeof n !== 'undefined') {
      if (isFinite(n) && !isNaN(parseFloat(n))) {
        return true;
      }
    }
    return false;
  }

  loadImage(index) {
    return new Promise((resolve, reject) => {
      let startDate = Date.now();
      let img = new Image();
      let src = this.imagesLoc + 'bw' + index + '.png';
      if (this.randomQS) {
        let random = Date.now() + Math.random();
        src += '?rqs=' + random;
      }
      if (this.debug) {
        console.log('BWCH: request image ' + src);
      }
      let imgComplete = false;
      img.addEventListener('load', () => {
        imgComplete = true;
        let duration = (Date.now() - startDate) / 1000;
        let kpbs = Math.round((this.bytes[index] * 8 / duration) / 1000);
        if (this.debug) {
          console.log('BWCH: loaded image ' + index + ' @ ' + kpbs + ' kbps');
        }
        resolve(kpbs);
      });
      img.addEventListener('error', () => {
        imgComplete = true;
        reject('BWCH: could not get bandwidth data');
      });
      setTimeout(() => {
        if (!imgComplete) {
          reject('BWCH: timeout to load image');
        }
      }, this.timeout);
      img.src = src;
    });
  }

  getBandwidthFallback() {
    return new Promise((resolve) => {
      let detectedBw = -1;
      this.loadImage(0).then((kpbs) => {
        detectedBw = kpbs;
        if (detectedBw > this.kbpsThreshold[0] && this.steps > 1) {
          this.loadImage(1).then((kbps) => {
            detectedBw = Math.round((detectedBw + kbps) / 2);
            if (detectedBw > this.kbpsThreshold[1] && this.steps > 2) {
              this.loadImage(2).then((kbps) => {
                detectedBw = Math.round((detectedBw + kbps) / 2);
                if (detectedBw > this.kbpsThreshold[2] && this.steps > 3) {
                  detectedBw = Math.round((detectedBw + kbps) / 2);
                  this.loadImage(3).then((kbps) => {
                    detectedBw = Math.round((detectedBw + kbps) / 2);
                    resolve(detectedBw);
                  }).catch((err) => {
                    console.log(err);
                    resolve(detectedBw);
                  });
                } else {
                  resolve(detectedBw);
                }
              }).catch((err) => {
                console.log(err);
                resolve(detectedBw);
              });
            } else {
              resolve(detectedBw);
            }
          }).catch((err) => {
            console.log(err);
            resolve(detectedBw);
          });
        } else {
          resolve(detectedBw);
        }
      }).catch((err) => {
        console.log(err);
        resolve(detectedBw);
      });
    });
  }

  getBandwidth() {
    let avgBitrate;
    if (typeof window.navigator === 'undefined' ||
      ('onLine' in window.navigator && !window.navigator.onLine)) {
      avgBitrate = -1;
      return new Promise((resolve) => {
        if (this.debug) {
          console.log('BWCH: could not get bandwidth data');
        }
        resolve(avgBitrate);
      });
    } else if ('connection' in window.navigator &&
      'downlinkMax' in window.navigator.connection) {
      if (this.debug) {
        console.log('BWCH: downlinkMax in navigator.connection available');
      }
      let downlinkMax;
      let connectionType;
      try {
        downlinkMax = navigator.connection.downlinkMax;
        connectionType = navigator.connection.type;
        if (this.debug) {
          console.log('BWCH: downlinkMax raw value (Mbps) of ' + downlinkMax);
          console.log('BWCH: detected connection type is ' + connectionType);
        }
        if (downlinkMax === Number.POSITIVE_INFINITY) {
          downlinkMax = 1000;
        }
        if (!this.isNumber(downlinkMax)) {
          if (this.debug) {
            console.log('BWCH: downlinkMax not available - fallback to image fetching');
          }
          if (connectionType !== 'none') {
            return this.getBandwidthFallback();
          }
        }
        if (connectionType === 'none') {
          avgBitrate = -1;
        } else if (connectionType === 'cellular' || connectionType === 'bluetooth') {
          if (downlinkMax <= 0.237) {
            avgBitrate = 50;
          } else if (downlinkMax <= 0.384) {
            avgBitrate = 250;
          } else if (downlinkMax <= 42) {
            avgBitrate = 750;
          } else {
            avgBitrate = 4000;
          }
        } else if (connectionType === 'wimax' || connectionType === 'ethernet' ||
          connectionType === 'wifi') {
          if (downlinkMax <= 37) {
            avgBitrate = 750;
          } else if (downlinkMax <= 141) {
            avgBitrate = 4000;
          } else {
            return this.getBandwidthFallback();
          }
        } else {
          return this.getBandwidthFallback();
        }
      } catch (e) {
        if (this.debug) {
          console.log(e);
        }
        return this.getBandwidthFallback();
      }
      return new Promise((resolve) => {
        if (this.debug) {
          console.log('BWCH: returning estimated BW of ' + avgBitrate + ' kbps');
        }
        resolve(avgBitrate);
      });
    } else {
      if (this.debug) {
        console.log('BWCH: navigator.connection not available - fallback to image fetching');
      }
      return this.getBandwidthFallback();
    }
  }

}