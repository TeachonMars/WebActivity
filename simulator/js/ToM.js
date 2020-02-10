var ToM =
/******/ (function(modules) { // webpackBootstrap
/******/   // The module cache
/******/   var installedModules = {};
/******/
/******/   // The require function
/******/   function __webpack_require__(moduleId) {
/******/
/******/     // Check if module is in cache
/******/     if(installedModules[moduleId]) {
/******/       return installedModules[moduleId].exports;
/******/     }
/******/     // Create a new module (and put it into the cache)
/******/     var module = installedModules[moduleId] = {
/******/       i: moduleId,
/******/       l: false,
/******/       exports: {}
/******/     };
/******/
/******/     // Execute the module function
/******/     modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/     // Flag the module as loaded
/******/     module.l = true;
/******/
/******/     // Return the exports of the module
/******/     return module.exports;
/******/   }
/******/
/******/
/******/   // expose the modules object (__webpack_modules__)
/******/   __webpack_require__.m = modules;
/******/
/******/   // expose the module cache
/******/   __webpack_require__.c = installedModules;
/******/
/******/   // define getter function for harmony exports
/******/   __webpack_require__.d = function(exports, name, getter) {
/******/     if(!__webpack_require__.o(exports, name)) {
/******/       Object.defineProperty(exports, name, {
/******/         configurable: false,
/******/         enumerable: true,
/******/         get: getter
/******/       });
/******/     }
/******/   };
/******/
/******/   // getDefaultExport function for compatibility with non-harmony modules
/******/   __webpack_require__.n = function(module) {
/******/     var getter = module && module.__esModule ?
/******/       function getDefault() { return module['default']; } :
/******/       function getModuleExports() { return module; };
/******/     __webpack_require__.d(getter, 'a', getter);
/******/     return getter;
/******/   };
/******/
/******/   // Object.prototype.hasOwnProperty.call
/******/   __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/   // __webpack_public_path__
/******/   __webpack_require__.p = "";
/******/
/******/   // Load entry module and return exports
/******/   return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _promisePolyfill = __webpack_require__(8);

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var iosBridge = null,
    androidBridge = null,
    webBridge = null,
    promises = null;

function _initInterface() {
  console.log('interface.initInterface');
  iosBridge = window.iosInterface || null;
  androidBridge = window.AndroidInterface || null;
  webBridge = window.webInterface && window.webInterface.bridge || null;
  if (iosBridge) {
    promises = {};
    console.log('iosBridge initiated', iosBridge);
  }
  if (androidBridge) {
    console.log('androidBridge initiated', androidBridge);
  }
  if (webBridge) {
    console.log('webBridge initiated', webBridge);
  }
}

_initInterface();

function ucFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function sendToIos(lib, method) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  console.log('interface.sendToIos', lib, method, params);
  // Remove this ugly hack
  if (iosBridge[lib]) {
    if (method === 'get' && params.key && iosBridge[lib][params.key] !== undefined) {
      return iosBridge[lib][params.key];
    }
    if (method === 'getAll') {
      return iosBridge[lib];
    }
    if (method === 'set' && params.key && params.value !== undefined) {
      makeCall();
      return iosBridge[lib][params.key] = params.value;
    }
    if (method === 'init' || method === 'close' || method === 'send') {
      makeCall();
      console.log('interface.sendToIos returning true as async not working for scorm');
      return true;
    }
  }

  function makeCall() {
    return new _promisePolyfill2.default(function (resolve, reject) {
      var d = new Date().getTime();
      var promiseId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
      });
      promises[promiseId] = { resolve: resolve, reject: reject };
      try {
        var libCall = window.webkit.messageHandlers[lib];
        console.log('Sending ' + lib + ' / ' + method + ' to iOS with params: ', params);
        libCall.postMessage({
          'promiseId': promiseId,
          'method': method,
          'params': params
        });
      } catch (err) {
        console.log('Error while sending data to iOS ', err);
      }
    }).then(function (res) {
      var result = null;
      if ((typeof res === 'undefined' ? 'undefined' : _typeof(res)) === 'object') {
        result = res.result || null;
      } else {
        result = JSON.parse(res);
        result = result.result;
      }
      console.log('Received response from iOS: ', result);
      return result;
    }).catch(function (err) {
      console.log('An error occurred while retrieving data from iOS: ', err);
    });
  }

  return makeCall();
}

