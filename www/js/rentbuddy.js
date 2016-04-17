// Init App
var myApp = new Framework7({
    modalTitle: 'RentBuddy',
    }
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {});