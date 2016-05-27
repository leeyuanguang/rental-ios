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

var featherEditor;

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

    //Instantiate Feather
    featherEditor = new Aviary.Feather({
        apiKey: '2f7713fd8a924fa59ba103abc91e7ee6',
        theme: 'light', // Check out our new 'light' and 'dark' themes!
        tools: 'all',
        appendTo: '',
        cropPresets: ['Square', '1:1'],
        onSave: function (imageID, newURL) {
            var img = document.getElementById(imageID);
            img.src = newURL;
        },
        onError: function (errorObj) {
            alert(errorObj.message);
        }
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

function launchEditor(id, src) {
    featherEditor.launch({
        image: id,
        url: src
    });
    return false;
}

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


myApp.onPageBeforeAnimation('message-view', function (page) {
setupPage();
});