// Init App
var myApp = new Framework7({
    modalTitle: 'RentBuddy',
    cache: false,
    pushState: true,
    //iOS Specific
    animateNavBackIcon: true,
    template7Pages: true,
    template7Data: {
        'settings': {
            version: '1.0.0'
        }
    }
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
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

myApp.onPageInit('index', function (page) {
    console.log("onPageInit index");
    var authtoken = localStorage.getItem("authtoken");
//     if (authtoken != null) { todo
    mainView.router.load({url: 'home.html', force: true, reload: true, animatePages: false});
//     } else {
//    mainView.router.load({url: 'signup-splash.html', reload: true, animatePages: true});//back to previous page     
//     }
}).trigger();

function navigateToSearch() {
    console.log("navigateToSearch");
    var value = document.getElementById("search").value;

    var myApp = new Framework7({
        template7Data: {
            'search': {
                result: value
            }
        }
    });

    mainView.router.load({url: 'search.html', force: false, reload: false, animatePages: true});
}