function sendToAndroid(lib, method) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var async = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  console.log('interface.sendToAndroid', lib, method, params, async);
  var res = null;
  try {
    var libCall = window['AndroidInterface' + ucFirst(lib)];
    if (!params) {
      console.log('Sending ' + lib + ' / ' + method + ' to android');
      res = libCall && libCall[method]();
    } else {
      console.log('Sending ' + lib + ' / ' + method + ' to android with params: ', params);
      res = libCall && libCall[method](JSON.stringify(params));
    }
    res = JSON.parse(res);
    console.log('Received response from android: ', res);
  } catch (err) {
    console.log('An error occurred while retrieving data from android: ', err);
  }
  if (async) {
    return new _promisePolyfill2.default(function (resolve, reject) {
      if (res !== undefined && res !== null) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  } else {
    return res;
  }
}

function sendToWeb(lib, method) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var async = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  console.log('interface.sendToWeb', lib, method, params, async);
  var res = null;
  console.log('Sending ' + lib + ' / ' + method + ' to web angular with params: ', params);
  try {
    res = webBridge(lib, method, params);
    console.log('Received response from web: ', res);
  } catch (err) {
    console.log('An error occurred while retrieving data from web: ', err);
  }
  if (async) {
    return new _promisePolyfill2.default(function (resolve, reject) {
      if (res !== undefined && res !== null) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  } else {
    return res;
  }
}

function send(lib, method) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var async = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  console.log('interface.send', lib, method, params, async);
  if (iosBridge && window.webkit && window.webkit.messageHandlers) {
    return sendToIos(lib, method, params, async);
  }
  if (androidBridge) {
    return sendToAndroid(lib, method, params, async);
  }
  if (webBridge) {
    return sendToWeb(lib, method, params, async);
  }
  return null;
}

var TomInterface = function () {
  function TomInterface() {
    _classCallCheck(this, TomInterface);
  }

  _createClass(TomInterface, [{
    key: 'initInterface',
    value: function initInterface() {
      _initInterface();
    }
  }, {
    key: 'setVar',
    value: function setVar(lib) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      console.log('interface.setVar', lib, params);
      var res = send(lib, 'set', params);
      if (res && res.value !== undefined) {
        return res.value;
      } else {
        return res;
      }
    }
  }, {
    key: 'getVar',
    value: function getVar(lib) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      console.log('interface.getVar', lib, params);
      var res = send(lib, 'get', params);
      if (res && res.value !== undefined) {
        return res.value;
      } else {
        return res;
      }
    }
  }, {
    key: 'getAllVar',
    value: function getAllVar(lib) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      console.log('interface.getAllVar', lib, params);
      return send(lib, 'getAll', params);
    }
  }, {
    key: 'get',
    value: function get(lib, type) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var async = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      console.log('interface.get', lib, type, params, async);
      return send(lib, 'get' + ucFirst(type), params, async);
    }
  }, {
    key: 'display',
    value: function display(lib, type) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var async = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      console.log('interface.display', lib, type, params, async);
      return send(lib, 'display' + ucFirst(type), params, async);
    }
  }, {
    key: 'call',
    value: function call(lib, method) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var async = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      console.log('interface.call', lib, method, params, async);
      return send(lib, method, params, async);
    }
  }, {
    key: 'resolveIOSPromise',
    value: function resolveIOSPromise(promiseId, data, error) {
      console.log('interface.resolveIOSPromise', promiseId, data, error);
      if (promises[promiseId]) {
        if (error) {
          promises[promiseId].reject(data);
        } else {
          promises[promiseId].resolve(data);
        }
        // remove reference to stored promise
        delete promises[promiseId];
      } else {
        console.log('Promise with id ' + promiseId + ' was not found in promises! (may be do to a page reload)');
      }
    }
  }]);

  return TomInterface;
}();

module.exports = new TomInterface();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tom_interface = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lib = 'data';

var Data = function () {
  function Data() {
    _classCallCheck(this, Data);
  }

  _createClass(Data, [{
    key: 'init',
    value: function init() {
      console.log('data.init');
      return (0, _tom_interface.call)(_lib, 'init', null, false);
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      console.log('data.set', key, value);
      return (0, _tom_interface.setVar)(_lib, { key: key, value: value });
    }
  }, {
    key: 'get',
    value: function get(key) {
      console.log('data.get', key);
      return (0, _tom_interface.getVar)(_lib, { key: key });
    }
  }, {
    key: 'send',
    value: function send() {
      console.log('data.send');
      return (0, _tom_interface.call)(_lib, 'send', null, false);
    }
  }]);

  return Data;
}();

exports.default = Data;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
  return this;
})();

