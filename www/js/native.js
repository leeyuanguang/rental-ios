var jqueryReady = $.Deferred();
var cordovaReady = $.Deferred();

$(function() {

    jqueryReady.resolve();

});

document.addEventListener("deviceready", function() {
    cordovaReady.resolve();
}, false);

$.when(jqueryReady, cordovaReady).done(function() {
    }).error(function() {
    alert("Error");//todo yg
});