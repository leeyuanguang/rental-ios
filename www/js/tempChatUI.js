var def_msgbar_height = 44;
var def_msgarea_height = 26;
var content_height;
var isBtnShown = false;
var isAcceptMsgShown = false;

var USER_ROLE = {RENTEE: {val: 0, name: 'Rentee'},
    RENTER: {val: 1, name: 'Renter'}
};
var role = 0;
var rentId = 'userRenter';
var rent_item = {name: "Samsung Galaxy S6", price: 10, deposit: 80, location: "Serangoon", condition: 8, pic: "img/phone.jpg"};
var latestOffer;

var fw7 = new Framework7();
var $$ = Dom7; //custom DOM library

var calendarRange;

$('#submit').click(function () {
    if ($('#msgArea').val().trim() !== "") {
        submitForm();
    }
});

//msg functions
function handleTextSubmit(evnt) {
    if (evnt.keyCode == 13) { //if enter key pressed
        if ($('#msgArea').val().trim() != "") {
            submitForm();
        } else {
            evnt.preventDefault();
        }
    }
}

function handleMsgAreaResize(evnt, element) {
    var height = document.getElementById('msgArea').scrollHeight;
    console.log('line height: ' + height);
    $('.messagebar').css('height', (height + 18) + 'px');
    $('#msgArea').css('height', height + 'px');

}

function resetMsgHeight() {
    $('.messagebar').css('height', def_msgbar_height + 'px');
    $('#msgArea').css('height', def_msgarea_height + 'px');
}

function findPos(obj) {
    //Finds y value of given object
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}

function scrollToEnd() {
    $('.page-content').scrollTop(findPos(document.getElementById('pageEnd')));
}
//end msg functions

//offer functions
function clearDates(event) {
    console.log('clickeds: ' + calendarRange.value);
    $('#calendar-range').val('');
    calendarRange.value = [];
    $('#date_symbol').addClass('hidden');
    updateTotalPrice();
}

function checkDates(event) {
    $('#date_symbol').removeClass('hidden');
    updateTotalPrice();
}

function getSelectedDates() {
    if (calendarRange.value != null) {
        if (calendarRange.value.length > 1) {
            var startDate = new Date(calendarRange.value[0]).toLocaleDateString();
            var endDate = new Date(calendarRange.value[1]).toLocaleDateString();
            return [startDate, endDate];
        } else if (calendarRange.value.length === 1) {
            return [new Date(calendarRange.value[0]).toLocaleDateString()];
        }
    }
    return -1;
}

function getSelectedDatesCount() {
    var days = -1;
    if (calendarRange.value != null) {
        if (calendarRange.value.length > 1) {
            var startDate = new Date(calendarRange.value[0]);
            var endDate = new Date(calendarRange.value[1]);
            days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
            console.log("num of days: " + days);
        } else if (calendarRange.value.length === 1) {
            days = 1;
        }
    }
    return days;
}

function checkDatesCount(dates) {
    var start = new Date(dates[0]);
    var end = new Date(dates[1]);
    return days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
}

function updatePrice(event) {
    //TODO: check if date before today and if blocked out dates in range
    updateTotalPrice();
}

function checkPrice() {
    var price = parseFloat($('#price_text').val());
    console.log('checkPrice ' + price);
    if (!isNaN(price)) {
        $('#price_text').val(price);
        hidePriceError();
        return price;
    } else {
        showPriceError();
        return -1;
    }
}

function showPriceError() {
    console.log("price error");
    $("#popup_price_content").addClass("bg-danger");
    //TODO: finish tooltip error
    $("#item-input-text").tooltip();
    $("#item-input-text").tooltip('show');

}

function hidePriceError() {
    $('#popup_price_content').removeClass('bg-danger');
}

function updateTotalPrice() {
    var days = getSelectedDatesCount();
    var price = checkPrice();
    if (days == -1 || price == -1) {
        $('#total_text').text('Total Price*: ');
        $('#offer_submit').addClass('disabled');
    } else {
        $('#total_text').text('Total Price*: ' + days + ' day(s) X $' + price + ' = $' + (days * price));
        $('#offer_submit').removeClass('disabled');
    }
}

function makeOffer() {
    console.log('client send offer');
    var price = checkPrice();
    var dates = getSelectedDates();
    if (dates != -1 && price != -1) {
        //TODO: complete validation 
        socket.emit('offer', {
            rentee: rentId + role,
            renter: 'renter',
            dates: dates,
            price: price
        });
        clearDates();
    }
}
//end offer functions

function showFeedbackBtn() {
    $('#btndiv').html('<a id="btnFeedback" class="button button-fill">Feedback</a>');
    isBtnShown = true;
}