try {
  // This works if eval is allowed (see CSP)
  g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
  // This works if the window reference is available
  if(typeof window === "object")
    g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tom_interface = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lib = 'appContent';

var AppContent = function () {
  function AppContent() {
    _classCallCheck(this, AppContent);
  }

  _createClass(AppContent, [{
    key: 'getFeaturedCommunications',


    // COMMUNICATIONS
    value: function getFeaturedCommunications() {
      console.log('appContent.getFeaturedCommunications');
      return (0, _tom_interface.get)(_lib, 'featuredCommunications');
    }
  }, {
    key: 'getCommunications',
    value: function getCommunications(page, pageSize) {
      console.log('appContent.getCommunications', page, pageSize);
      return (0, _tom_interface.get)(_lib, 'communications', { page: page || 1, pageSize: pageSize || 10 });
    }
  }, {
    key: 'getCommunication',
    value: function getCommunication(communicationId) {
      console.log('appContent.getCommunication', communicationId);
      return (0, _tom_interface.get)(_lib, 'communication', { id: communicationId });
    }

    // TRAININGS

  }, {
    key: 'getTrainingCourses',
    value: function getTrainingCourses() {
      console.log('appContent.getTrainingCourses');
      return (0, _tom_interface.get)(_lib, 'trainingCourses');
    }
  }, {
    key: 'getTrainingCourse',
    value: function getTrainingCourse(trainingId) {
      console.log('appContent.getTrainingCourse', trainingId);
      return (0, _tom_interface.get)(_lib, 'trainingCourse', { id: trainingId });
    }
  }, {
    key: 'getTrainingCoursesForLearner',
    value: function getTrainingCoursesForLearner() {
      console.log('appContent.getTrainingCoursesForLearner');
      return (0, _tom_interface.get)(_lib, 'trainingCoursesForLearner');
    }
  }, {
    key: 'getTrainingCoursesForCategory',
    value: function getTrainingCoursesForCategory(categoryId) {
      console.log('appContent.getTrainingCoursesForCategory', categoryId);
      return (0, _tom_interface.get)(_lib, 'trainingCoursesForCategory', { id: categoryId });
    }

    // CATEGORIES

  }, {
    key: 'getCategories',
    value: function getCategories() {
      console.log('appContent.getCategories');
      return (0, _tom_interface.get)(_lib, 'categories');
    }
  }, {
    key: 'getCategory',
    value: function getCategory(categoryId) {
      console.log('appContent.getCategory', categoryId);
      return (0, _tom_interface.get)(_lib, 'category', { id: categoryId });
    }
  }]);

  return AppContent;
}();

exports.default = AppContent;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tom_interface = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lib = 'navigation';

var Navigation = function () {
  function Navigation() {
    _classCallCheck(this, Navigation);
  }

  _createClass(Navigation, [{
    key: 'displayTrainingCourse',
    value: function displayTrainingCourse(trainingId) {
      console.log('navigation.displayTrainingCourse', trainingId);
      return (0, _tom_interface.display)(_lib, 'trainingCourse', { id: trainingId });
    }
  }, {
    key: 'displayCategory',
    value: function displayCategory(categoryId) {
      console.log('navigation.displayCategory', categoryId);
      return (0, _tom_interface.display)(_lib, 'category', { id: categoryId });
    }
  }, {
    key: 'displayCommunication',
    value: function displayCommunication(communicationId) {
      console.log('navigation.displayCommunication', communicationId);
      return (0, _tom_interface.display)(_lib, 'communication', { id: communicationId });
    }
  }, {
    key: 'displayWall',
    value: function displayWall() {
      console.log('navigation.displayWall');
      return (0, _tom_interface.display)(_lib, 'wall');
    }
  }, {
    key: 'displayCatalog',
    value: function displayCatalog() {
      console.log('navigation.displayCatalog');
      return (0, _tom_interface.display)(_lib, 'catalog');
    }
  }, {
    key: 'displaySearch',
    value: function displaySearch(query) {
      console.log('navigation.displaySearch');
      return (0, _tom_interface.display)(_lib, 'search', { query: query || null });
    }
  }, {
    key: 'displayProfile',
    value: function displayProfile() {
      console.log('navigation.displayProfile');
      return (0, _tom_interface.display)(_lib, 'profile');
    }
  }, {
    key: 'displayApps',
    value: function displayApps() {
      console.log('navigation.displayApps');
      return (0, _tom_interface.display)(_lib, 'apps');
    }
  }]);

  return Navigation;
}();

exports.default = Navigation;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tom_interface = __webpack_require__(0);

__webpack_require__(14);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lib = 'utils';

var event = new CustomEvent('beforeunload');
event.initCustomEvent('beforeunload', true, true, undefined);

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, [{
    key: 'enableWakeLock',
    value: function enableWakeLock() {
      console.log('utils.enableWakeLock');
      return (0, _tom_interface.call)(_lib, 'enableWakeLock');
    }
  }, {
    key: 'disableWakeLock',
    value: function disableWakeLock() {
      console.log('utils.disableWakeLock');
      return (0, _tom_interface.call)(_lib, 'disableWakeLock');
    }
  }, {
    key: 'isSandbox',
    value: function isSandbox() {
      console.log('utils.isSandbox');
      return (0, _tom_interface.call)(_lib, 'isSandbox');
    }
  }, {
    key: 'close',
    value: function close() {
      console.log('utils.close');
      return (0, _tom_interface.call)(_lib, 'close');
    }
  }, {
    key: 'notifyWebViewClosing',
    value: function notifyWebViewClosing(currentWindow) {
      console.log('utils.notifyWebViewClosing', currentWindow);
      currentWindow = currentWindow || window.top;
      currentWindow.dispatchEvent(event);
      for (var i = 0; i < currentWindow.frames.length; i++) {
        if (currentWindow.frames[i] !== currentWindow) {
          this.notifyWebViewClosing(currentWindow.frames[i]);
        }
      }
    }
  }, {
    key: 'resolveIOSPromise',
    value: function resolveIOSPromise(promiseId, data, error) {
      console.log('utils.resolveIOSPromise', promiseId, data, error);
      (0, _tom_interface.resolveIOSPromise)(promiseId, data, error);
    }
  }]);

  return Utils;
}();

exports.default = Utils;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tom_interface = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lib = 'env';

