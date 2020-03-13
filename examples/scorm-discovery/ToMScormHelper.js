var ScormHelper = {
    get2004Api: function(win) {
        function ScanForAPI2004(win) {
            var nFindAPITries = 0;
            while ((win.API_1484_11 == null) && (win.parent != null) && (win.parent != win)) {
                nFindAPITries++;
                if (nFindAPITries > 20) {
                    return null;
                }
                win = win.parent;
            }
            return win.API_1484_11;
        }

        var APIFound = ScanForAPI2004(win);
        if ((APIFound == null) && (win.opener != null)) {
            APIFound = ScanForAPI2004(win.opener);
        }

        return APIFound;
    },
    get12Api: function(win) {
        function findAPI12(win) {
            var findAPITries = 0;
            while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
                findAPITries++;
                if (findAPITries > 7) {
                    alert("Error finding API -- too deeply nested.");
                    return null;
                }
                win = win.parent;
            }
            return win.API;
        }
        var theAPI = findAPI12(win);
        if ((theAPI == null) && (win.opener != null) && (typeof(win.opener) != "undefined")) {
            theAPI = findAPI12(win.opener);
        }
        if (theAPI == null) {
            alert("Unable to find an API adapter");
        }
        return theAPI;
    }
};

window.ToMScormHelper = ScormHelper;
window.ToM = window.ToM || (window.top && window.top.ToM);