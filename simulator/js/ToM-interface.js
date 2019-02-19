var jsLibService = initInterface();
window.webInterface =  {
    scormEnabled: true,
    bridge: function (lib, method, params) {
        return jsLibService[method](params);
    }
};

function initInterface() {

    var returnAsPromise = function(ret) {
        return new Promise(function (resolve, reject) {
            return resolve(ret);
        });
    };

    /**
     * CUSTOM HOME
     */

    var getCategories = function() {
        return returnAsPromise([
        ]);
    }

    var getProfile = function() {
        return returnAsPromise(window.learnerProfile);
    }

    var displayScreenFn = function(screen) {
        return function() {
          alert("Navigating to "+screen+" OK");
        }
    }

    var displaySearch = function(params) {
      if (params && params.query) {
        alert("Opening search screen with search query \""+params.query+"\"");
      }
      else {
        alert("Navigating to Search screen OK");
      }
    }

    var shakeAndLearn = function() {
        return function() {
          alert("Launching Shake'n'Learn");
        }
    }

    var isShakeAndLearnPossible = function() {
        return returnAsPromise(true);
    }

    var getFeaturedCommunications = function() {
      return returnAsPromise(window.featuredCommunications);
    }

    var getCommunications = function(params) {
      var pageSize = params.pageSize || 10;
      var page = params.page || 1;
      if (page < 1) {
        page = 1;
      }
      if (pageSize < 1) {
        pageSize = 1;
      }

      var list = _.slice(_.filter(window.communications, function(c) { return !c.featured;}), (page-1)*pageSize, (page*pageSize));
      var ret = {
          "list": list,
          "count": window.communications.length,
          "page": page,
          "pageCount" : Math.ceil(window.communications.length / pageSize),
          "pageSize" : pageSize
      };
      return returnAsPromise(ret);
    }


    var displayCommunication = function(params) {
      var communicationId = params.id;
      var communication = _.head(_.filter(window.communications, {"id": communicationId}));
      if (communication) {
        alert("Navigating to communication \""+communication.title+"\"");
      }
      else {
        alert("Unknown communication \""+communicationId+"\"");
      }
    }


    var getCategories = function() {
      return returnAsPromise(window.categories);
    }

    var getCategory = function(params) {
      var categoryId = params.id;
      return returnAsPromise(_.head(_.filter(window.categories, {"id": categoryId})));
    }

    var displayCategory = function(params) {
      var categoryId = params.id;
      var category = _.head(_.filter(window.categories, {"id": categoryId}));
      if (category) {
        alert("Navigating to category \""+category.title+"\"");
      }
      else {
        alert("Unknown category \""+categoryId+"\"");
      }
    }

    var getTrainingCourse = function(params) {
      var trainingId = params.id;
      return returnAsPromise(_.head(_.filter(window.trainingCourses, {"id": trainingId})));
    }

    var displayTrainingCourse = function(params) {
      var trainingId = params.id;
      var training = _.head(_.filter(window.trainingCourses, {"id": trainingId}));
      if (training) {
        alert("Navigating to training course \""+training.title+"\"");
      }
      else {
        alert("Unknown training course \""+trainingId+"\"");
      }
    }

    var getTrainingCoursesForLearner = function() {
      return returnAsPromise(window.learnerTrainingCourses);
    }

    var getTrainingCoursesForCategory = function(params) {
      var categoryId = params.id;
      var trainings = _.filter(
        window.trainingCourses,
        function(t) {
          return _.indexOf(t.categories, categoryId) > -1;
      });
      return returnAsPromise(trainings);
    }

    var doLogout = function() {
      alert("Did logout successfully!");
    }

    var showTrainingCourseEnrollment = function() {
      alert("Popup for training course enrollment displayed!!");
    }

    /**
     * WEB ACTIVITY
     */

    var disableWakeLock = function() {
      alert("Wake lock is now disabled");
    }

    var enableWakeLock = function() {
      alert("Wake lock is now enabled");
    }

    var isSandbox = function() {
      return false;
    };

    var closeActivity = function() {
      console.log("Closing activity...");
    };

    var initSession = function() {
      window.sessionVars = {};
      window.sessionStarted = Math.floor((new Date().getTime()) / 1000);
      console.log("Session initiated");
    };


    var setVar = function(params) {
      var key = params.key;
      var value = params.value;
      console.log('set var ', params);

      if (!window.sessionVars) {
        console.error("Session not initiated");
        return;
      }

      window.sessionVars[key] = value;
    };

    var getVar = function(params) {
      console.log('get var ', params);
      var key = params.key;
      switch(key) {
        case "LANGUAGE":
          return window.learnerProfile.lang;

        case "time":
        case "points":
        case "score":
        case "progress":
        case "success":
        case "suspendData":
          return window.top.reducedSessions[key];
      }
    };

    var sendSession = function() {
      console.log("Sending session...", window.sessionVars);
      if (!window.sessionVars.time) {
        window.sessionVars.time = Math.floor((new Date().getTime()) / 1000) - window.sessionStarted;
        window.sessionStarted = null;
      }
      window.top.pushSession(window.sessionVars);
      window.sessionVars = null;
    };

    return {
      // ToM.appContent
      getCategories: getCategories,
      getCategory: getCategory,
      getTrainingCoursesForLearner: getTrainingCoursesForLearner,
      getTrainingCoursesForCategory: getTrainingCoursesForCategory,
      getTrainingCourse: getTrainingCourse,
      getCommunications: getCommunications,
      getFeaturedCommunications: getFeaturedCommunications,
      // // ToM.display
      displayTrainingCourse: displayTrainingCourse,
      displayCategory: displayCategory,
      displayWall: displayScreenFn("Wall"),
      displayCommunication: displayCommunication,
      displayCatalog: displayScreenFn("Catalog"),
      displaySearch: displaySearch,
      displayProfile: displayScreenFn("Profile"),
      displayApps: displayScreenFn("Apps"),
      // ToM.appUtils
      showTrainingCourseEnrollment: showTrainingCourseEnrollment,
      logout: doLogout,
      // // ToM.learner
      getProfile: getProfile,
      // Shake'n'Learn
      isShakeAndLearnPossible: isShakeAndLearnPossible,
      shakeAndLearn: shakeAndLearn,

      // setFeaturedCommunications: setFeaturedCommunications,
      // setProfile: setProfile

      disableWakeLock: disableWakeLock,
      enableWakeLock: enableWakeLock,
      isSandbox: isSandbox,
      close: closeActivity,

      init: initSession,
      set: setVar,
      get: getVar,
      send: sendSession

    };
}