var Env = function () {
  function Env() {
    _classCallCheck(this, Env);
  }

  _createClass(Env, [{
    key: 'getAll',
    value: function getAll() {
      console.log('env.getAll');
      return (0, _tom_interface.getAllVar)(_lib);
    }
  }, {
    key: 'get',
    value: function get(name) {
      console.log('env.get', name);
      return (0, _tom_interface.getVar)(_lib, { key: name });
    }
  }]);

  return Env;
}();

exports.default = Env;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _data = __webpack_require__(1);

var _data2 = _interopRequireDefault(_data);

var _home = __webpack_require__(12);

var _home2 = _interopRequireDefault(_home);

var _callback = __webpack_require__(13);

var _callback2 = _interopRequireDefault(_callback);

var _utils = __webpack_require__(5);

var _utils2 = _interopRequireDefault(_utils);

var _params = __webpack_require__(15);

var _params2 = _interopRequireDefault(_params);

var _env = __webpack_require__(6);

var _env2 = _interopRequireDefault(_env);

var _appContent = __webpack_require__(3);

var _appContent2 = _interopRequireDefault(_appContent);

var _navigation = __webpack_require__(4);

var _navigation2 = _interopRequireDefault(_navigation);

var _learner = __webpack_require__(16);

var _learner2 = _interopRequireDefault(_learner);

var _appUtils = __webpack_require__(17);

var _appUtils2 = _interopRequireDefault(_appUtils);

var _scorm_adapter = __webpack_require__(18);

var _tom_interface = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = '1.2.1';
module.exports = {
  version: version,
  initInterface: _tom_interface.initInterface,
  initScorm: initScorm,
  data: new _data2.default(),
  home: new _home2.default(),
  callback: new _callback2.default(),
  utils: new _utils2.default(),
  params: new _params2.default(),
  env: new _env2.default(),
  appContent: new _appContent2.default(),
  navigation: new _navigation2.default(),
  learner: new _learner2.default(),
  appUtils: new _appUtils2.default()
};

function initScorm(scormEnabled) {
  if (scormEnabled || window.webInterface && window.webInterface.scormEnabled || window.iosInterface && window.iosInterface.scormEnabled || window.AndroidInterface && window.AndroidInterface.scormEnabled()) {
    window.API = _scorm_adapter.ScormAPI12;
    window.API_1484_11 = _scorm_adapter.ScormAPI2004;
  }
}

initScorm();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    return new Promise(function (resolve, reject) {
      if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).setImmediate))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(10);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(11)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tom_interface = __webpack_require__(0);

var _appContent = __webpack_require__(3);

var _appContent2 = _interopRequireDefault(_appContent);

var _navigation = __webpack_require__(4);

var _navigation2 = _interopRequireDefault(_navigation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lib = 'home';

var appComponent = new _appContent2.default();
var navigation = new _navigation2.default();

var Home = function () {
  function Home() {
    _classCallCheck(this, Home);
  }

  _createClass(Home, [{
    key: 'getCategories',
    value: function getCategories() {
      console.warn('ToM.home.getCategories is deprecated, please use ToM.appContent.getCategories() instead');
      return appComponent.getCategories();
    }
  }, {
    key: 'displayCategory',
    value: function displayCategory(categoryId) {
      console.warn('ToM.home.displayCategory is deprecated, please use ToM.navigation.displayCategory() instead');
      return navigation.displayCategory(categoryId);
    }
  }, {
    key: 'getCategory',
    value: function getCategory(categoryId) {
      console.warn('ToM.home.getCategory is deprecated, please use ToM.appContent.getCategory() instead');
      return appComponent.getCategory(categoryId);
    }
  }, {
    key: 'isShakeAndLearnPossible',
    value: function isShakeAndLearnPossible() {
      console.log('home.isShakeAndLearnPossible');
      return (0, _tom_interface.call)(_lib, 'isShakeAndLearnPossible');
    }
  }, {
    key: 'shakeAndLearn',
    value: function shakeAndLearn() {
      console.log('home.shakeAndLearn');
      return (0, _tom_interface.call)(_lib, 'shakeAndLearn');
    }
  }, {
    key: 'beforeHomeDisplayed',
    value: function beforeHomeDisplayed() {
      console.log('home.beforeHomeDisplayed');
      return window.ToM.callback.beforeHomeDisplayed();
    }
  }, {
    key: 'beforeAppBackground',
    value: function beforeAppBackground() {
      console.log('home.beforeAppBackground');
      return window.ToM.callback.beforeAppBackground();
    }
  }, {
    key: 'beforeAppForeground',
    value: function beforeAppForeground() {
      console.log('home.beforeAppForeground');
      return window.ToM.callback.beforeAppForeground();
    }
  }, {
    key: 'onDataUpdated',
    value: function onDataUpdated(type) {
      console.log('home.onDataUpdated', type);
      return window.ToM.callback.onDataUpdated(type);
    }
  }, {
    key: 'reload',
    value: function reload() {
      console.warn('ToM.home.reload is deprecated, please use ToM.home.beforeHomeDisplayed');
      if (window.reloadData && typeof window.reloadData === 'function') {
        window.reloadData();
      } else {
        return this.beforeHomeDisplayed();
      }
    }
  }]);

  return Home;
}();

exports.default = Home;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lib = 'callback';

var Callback = function () {
  function Callback() {
    _classCallCheck(this, Callback);
  }

  _createClass(Callback, [{
    key: 'beforeHomeDisplayed',
    value: function beforeHomeDisplayed() {
      console.log('Default ToM.callback.beforeHomeDisplayed implementation called');
    }
  }, {
    key: 'beforeAppBackground',
    value: function beforeAppBackground() {
      console.log('Default ToM.callback.beforeAppBackground implementation called');
    }
  }, {
    key: 'beforeAppForeground',
    value: function beforeAppForeground() {
      console.log('Default ToM.callback.beforeAppForeground implementation called');
    }
  }, {
    key: 'onDataUpdated',
    value: function onDataUpdated(type) {
      console.log('Default ToM.callback.onDataUpdated("' + type + '") implementation called');
    }
  }]);

  return Callback;
}();

exports.default = Callback;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

// Polyfill for creating CustomEvents on IE9/10/11

// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

(function() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    var ce = new window.CustomEvent('test', { cancelable: true });
    ce.preventDefault();
    if (ce.defaultPrevented !== true) {
      // IE has problems with .preventDefault() on custom events
      // http://stackoverflow.com/questions/23349191
      throw new Error('Could not prevent default');
    }
  } catch (e) {
    var CustomEvent = function(event, params) {
      var evt, origPrevent;
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(
        event,
        params.bubbles,
        params.cancelable,
        params.detail
      );
      origPrevent = evt.preventDefault;
      evt.preventDefault = function() {
        origPrevent.call(this);
        try {
          Object.defineProperty(this, 'defaultPrevented', {
            get: function() {
              return true;
            }
          });
        } catch (e) {
          this.defaultPrevented = true;
        }
      };
      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent; // expose definition to window
  }
})();


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tom_interface = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lib = 'params';

