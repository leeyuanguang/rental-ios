var jqueryReady = $.Deferred();
var cordovaReady = $.Deferred();

$(function () {
    jqueryReady.resolve();
});

document.addEventListener("deviceready", function () {
    cordovaReady.resolve();
    alert("Yes Device ready!");//todo yg
}, false);

$.when(jqueryReady, cordovaReady).done(function () {
    alert("All ready");
}).error(function () {
    alert("Error");
});


function takePic() {
    alert("hi");
    var tapEnabled = true; //enable tap take picture
    var dragEnabled = true; //enable preview box drag across the screen
    var toBack = true; //send preview box to the back of the webview
    var rect = {x: 100, y: 100, width: 200, height: 200};
    cordova.plugins.camerapreview.startCamera(rect, "front", tapEnabled, dragEnabled, toBack);
    alert("hi1");
    cordova.plugins.camerapreview.show();
    alert("hi2");
    cordova.plugins.camerapreview.takePicture({maxWidth: 640, maxHeight: 640});
    alert("hi3");
    cordova.plugins.camerapreview.hide();
    alert("bye");
}