function acceptOffer() {
    fw7.confirm('Are you sure you want to accept?\n Dates: ' + latestOffer.dates + ' \n Price: $' + latestOffer.price, 'Accept Offer',
            function () {
                socket.emit('offerResponse', {
                    rentee: latestOffer.rentee, renter: latestOffer.renter,
                    dates: latestOffer.dates, price: latestOffer.price,
                    status: 'Accepted'
                });
                console.log('acceptOffer confirm');
                showFeedbackBtn();
                showAcceptedMsg();
            },
            function () {});
}

function rejectOffer() {
    console.log('rejectOffer');
    fw7.confirm('Are you sure you want to reject?', 'Reject Offer',
            function () {
                socket.emit('offerResponse', {
                    rentee: latestOffer.rentee, renter: latestOffer.renter,
                    dates: latestOffer.dates, price: latestOffer.price,
                    status: 'Rejected'
                });
                console.log('RejectOffer confirm');
                showOfferAckBtn(false);
            });
}

function showAcceptedMsg() {
    $('#accept_text').html('<a style="font-size:12px;">You have accepted the offer on ' + new Date().toLocaleDateString() + '</a>');
    isAcceptMsgShown = true;
    adjustContentHeight(content_height);
}

function showOfferAckBtn(bool) {
    if (bool) {
        $('#btndiv').html('<p class="buttons-row"><a id="btnReject" class="button" onclick="rejectOffer(event)">Reject Offer</a><a id="btnAccept" class="button" onclick="acceptOffer(event)">Accept Offer</a></p>');
        isBtnShown = true;
    } else {
        $('#btndiv').html('');
        isBtnShown = false;
    }
    adjustContentHeight(content_height);
}

function loadRenterPage() {

}

function loadRenteePage() {
    console.log('loadRenteePage');
    $('#btndiv').html('<a class="button open-popover" id="btnOffer" data-popover=".popover-about" >Make Offer</a>');
}

function initConver() {
    var renterWelcome = 'Hi, How can i help you?';
    var renteeWelcome = 'Hello, I\'m interested in your item!';

    //hardcode user name 
    if (role == 0) {
        $('#user_name').html(USER_ROLE.RENTER.name);
    } else {
        $('#user_name').html(USER_ROLE.RENTEE.name);
    }
    if (role == USER_ROLE.RENTEE.val) {
        $('#msg-date').html('<span>' + USER_ROLE.RENTEE.name + ' joined on </span>' + Date().toString());
        $('#msg').append(
                '<div class="message message-with-avatar message-received"><div class="message-text">' + renterWelcome + '</div></div><div class = "message message-sent"><div class="message-text">' + renteeWelcome + '</div></div>');

    } else if (role == USER_ROLE.RENTER.val) {
        $('#msg-date').html('<span>' + USER_ROLE.RENTER.name + ' joined on </span>' + Date().toString());
        $('#msg').append('<div class = "message message-sent"><div class="message-text">' + renterWelcome + '</div></div><div class="message message-with-avatar message-received"><div class="message-text">' + renteeWelcome + '</div></div>');
    }
}

function loadItemInfo() {
    console.log('loadItemInfo');
    $('#item_name').html(rent_item.name);
    $('#item_price').html('$' + rent_item.price + '/Day, $' + rent_item.deposit + ' Deposit');
    $('#item_location').html(rent_item.location);
    $('#item_condition').html('Conditions: ' + rent_item.condition + '/10');
    $('#item_img').css('content', 'url(' + rent_item.pic + ')');

    $('#price_text').val(rent_item.price);
    $('#deposit_price').text('*Price excludes the $' + rent_item.deposit + ' deposit requested by renter.');
    console.log('end load');
}

function setupPage() {
       console.log('setup page');
//    initSocket();
    loadItemInfo();
    setupItemAccordion();
    setupCalenderPicker();
    initConver();

    if (role == USER_ROLE.RENTEE.val) {
        loadRenteePage();
    } else {
        loadRenterPage();
    }
}

function setupItemAccordion() {
     
    fw7.accordionOpen($$('.accordion-item'));
    $$('.accordion-item').on('opened', function () {
        content_height = 50;
        adjustContentHeight(content_height);
        scrollToEnd(); 
    });

    $$('.accordion-item').on('closed', function (e) {
        content_height = 70;
        adjustContentHeight(content_height);
        scrollToEnd();
    });
    console.log('end item acc');
}

function adjustContentHeight(percent) {

    if (isAcceptMsgShown) {
        percent = percent - 3;
    }
    $('.page-content').css('height', percent + '%');
}

function setupCalenderPicker() {
    var today = new Date();
    var endDate = new Date().setDate(today.getDate() + 7);
    calendarRange = fw7.calendar({
        input: '#calendar-range',
        dateFormat: 'dd M yyyy',
        rangePicker: true,
        touchmove: true,
        disabled: [new Date(2016, 3, 20),
            new Date(2016, 3, 22), {
                from: today,
                to: endDate
            }
        ]
    });
}

$(document).ready(function () {
    
    setupPage();
});