var Params = function () {
  function Params() {
    _classCallCheck(this, Params);
  }

  _createClass(Params, [{
    key: 'getAll',
    value: function getAll() {
      console.log('params.getAll');
      return (0, _tom_interface.getAllVar)(_lib);
    }
  }, {
    key: 'get',
    value: function get(name) {
      console.log('params.get', name);
      return (0, _tom_interface.getVar)(_lib, { key: name });
    }
  }]);

  return Params;
}();

exports.default = Params;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tom_interface = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lib = 'learner';

var Learner = function () {
  function Learner() {
    _classCallCheck(this, Learner);
  }

  _createClass(Learner, [{
    key: 'getProfile',
    value: function getProfile() {
      console.log('learner.getProfile');
      return (0, _tom_interface.get)(_lib, 'profile');
    }
  }]);

  return Learner;
}();

exports.default = Learner;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tom_interface = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lib = 'appUtils';

var AppUtils = function () {
  function AppUtils() {
    _classCallCheck(this, AppUtils);
  }

  _createClass(AppUtils, [{
    key: 'showTrainingCourseEnrollment',
    value: function showTrainingCourseEnrollment() {
      console.log('appUtils.showTrainingCourseEnrollment');
      return (0, _tom_interface.call)(_lib, 'showTrainingCourseEnrollment');
    }
  }, {
    key: 'logout',
    value: function logout() {
      console.log('appUtils.logout');
      return (0, _tom_interface.call)(_lib, 'logout');
    }
  }]);

  return AppUtils;
}();

exports.default = AppUtils;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScormAPI12 = exports.ScormAPI2004 = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = __webpack_require__(1);

var _data2 = _interopRequireDefault(_data);

var _utils = __webpack_require__(5);

var _utils2 = _interopRequireDefault(_utils);

var _env = __webpack_require__(6);

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var data = new _data2.default();
var utils = new _utils2.default();
var env = new _env2.default();

