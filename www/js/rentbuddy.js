// Init App
var myApp = new Framework7({
    modalTitle: 'RentBuddy'
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true,
});

myApp.onPageInit('create-item', function (page) {
    var pickerCategory = myApp.picker({
        input: '#picker-category',
        cols: [
            {
                textAlign: 'center',
                values: ['Costumes', 'Electronics', 'Photography', 'Sports', 'Others']
            }
        ]
    });
});