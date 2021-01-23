/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const util = __webpack_require__(1);
const log = util.debuglog('heroku');

// if the node version does not match the major version, bail
const match = process.version.match(/^v([0-9]+)/);
const isExpectedNodeVersion = match && match[1] === "12";

// if we are not using node installed by the Heroku buildpack, bail
const isExpectedNodePath = process.execPath === "/app/.heroku/node/bin/node";

if (isExpectedNodeVersion && isExpectedNodePath) {
  const start = __webpack_require__(2);
  start();
} else {
  if (!isExpectedNodePath) {
    log("[heroku-nodejs-plugin] expected different Node path. Found:", process.execPath);
  }
  if (!isExpectedNodeVersion) {
    log("[heroku-nodejs-plugin] expected different Node version. Expected:",
    "12",
    "Found:",
    match && match[1]);
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const http = __webpack_require__(3);
const https = __webpack_require__(4);
const url = __webpack_require__(5);
const util = __webpack_require__(1);
const { Histogram } = __webpack_require__(6);
const nativeStats = __webpack_require__(23);

// url is where the runtime metrics will be posted to. This is added
// to dynos by runtime iff the app is opped into the heroku runtime metrics
// beta.
let uri = url.parse(process.env.HEROKU_METRICS_URL);

function submitData(data, cb) {
  const postData = JSON.stringify(data);

  // post data to metricsURL
  const options = {
    method: "POST",
    protocol: uri.protocol,
    hostname: uri.hostname,
    port: uri.port,
    path: uri.path,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const request = uri.protocol === 'https:' ? https.request : http.request;
  const req = request(options, res => cb(null, res));
  req.on('error', cb);
  req.write(postData);
  req.end();
}

function start() {
  const log = util.debuglog('heroku');

  const METRICS_INTERVAL = parseInt(process.env.METRICS_INTERVAL_OVERRIDE, 10) || 20000; // 20 seconds

  // Set a minimum of 10 seconds
  if (METRICS_INTERVAL < 10000) {
    METRICS_INTERVAL = 10000;
  }

  // Collects the event loop ticks, and calculates p50, p95, p99, max
  let delay = new Histogram();

  nativeStats.start();

  // every METRICS_INTERVAL seconds, submit a metrics payload to metricsURL.
  setInterval(() => {
    let { ticks, gcCount, gcTime, oldGcCount, oldGcTime, youngGcCount, youngGcTime } = nativeStats.sense();
    let totalEventLoopTime = ticks.reduce((a, b) => a + b, 0);

    ticks.forEach(tick => delay.update(tick));

    let aa = totalEventLoopTime / METRICS_INTERVAL;

    let { median, p95, p99, max } = delay.toJSON();

    let data = {
      counters: {
        "node.gc.collections": gcCount,
        "node.gc.pause.ns": gcTime,
        "node.gc.old.collections": oldGcCount,
        "node.gc.old.pause.ns": oldGcTime,
        "node.gc.young.collections": youngGcCount,
        "node.gc.young.pause.ns": youngGcTime,
      },
      gauges: {
        "node.eventloop.usage.percent": aa,
        "node.eventloop.delay.ms.median": median,
        "node.eventloop.delay.ms.p95": p95,
        "node.eventloop.delay.ms.p99": p99,
        "node.eventloop.delay.ms.max": max
      }
    };

    submitData(data, (err, res) => {
      if (err !== null) {
        log(
          "[heroku-nodejs-plugin] error when trying to submit data: ",
          err
        );
        return;
      }

      if (res.statusCode !== 200) {
        log(
          "[heroku-nodejs-plugin] expected 200 when trying to submit data, got:",
          res.statusCode
        );
        return;
      }
    });

    delay.reset();
  }, METRICS_INTERVAL).unref();
}

module.exports = start;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Collection = __webpack_require__(7);
var metrics = __webpack_require__(8);
var util = __webpack_require__(22);

var name;
for (name in metrics) {
  if (metrics.hasOwnProperty(name)) {
    exports[name] = metrics[name];
  }
}

for (name in util) {
  if (util.hasOwnProperty(name)) {
    exports[name] = util[name];
  }
}

exports.createCollection = function (name) {
  return new Collection(name);
};

exports.Collection = Collection;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var metrics = __webpack_require__(8);

function Collection(name) {
  this.name     = name;
  this._metrics = {};
}

Collection.prototype.register = function (name, metric) {
  this._metrics[name] = metric;
};

Collection.prototype.toJSON = function () {
  var json = {};

  var metric;
  for (metric in this._metrics) {
    if (this._metrics.hasOwnProperty(metric)) {
      json[metric] = this._metrics[metric].toJSON();
    }
  }

  if (!this.name) {
    return json;
  }

  var wrapper = {};
  wrapper[this.name] = json;

  return wrapper;
};

Collection.prototype.end = function end() {
  var metrics = this._metrics;
  Object.keys(metrics).forEach(function (name) {
    var metric = metrics[name];
    if (metric.end) {
      metric.end();
    }
  });
};

Object
  .keys(metrics)
  .forEach(function (name) {
    var MetricConstructor = metrics[name];
    var method = name.substr(0, 1).toLowerCase() + name.substr(1);

    Collection.prototype[method] = function (name, properties) {
      if (!name) {
        throw new Error('Collection.NoMetricName');
      }

      if (this._metrics[name]) {
        return this._metrics[name];
      }

      var metric = new MetricConstructor(properties);
      this.register(name, metric);
      return metric;
    };
  });

module.exports = Collection;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.Counter   = __webpack_require__(9);
exports.Gauge     = __webpack_require__(10);
exports.Histogram = __webpack_require__(11);
exports.Meter     = __webpack_require__(15);
exports.Timer     = __webpack_require__(21);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Counter(properties) {
  properties = properties || {};

  this._count = properties.count || 0;
}

Counter.prototype.toJSON = function () {
  return this._count;
};

Counter.prototype.inc = function (n) {
  this._count += (arguments.length ? n : 1);
};

Counter.prototype.dec = function (n) {
  this._count -= (arguments.length ? n : 1);
};

Counter.prototype.reset = function (count) {
  this._count = count || 0;
};

module.exports = Counter;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Gauge(readFn) {
  this._readFn = readFn;
}

// This is sync for now, but maybe async gauges would be useful as well?
Gauge.prototype.toJSON = function () {
  return this._readFn();
};

module.exports = Gauge;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EDS = __webpack_require__(12);

function Histogram(properties) {
  properties = properties || {};

  this._sample    = properties.sample || new EDS();
  this._min       = null;
  this._max       = null;
  this._count     = 0;
  this._sum       = 0;

  // These are for the Welford algorithm for calculating running variance
  // without floating-point doom.
  this._varianceM = 0;
  this._varianceS = 0;
}

Histogram.prototype.update = function (value) {
  this._count++;
  this._sum += value;

  this._sample.update(value);
  this._updateMin(value);
  this._updateMax(value);
  this._updateVariance(value);
};

Histogram.prototype.percentiles = function (percentiles) {
  var values = this._sample
    .toArray()
    .sort(function (a, b) {
      return (a === b)
        ? 0
        : a - b;
    });

  var results = {};

  var i, percentile, pos, lower, upper;
  for (i = 0; i < percentiles.length; i++) {
    percentile = percentiles[i];
    if (values.length) {
      pos = percentile * (values.length + 1);
      if (pos < 1) {
        results[percentile] = values[0];
      } else if (pos >= values.length) {
        results[percentile] = values[values.length - 1];
      } else {
        lower = values[Math.floor(pos) - 1];
        upper = values[Math.ceil(pos) - 1];
        results[percentile] =
          lower + (pos - Math.floor(pos)) * (upper - lower);
      }
    } else {
      results[percentile] = null;
    }
  }

  return results;
};

Histogram.prototype.reset = function () {
  this.constructor();
};

Histogram.prototype.hasValues = function () {
  return this._count > 0;
};

Histogram.prototype.toJSON = function () {
  var percentiles = this.percentiles([0.5, 0.75, 0.95, 0.99, 0.999]);

  return {
    min      : this._min,
    max      : this._max,
    sum      : this._sum,
    variance : this._calculateVariance(),
    mean     : this._calculateMean(),
    stddev   : this._calculateStddev(),
    count    : this._count,
    median   : percentiles[0.5],
    p75      : percentiles[0.75],
    p95      : percentiles[0.95],
    p99      : percentiles[0.99],
    p999     : percentiles[0.999]
  };
};

Histogram.prototype._updateMin = function (value) {
  if (this._min === null || value < this._min) {
    this._min = value;
  }
};

Histogram.prototype._updateMax = function (value) {
  if (this._max === null || value > this._max) {
    this._max = value;
  }
};

Histogram.prototype._updateVariance = function (value) {
  if (this._count === 1) {
    this._varianceM = value;
    return value;
  }

  var oldM = this._varianceM;

  this._varianceM += ((value - oldM) / this._count);
  this._varianceS += ((value - oldM) * (value - this._varianceM));
};

Histogram.prototype._calculateMean = function () {
  return (this._count === 0)
    ? 0
    : this._sum / this._count;
};

Histogram.prototype._calculateVariance = function () {
  return (this._count <= 1)
    ? null
    : this._varianceS / (this._count - 1);
};

Histogram.prototype._calculateStddev = function () {
  return (this._count < 1)
    ? null
    : Math.sqrt(this._calculateVariance());
};

module.exports = Histogram;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BinaryHeap = __webpack_require__(13);
var units      = __webpack_require__(14);

function ExponentiallyDecayingSample(options) {
  options = options || {};

  this._elements = new BinaryHeap({
    score: function (element) {
      return -element.priority;
    }
  });

  this._rescaleInterval = options.rescaleInterval
    || ExponentiallyDecayingSample.RESCALE_INTERVAL;
  this._alpha           = options.alpha || ExponentiallyDecayingSample.ALPHA;
  this._size            = options.size || ExponentiallyDecayingSample.SIZE;
  this._random          = options.random || this._random;
  this._landmark        = null;
  this._nextRescale     = null;
}

ExponentiallyDecayingSample.RESCALE_INTERVAL = units.HOURS;
ExponentiallyDecayingSample.ALPHA            = 0.015;
ExponentiallyDecayingSample.SIZE             = 1028;

ExponentiallyDecayingSample.prototype.update = function (value, timestamp) {
  var now = Date.now();
  if (!this._landmark) {
    this._landmark    = now;
    this._nextRescale = this._landmark + this._rescaleInterval;
  }

  timestamp = timestamp || now;

  var newSize = this._elements.size() + 1;

  var element = {
    priority: this._priority(timestamp - this._landmark),
    value: value
  };

  if (newSize <= this._size) {
    this._elements.add(element);
  } else if (element.priority > this._elements.first().priority) {
    this._elements.removeFirst();
    this._elements.add(element);
  }

  if (now >= this._nextRescale) {
    this._rescale(now);
  }
};

ExponentiallyDecayingSample.prototype.toSortedArray = function () {
  return this._elements
    .toSortedArray()
    .map(function (element) {
      return element.value;
    });
};


ExponentiallyDecayingSample.prototype.toArray = function () {
  return this._elements
    .toArray()
    .map(function (element) {
      return element.value;
    });
};

ExponentiallyDecayingSample.prototype._weight = function (age) {
  // We divide by 1000 to not run into huge numbers before reaching a
  // rescale event.
  return Math.exp(this._alpha * (age / 1000));
};

ExponentiallyDecayingSample.prototype._priority = function (age) {
  return this._weight(age) / this._random();
};

ExponentiallyDecayingSample.prototype._random = function () {
  return Math.random();
};

ExponentiallyDecayingSample.prototype._rescale = function (now) {
  now               = now || Date.now();

  var self          = this;
  var oldLandmark   = this._landmark;
  this._landmark    = now || Date.now();
  this._nextRescale = now + this._rescaleInterval;

  var factor = self._priority(-(self._landmark - oldLandmark));

  this._elements
    .toArray()
    .forEach(function (element) {
      element.priority *= factor;
    });
};

module.exports = ExponentiallyDecayingSample;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Based on http://en.wikipedia.org/wiki/Binary_Heap
// as well as http://eloquentjavascript.net/appendix2.html
function BinaryHeap(options) {
  options = options || {};

  this._elements = options.elements || [];
  this._score    = options.score || this._score;
}

BinaryHeap.prototype.add = function () {
  var i, element;
  for (i = 0; i < arguments.length; i++) {
    element = arguments[i];

    this._elements.push(element);
    this._bubble(this._elements.length - 1);
  }
};

BinaryHeap.prototype.first = function () {
  return this._elements[0];
};

BinaryHeap.prototype.removeFirst = function () {
  var root = this._elements[0];
  var last = this._elements.pop();

  if (this._elements.length > 0) {
    this._elements[0] = last;
    this._sink(0);
  }

  return root;
};

BinaryHeap.prototype.clone = function () {
  return new BinaryHeap({
    elements: this.toArray(),
    score: this._score
  });
};

BinaryHeap.prototype.toSortedArray = function () {
  var array = [];
  var clone = this.clone();
  var element;

  while (true) {
    element = clone.removeFirst();
    if (element === undefined) {
      break;
    }

    array.push(element);
  }

  return array;
};

BinaryHeap.prototype.toArray = function () {
  return [].concat(this._elements);
};

BinaryHeap.prototype.size = function () {
  return this._elements.length;
};

BinaryHeap.prototype._bubble = function (bubbleIndex) {
  var bubbleElement = this._elements[bubbleIndex];
  var bubbleScore   = this._score(bubbleElement);
  var parentIndex;
  var parentElement;
  var parentScore;

  while (bubbleIndex > 0) {
    parentIndex   = this._parentIndex(bubbleIndex);
    parentElement = this._elements[parentIndex];
    parentScore   = this._score(parentElement);

    if (bubbleScore <= parentScore) {
      break;
    }

    this._elements[parentIndex] = bubbleElement;
    this._elements[bubbleIndex] = parentElement;
    bubbleIndex                 = parentIndex;
  }
};

BinaryHeap.prototype._sink = function (sinkIndex) {
  var sinkElement = this._elements[sinkIndex];
  var sinkScore   = this._score(sinkElement);
  var length      = this._elements.length;
  var swapIndex;
  var swapScore;
  var swapElement;
  var childIndexes;
  var i;
  var childIndex;
  var childElement;
  var childScore;

  while (true) {
    swapIndex    = null;
    swapScore    = null;
    swapElement  = null;
    childIndexes = this._childIndexes(sinkIndex);

    for (i = 0; i < childIndexes.length; i++) {
      childIndex = childIndexes[i];

      if (childIndex >= length) {
        break;
      }

      childElement = this._elements[childIndex];
      childScore   = this._score(childElement);

      if (childScore > sinkScore) {
        if (swapScore === null || swapScore < childScore) {
          swapIndex   = childIndex;
          swapScore   = childScore;
          swapElement = childElement;
        }
      }
    }

    if (swapIndex === null) {
      break;
    }

    this._elements[swapIndex] = sinkElement;
    this._elements[sinkIndex] = swapElement;
    sinkIndex = swapIndex;
  }
};

BinaryHeap.prototype._parentIndex = function (index) {
  return Math.floor((index - 1) / 2);
};

BinaryHeap.prototype._childIndexes = function (index) {
  return [
    2 * index + 1,
    2 * index + 2
  ];
};

BinaryHeap.prototype._score = function (element) {
  return element.valueOf();
};

module.exports = BinaryHeap;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Time units, as found in Java:
// http://download.oracle.com/
//   javase/6/docs/api/java/util/concurrent/TimeUnit.html
exports.NANOSECONDS  = 1 / (1000 * 1000);
exports.MICROSECONDS = 1 / 1000;
exports.MILLISECONDS = 1;
exports.SECONDS      = 1000 * exports.MILLISECONDS;
exports.MINUTES      = 60 * exports.SECONDS;
exports.HOURS        = 60 * exports.MINUTES;
exports.DAYS         = 24 * exports.HOURS;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var units     = __webpack_require__(14);
var EWMA      = __webpack_require__(16);
var Stopwatch = __webpack_require__(17);

function Meter(properties) {
  properties = properties || {};

  this._rateUnit     = properties.rateUnit || Meter.RATE_UNIT;
  this._tickInterval = properties.tickInterval || Meter.TICK_INTERVAL;
  if (properties.getTime) {
    this._getTime = properties.getTime;
  }

  this._m1Rate     = new EWMA(units.MINUTES, this._tickInterval);
  this._m5Rate     = new EWMA(5 * units.MINUTES, this._tickInterval);
  this._m15Rate    = new EWMA(15 * units.MINUTES, this._tickInterval);
  this._count      = 0;
  this._currentSum = 0;
  this._startTime = this._getTime();
  this._lastToJSON = this._getTime();
  this._interval = setInterval(this._tick.bind(this), Meter.TICK_INTERVAL);
}

Meter.RATE_UNIT     = units.SECONDS;
Meter.TICK_INTERVAL = 5 * units.SECONDS;

Meter.prototype.mark = function (n) {
  if (!this._interval) {
    this.start();
  }

  n = n || 1;

  this._count += n;
  this._currentSum += n;
  this._m1Rate.update(n);
  this._m5Rate.update(n);
  this._m15Rate.update(n);
};

Meter.prototype.start = function () {
  return;
};

Meter.prototype.end = function () {
  clearInterval(this._interval);
  this._interval = null;
};

Meter.prototype.ref = function () {
  if (this._interval && this._interval.ref) {
    this._interval.ref();
  }
};

Meter.prototype.unref = function () {
  if (this._interval && this._interval.unref) {
    this._interval.unref();
  }
};

Meter.prototype._tick = function () {
  this._m1Rate.tick();
  this._m5Rate.tick();
  this._m15Rate.tick();
};

Meter.prototype.reset = function () {
  this.end();
  this.constructor();
};

Meter.prototype.meanRate = function () {
  if (this._count === 0) {
    return 0;
  }

  var elapsed = this._getTime() - this._startTime;
  return this._count / elapsed * this._rateUnit;
};

Meter.prototype.currentRate = function () {
  var currentSum  = this._currentSum;
  var duration    = this._getTime() - this._lastToJSON;
  var currentRate = currentSum / duration * this._rateUnit;

  this._currentSum = 0;
  this._lastToJSON = this._getTime();

  // currentRate could be NaN if duration was 0, so fix that
  return currentRate || 0;
};

Meter.prototype.toJSON = function () {
  return {
    'mean'         : this.meanRate(),
    'count'        : this._count,
    'currentRate'  : this.currentRate(),
    '1MinuteRate'  : this._m1Rate.rate(this._rateUnit),
    '5MinuteRate'  : this._m5Rate.rate(this._rateUnit),
    '15MinuteRate' : this._m15Rate.rate(this._rateUnit)
  };
};

Meter.prototype._getTime = function () {
  if (!process.hrtime) {
    return new Date().getTime();
  }

  var hrtime = process.hrtime();
  return hrtime[0] * 1000 + hrtime[1] / (1000 * 1000);
};

module.exports = Meter;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var units = __webpack_require__(14);

function ExponentiallyMovingWeightedAverage(timePeriod, tickInterval) {
  this._timePeriod   = timePeriod || units.MINUTE;
  this._tickInterval = tickInterval
    || ExponentiallyMovingWeightedAverage.TICK_INTERVAL;
  this._alpha        = 1 - Math.exp(-this._tickInterval / this._timePeriod);
  this._count        = 0;
  this._rate         = 0;
}
ExponentiallyMovingWeightedAverage.TICK_INTERVAL = 5 * units.SECONDS;

ExponentiallyMovingWeightedAverage.prototype.update = function (n) {
  this._count += n;
};

ExponentiallyMovingWeightedAverage.prototype.tick = function () {
  var instantRate = this._count / this._tickInterval;
  this._count     = 0;

  this._rate += (this._alpha * (instantRate - this._rate));
};

ExponentiallyMovingWeightedAverage.prototype.rate = function (timeUnit) {
  return (this._rate || 0) * timeUnit;
};

module.exports = ExponentiallyMovingWeightedAverage;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits     = __webpack_require__(18);
var EventEmitter = __webpack_require__(20).EventEmitter;

function Stopwatch(options) {
  options = options || {};
  EventEmitter.call(this);

  if (options.getTime) {
    this._getTime = options.getTime;
  }
  this._start = this._getTime();
  this._ended = false;
}

inherits(Stopwatch, EventEmitter);

Stopwatch.prototype.end = function () {
  if (this._ended) {
    return;
  }

  this._ended = true;
  var elapsed   = this._getTime() - this._start;

  this.emit('end', elapsed);
  return elapsed;
};

Stopwatch.prototype._getTime = function () {
  if (!process.hrtime) {
    return Date.now();
  }

  var hrtime = process.hrtime();
  return hrtime[0] * 1000 + hrtime[1] / (1000 * 1000);
};

module.exports = Stopwatch;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(1);
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  module.exports = __webpack_require__(19);
}


/***/ }),
/* 19 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Histogram = __webpack_require__(11);
var Meter     = __webpack_require__(15);
var Stopwatch = __webpack_require__(17);

function Timer(properties) {
  properties = properties || {};

  this._meter     = properties.meter || new Meter();
  this._histogram = properties.histogram || new Histogram();
  this._getTime   = properties.getTime;
}

Timer.prototype.start = function () {
  var self  = this;
  var watch = new Stopwatch({getTime: this._getTime});

  watch.once('end', function (elapsed) {
    self.update(elapsed);
  });

  return watch;
};

Timer.prototype.update = function (value) {
  this._meter.mark();
  this._histogram.update(value);
};


Timer.prototype.reset = function () {
  this._meter.reset();
  this._histogram.reset();
};

Timer.prototype.end = function () {
  this._meter.end();
};

Timer.prototype.ref = function () {
  this._meter.ref();
};

Timer.prototype.unref = function () {
  this._meter.unref();
};

Timer.prototype.toJSON = function () {
  return {
    meter : this._meter.toJSON(),
    histogram : this._histogram.toJSON()
  };
};

module.exports = Timer;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.units      = __webpack_require__(14);
exports.BinaryHeap = __webpack_require__(13);
exports.Stopwatch  = __webpack_require__(17);
exports.ExponentiallyDecayingSample
  = __webpack_require__(12);
exports.ExponentiallyMovingWeightedAverage
  = __webpack_require__(16);


/***/ }),
/* 23 */
/***/ (function(module, exports) {


// This file will be bundled by webpack, and webpack tries to bundle
// all require statements, but we need to require this at runtime.
// To work around this, webpack aliases the real `require` to
// `__not_webpack_require__`
var nativeStats = require('./heroku-nodejs-plugin.node');
exports.sense = nativeStats.sense;
exports.start = nativeStats.start;
exports.stop = nativeStats.stop;


/***/ })
/******/ ]);