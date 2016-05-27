//client socket - connects to hosts that serves the page
var socket = io();

function initSocket() {
    var url = window.location.pathname;
    role = url[1];
    url = url.slice(3);
    console.log('roomname: ' + url);

    console.log('connecting to socket');
    socket.emit('register', url);
    socket.on('roomConnected', function (room) {
        console.log('you joined ' + room + " chatroom");
    });
}

function submitForm() {
    console.log('client sending - ' + $('#msgArea').val().trim());
    socket.emit('message', {
        msg: $('#msgArea').val().trim(),
        user: rentId + role
    });
    $('#msgArea').val('');

    resetMsgHeight();
    event.preventDefault();
    return false;
}


socket.on('broadcast', function (obj) {
    console.log('received ' + obj.msg);
    receiveMessage(obj.msg, obj.user);
    scrollToEnd();
});

socket.on('offerAck', function (obj) {
    var dates;
    var dayCount;
    if (obj.dates.length > 1) {
        dayCount = checkDatesCount(obj.dates);
        dates = obj.dates[0] + " to " + obj.dates[1] + ' (' + dayCount + 'day)';
    } else {
        dates = "For " + obj.dates;
        dayCount = 1;
    }

    latestOffer = {
        rentee: obj.rentee,
        renter: rentId + role,
        dates: obj.dates,
        price: obj.price,
        status: ''
    };
    console.log("offerAck: " + obj.rentee + ", " + obj.price + " , " + obj.dates);
    receiveOffer(obj.rentee, obj.price + "/day", dates, dayCount * obj.price);
    scrollToEnd();
});

socket.on('offerResponseAck', function (obj) {

    console.log("offerResponseAck: " + obj.rentee + ", " + obj.price + " , " + obj.dates + " , " + obj.status);
    var dates;
    var dayCount;
    if (obj.dates.length > 1) {
        dayCount = checkDatesCount(obj.dates);
        dates = obj.dates[0] + " to " + obj.dates[1] + ' (' + dayCount + 'day)';
    } else {
        dates = "For " + obj.dates;
        dayCount = 1;
    }

    latestOffer = {rentee: obj.rentee, renter: rentId + role, dates: obj.dates,
        price: obj.price, status: ''};
    receiveOfferResp(obj.renter, obj.price + "/day", dates, dayCount * obj.price, obj.status);
    scrollToEnd();
});

function receiveMessage(msg, sentUser) {
    var options = {
        hour: "2-digit",
        minute: "2-digit"
    };
    var time = new Date().toLocaleTimeString('en-us', options);
    if (sentUser === rentId + role) {
        $('#msg').append('<div class="message message-sent "><div class="message-text">' + msg + '</div><div class="message-label">' + time + '</div></div>');
    } else {
        $('#msg').append('<div class="message message-with-avatar message-received"><div class="message-text">' + msg + '</div><div class="message-label">' + time + '</div></div>');
    }
}

function receiveOffer(sentUser, price, days, total) {
    //TODO: check renter & rentee id to confirm display
    var options = {
        hour: "2-digit",
        minute: "2-digit"
    };
    var time = new Date().toLocaleTimeString('en-us', options);


    if (sentUser === rentId + role) {
        console.log("sent offer");
        $('#msg').append('<div class="message message-sent"><div class="message-text offer"><b>Made An Offer<br/>' + days + '<br/>$' + price + '<br/>$' + total + '</b></div><div class="message-label">' + time + '</div></div>');
    } else {
        showOfferAckBtn(true);
        console.log("receive offer");
        $('#msg').append('<div class="message message-with-avatar message-received"><div class="message-text"><b>Made An Offer<br/>' + days + '<br/>$' + price + '<br/>$' + total + '</b></div><div class="message-label">' + time + '</div></div>');
    }
}

function receiveOfferResp(sentUser, price, days, total, status) {
    var options = {
        hour: "2-digit",
        minute: "2-digit"
    };
    var time = new Date().toLocaleTimeString('en-us', options);

    if (sentUser === rentId + role) {
        console.log("sent offer");
        $('#msg').append('<div class="message message-sent"><div class="message-text offer"><b>' + status + ' Offer<br/>' + days + '<br/>$' + price + '<br/>$' + total + '</b></div><div class="message-label">' + time + '</div></div>');
    } else {
        if (status === 'Accepted') {
            showFeedbackBtn();
        }
        console.log("receive offer");
        $('#msg').append('<div class="message message-with-avatar message-received"><div class="message-text"><b>Offer ' + status + ' <br/>' + days + '<br/>$' + price + '<br/>$' + total + '</b></div><div class="message-label">' + time + '</div></div>');
    }
}