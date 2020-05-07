
window.ToM = window.ToM || (window.top && window.top.ToM);
// Init tracking
function initTracking(){
  // Is TOM Library present
  if (!window.AP) {
    return;
  }
  $('#ap-container').attr('data-id', window.AP.briefingId);

  window.addEventListener("unload", function (event) {
      if (!window.progressSent) {
          sendTracking();
      }
  });
  window.addEventListener("beforeunload", function (event) {
      if (!window.progressSent) {
          sendTracking();
      }
  });
  $(".close-button").click(function() {
    sendTracking();
    ToM.utils.close();
  });

  if(typeof(ToM) != 'undefined'){
    ToM.data.init();
  }
  $.getScript('https://anderspink.com/lib/embed-v1.js')
}

// Function to fill array and send stats to mission center
function sendTracking(){
  window.progressSent = true;
  if(typeof(ToM) != 'undefined'){
    var previousProgress = ToM.data.get("progress");
    ToM.data.set('progress', 100);
    if (window.AP.points && previousProgress < 100) {
      ToM.data.set('points', window.AP.points);
    }
    ToM.data.send();
  }
}