var mapping = {
  'ScormAPI2004': {
    'methods': {
      'Initialize': 'initialize',
      'Terminate': 'terminate',
      'GetValue': 'get',
      'SetValue': 'set',
      'Commit': 'commit',
      'GetLastError': 'getLastError',
      'GetErrorString': 'getErrorString',
      'GetDiagnostic': 'getDiagnostic'
    },
    'dataModel': {
      'cmi.learner_id': 'learnerId',
      'cmi.learner_name': 'learnerName',
      'cmi.learner_preference.language': 'learnerLang',
      'cmi.core.entry': 'entry',
      'cmi.total_time': 'totalTime',
      'cmi.session_time': 'sessionTime',
      'cmi.progress_measure': 'progress',
      'cmi.success_status': 'success',
      'cmi.completion_status': 'completion',
      'cmi.score.min': 'scoreMin',
      'cmi.score.max': 'scoreMax',
      'cmi.score.raw': 'scoreRaw',
      'cmi.score.scaled': 'scoreScaled',
      'cmi.location': 'location',
      'cmi.mode': 'mode',
      'cmi.exit': 'exit',
      'cmi.suspend_data': 'suspendData',
      'adl.nav.request': 'adlNavRequest',
      'tom.data.session_points': 'sessionPoint',
      'tom.data.total_points': 'totalPoint'
    },
    'error': {
      0: 'No Error',
      101: 'General Exception',
      201: 'Invalid argument error',
      202: 'Element cannot have children',
      203: 'Element not an array. Cannot have count.',
      301: 'Not initialized',
      401: 'Not implemented error',
      402: 'Invalid set value, element is a keyword',
      403: 'Element is read only',
      404: 'Element is write only',
      405: 'Incorrect Data Type'
    }
  },
  'ScormAPI12': {
    'methods': {
      'LMSInitialize': 'initialize',
      'LMSFinish': 'terminate',
      'LMSGetValue': 'get',
      'LMSSetValue': 'set',
      'LMSCommit': 'commit',
      'LMSGetLastError': 'getLastError',
      'LMSGetErrorString': 'getErrorString',
      'LMSGetDiagnostic': 'getDiagnostic'
    },
    'dataModel': {
      'cmi.core.student_id': 'learnerId',
      'cmi.core.student_name': 'learnerName',
      'cmi.student_preference.language': 'learnerLang',
      'cmi.core.entry': 'entry',
      'cmi.core.total_time': 'totalTime',
      'cmi.core.session_time': 'sessionTime',
      'cmi.core.lesson_status': 'success',
      'cmi.core.score.min': 'scoreMin',
      'cmi.core.score.max': 'scoreMax',
      'cmi.core.score.raw': 'scoreRaw',
      'cmi.core.lesson_location': 'location',
      'cmi.core.lesson_mode': 'mode',
      'cmi.core.exit': 'exit',
      'cmi.suspend_data': 'suspendData',
      'tom.data.session_points': 'sessionPoint',
      'tom.data.total_points': 'totalPoint'
    },
    'error': {
      0: 'No Error',
      101: 'General Exception',
      201: 'Invalid argument error',
      202: 'Element cannot have children',
      203: 'Element not an array. Cannot have count.',
      301: 'Not initialized',
      401: 'Not implemented error',
      402: 'Invalid set value, element is a keyword',
      403: 'Element is read only',
      404: 'Element is write only',
      405: 'Incorrect Data Type'
    }
  }
};

function getKeyByValue(object, value) {
  return Object.keys(object).find(function (key) {
    return object[key] === value;
  });
}

function convertSecondsToScorm2004Time(time) {
  var resultTime = 'P';
  var years = Math.floor(time / 31536000),
      months = Math.floor(time % 31536000 / 2592000),
      days = Math.floor(time % 31536000 % 2592000 / 86400),
      hours = Math.floor(time % 31536000 % 2592000 % 86400 / 3600),
      minutes = Math.floor(time % 31536000 % 2592000 % 86400 % 3600 / 60),
      seconds = time % 31536000 % 2592000 % 86400 % 3600 % 60;
  resultTime += years ? years + 'Y' : '';
  resultTime += months ? months + 'M' : '';
  resultTime += days ? days + 'DT' : 'T';
  resultTime += hours ? hours + 'H' : '';
  resultTime += minutes ? minutes + 'M' : '';
  resultTime += seconds ? seconds + '.00S' : '';
  return resultTime;
}

function convertScorm2004TimeToSeconds(time) {
  var regex = /^P(?=\w*\d)(?:(\d+)Y|Y)?(?:(\d+)M|M)?(?:(\d+)D|D)?(?:T(?:(\d+)H|H)?(?:(\d+)M|M)?(?:(\d+)(?:\.\d{1,2})?S|S)?)?$/;
  var m = void 0;
  var resultTime = 0;
  if ((m = regex.exec(time)) !== null) {
    resultTime += m[1] ? parseInt(m[1] * 31536000) : parseInt(0); // years (365 days)
    resultTime += m[2] ? parseInt(m[2] * 2592000) : parseInt(0); // months (30 days)
    resultTime += m[3] ? parseInt(m[3] * 86400) : parseInt(0); // days
    resultTime += m[4] ? parseInt(m[4] * 3600) : parseInt(0); // hours
    resultTime += m[5] ? parseInt(m[5] * 60) : parseInt(0); // minutes
    resultTime += m[6] ? parseInt(m[6]) : parseInt(0); // seconds
  }
  return resultTime;
}

function convertSecondsToScorm12Time(time) {
  var resultTime = 'P';
  var hours = Math.floor(time / 3600),
      minutes = Math.floor(time % 3600 / 60),
      seconds = time % 3600 % 60;
  resultTime += hours ? hours + ':' : '0000:';
  resultTime += minutes ? minutes + ':' : '00:';
  resultTime += seconds ? seconds : '00';
  return resultTime;
}

function convertScorm12TimeToSeconds(time) {
  var timeSplitted = time.split(':');
  var resultTime = 0;
  resultTime += timeSplitted[0] ? parseInt(timeSplitted[0] * 3600) : parseInt(0); // hours
  resultTime += timeSplitted[1] ? parseInt(timeSplitted[1] * 60) : parseInt(0); // minutes
  resultTime += timeSplitted[2] ? parseInt(timeSplitted[2]) : parseInt(0); // seconds
  return resultTime;
}

var _initialized = false,
    _finished = false,
    _lastErrorCode = 0,
    _lastErrorString = 'No Error';

var ScormAPI = function () {
  function ScormAPI() {
    _classCallCheck(this, ScormAPI);
  }

  _createClass(ScormAPI, [{
    key: 'initialize',
    value: function initialize(scormVersion) {
      console.log('ScormAPI.initialize', scormVersion);
      _initialized = true;
      _finished = false;
      return data.init() ? 'true' : 'false';
    }
  }, {
    key: 'terminate',
    value: function terminate(scormVersion) {
      console.log('ScormAPI.terminate', scormVersion);
      _initialized = false;
      _finished = true;
      data.send();
      return utils.close() ? 'true' : 'false';
    }
  }, {
    key: 'get',
    value: function get(scormVersion, key) {
      console.log('ScormAPI.get', scormVersion, key);
      // not initialized or already finished
      if (!_initialized || _finished) {
        _lastErrorCode = 301;
        return '';
      }
      var dataModelMapping = mapping[scormVersion].dataModel;
      if (dataModelMapping.hasOwnProperty(key)) {
        var mappedDataModel = dataModelMapping[key];
        _lastErrorCode = 0;
        _lastErrorString = 'No Error';
        var progress = 0,
            location = '',
            success = 0,
            score = 0;
        switch (mappedDataModel) {
          case null:
            _lastErrorCode = 401;
            _lastErrorString = 'Not implemented error';
            return '';

          case 'learnerId':
            return env.get('LEARNER_ID');

          case 'learnerName':
            return env.get('LAST_NAME') + ', ' + env.get('FIRST_NAME');

          case 'learnerLang':
            return env.get('LANGUAGE');

          case 'totalPoint':
            return data.get('totalPoints') || 0;

          case 'totalTime':
            var totalTime = data.get('totalTime') || 0;
            if (scormVersion === 'ScormAPI2004') {
              return convertSecondsToScorm2004Time(totalTime);
            } else if (scormVersion === 'ScormAPI12') {
              return convertSecondsToScorm12Time(totalTime);
            } else {
              return 0;
            }

          case 'progress':
            progress = data.get('progress');
            return progress ? (parseFloat(progress) / 100).toFixed(7) : 0;

          case 'success':
            progress = data.get('progress');
            success = data.get('success');
            if (progress === 100) {
              return success === true ? 'passed' : 'failed';
            } else {
              return 'unknown';
            }

          case 'completion':
            progress = data.get('progress');
            if (progress === 100) {
              return 'completed';
            } else if (progress === 0) {
              return 'not attempted';
            } else {
              return 'incomplete';
            }

          case 'scoreMin':
            console.error('scoreMin not implemented yet, default value returned: 0');
            return parseFloat('0').toFixed(7);

          case 'scoreMax':
            console.error('scoreMin not implemented yet, default value returned: 100');
            return parseFloat('100').toFixed(7);

          case 'scoreRaw':
            score = data.get('score');
            return score ? parseFloat(score).toFixed(7) : 0;

          case 'scoreScaled':
            score = data.get('score');
            return score ? (parseFloat(score) / 100).toFixed(7) : 0;

          case 'location':
            location = data.get('location');
            return location ? location : '';

          case 'mode':
            return 'normal'; //“browse”, “normal”, “review”

          case 'suspendData':
            return data.get('suspendData');

          case 'entry':
            var nbSessions = data.get('sessionsCount');
            if (nbSessions && nbSessions > 0) {
              return 'resume';
            } else {
              if (scormVersion === 'ScormAPI12') {
                return 'ab-initio';
              } else {
                return 'ab_initio';
              }
            }

          default:
            _lastErrorCode = 405;
            _lastErrorString = 'Data Model ' + getKeyByValue(dataModelMapping, mappedDataModel) + ' is Write Only';
            console.error('Data Model Element Is Write Only (405)');
            return '';
        }
      } else {
        _lastErrorCode = 201;
        _lastErrorString = 'Invalid argument error';
        console.error('property ' + key + ' not supported');
        return '';
      }
    }
  }, {
    key: 'set',
    value: function set(scormVersion, key, value) {
      console.log('ScormAPI.set', scormVersion, key, value);
      var dataModelMapping = mapping[scormVersion].dataModel;
      if (!_initialized || _finished) {
        _lastErrorCode = 301;
        return 'false';
      }
      if (dataModelMapping.hasOwnProperty(key)) {
        var mappedDataModel = dataModelMapping[key];
        _lastErrorCode = 0;
        _lastErrorString = 'No Error';
        var res = null;
        switch (mappedDataModel) {
          case null:
            _lastErrorCode = 401;
            _lastErrorString = 'Not implemented error';
            return 'false';

          // case 'learnerLang':
          //  return utils.getEnv('LANG');

          case 'sessionTime':
            if (scormVersion === 'ScormAPI2004') {
              res = data.set('time', convertScorm2004TimeToSeconds(value));
            } else if (scormVersion === 'ScormAPI12') {
              res = data.set('time', convertScorm12TimeToSeconds(value));
            } else {
              res = 0;
            }
            break;

          case 'sessionPoint':
            res = data.set('points', value);
            break;

          case 'progress':
            res = data.set('progress', value * 100);
            break;

          case 'success':
            var success = false;
            if (value === 'passed' || value === 'completed') {
              success = true;
              data.set('progress', 100);
            } else if (value === 'failed') {
              data.set('progress', 100);
            }
            res = data.set('success', success);
            break;

          case 'completion':
            var progress = 0;
            if (value === 'completed') {
              progress = 100;
            }
            res = data.set('progress', progress);
            break;

          case 'scoreMin':
            console.error('scoreMin not implemented yet, default value setted: 0');
            res = parseFloat('0').toFixed(7);
            break;

          case 'scoreMax':
            console.error('scoreMin not implemented yet, default value setted: 100');
            res = parseFloat('100').toFixed(7);
            break;

          case 'scoreRaw':
            res = data.set('score', value);
            break;

          case 'scoreScaled':
            res = data.set('score', value * 100);
            break;

          case 'exit':
            res = data.set('exit', value);
            break;

          case 'adlNavRequest':
            switch (value) {
              case 'suspend':
              case 'suspendAll':
                data.set('exit', 'suspend');
                break;

              case 'exitAll':
              case 'exit':
              default:
                data.set('exit', 'normal');
                break;
            }

            data.send();
            res = utils.close();
            break;

          case 'suspendData':
            res = data.set('suspendData', value);
            break;

          case 'location':
            res = data.set('location', value);
            break;

          default:
            _lastErrorCode = 404;
            _lastErrorString = 'Data Model ' + getKeyByValue(dataModelMapping, mappedDataModel) + ' is Read Only';
            console.error('Data Model Element Is Read Only (404)');
            return 'false';
        }

        if (res !== undefined && res !== null) {
          return 'true';
        } else {
          return 'false';
        }
      } else {
        _lastErrorCode = 201;
        _lastErrorString = 'Invalid argument error';
        console.error('property ' + key + ' not supported');
        return 'false';
      }
    }
  }, {
    key: 'commit',
    value: function commit(scormVersion) {
      console.log('ScormAPI.commit', scormVersion);
      return 'true';
    }
  }, {
    key: 'getLastError',
    value: function getLastError(scormVersion) {
      console.log('ScormAPI.getLastError', scormVersion);
      return _lastErrorCode;
    }
  }, {
    key: 'getErrorString',
    value: function getErrorString(scormVersion, errorCode) {
      console.log('ScormAPI.getErrorString', scormVersion, errorCode);
      var errorMapping = mapping[scormVersion].error;
      return errorMapping[errorCode];
    }
  }, {
    key: 'getDiagnostic',
    value: function getDiagnostic(scormVersion, errorCode) {
      console.log('ScormAPI.GetDiagnostic', scormVersion, errorCode);
      return _lastErrorString;
    }
  }]);

  return ScormAPI;
}();

var scorm = new ScormAPI();

var ScormAPI2004 = {
  Initialize: function Initialize() {
    return scorm.initialize('ScormAPI2004', arguments[0], arguments[1]);
  },
  Terminate: function Terminate() {
    return scorm.terminate('ScormAPI2004', arguments[0], arguments[1]);
  },
  GetValue: function GetValue() {
    return scorm.get('ScormAPI2004', arguments[0], arguments[1]);
  },
  SetValue: function SetValue() {
    return scorm.set('ScormAPI2004', arguments[0], arguments[1]);
  },
  Commit: function Commit() {
    return scorm.commit('ScormAPI2004', arguments[0], arguments[1]);
  },
  GetLastError: function GetLastError() {
    return scorm.getLastError('ScormAPI2004', arguments[0], arguments[1]);
  },
  GetErrorString: function GetErrorString() {
    return scorm.getErrorString('ScormAPI2004', arguments[0], arguments[1]);
  },
  GetDiagnostic: function GetDiagnostic() {
    return scorm.getDiagnostic('ScormAPI2004', arguments[0], arguments[1]);
  }
};

var ScormAPI12 = {
  LMSInitialize: function LMSInitialize() {
    return scorm.initialize('ScormAPI12', arguments[0], arguments[1]);
  },
  LMSFinish: function LMSFinish() {
    return scorm.terminate('ScormAPI12', arguments[0], arguments[1]);
  },
  LMSGetValue: function LMSGetValue() {
    return scorm.get('ScormAPI12', arguments[0], arguments[1]);
  },
  LMSSetValue: function LMSSetValue() {
    return scorm.set('ScormAPI12', arguments[0], arguments[1]);
  },
  LMSCommit: function LMSCommit() {
    return scorm.commit('ScormAPI12', arguments[0], arguments[1]);
  },
  LMSGetLastError: function LMSGetLastError() {
    return scorm.getLastError('ScormAPI12', arguments[0], arguments[1]);
  },
  LMSGetErrorString: function LMSGetErrorString() {
    return scorm.getErrorString('ScormAPI12', arguments[0], arguments[1]);
  },
  LMSGetDiagnostic: function LMSGetDiagnostic() {
    return scorm.getDiagnostic('ScormAPI12', arguments[0], arguments[1]);
  }
};

exports.ScormAPI2004 = ScormAPI2004;
exports.ScormAPI12 = ScormAPI12;

/***/ })
/******/ ]);
//# sourceMappingURL=ToM.js.map