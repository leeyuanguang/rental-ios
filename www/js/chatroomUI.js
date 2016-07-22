//chatroomUI.js

    var def_msgbar_height = 44;
    var def_msgarea_height = 26;
    var content_height;
    var isBtnShown = false;
    var isAcceptMsgShown = false;

    var USER_ROLE = {	RENTEE: { val: 0, name: 'Rentee' },
        				RENTER: { val: 1, name: 'Renter' }
    				};
    var role = 0;
    var rentId = 'userRenter';
    var rent_item = {  name: "Noname", price: 0, deposit: 0,
        location: "Serangoon", condition: 8, pic: "assets/item.png"  };
    var latestOffer;

    var fw7 = new Framework7();
    var $$ = Dom7; //custom DOM library

    //client socket - connects to hosts that serves the page
    var socket = io();
    var calendarRange;

    function initSocket() {
        var url = window.location.pathname;
        role = url[1];
        url = url.slice(3);
        console.log('roomname: ' + url);

        console.log('connecting to socket');
        socket.emit('register', url);
        socket.on('roomConnected', function(room) {
            console.log('you joined ' + room + " chatroom");
        });
    }

    //msg functions 
    function handleTextSubmit(evnt) { 
        if (evnt.keyCode == 13) { //if enter key pressed
            if ($('#msgArea').val().trim() != "") {
                sendMessage();
            } else {
                evnt.preventDefault();
            }
        }
    }

    function handleMsgAreaResize(evnt,element) {
        var height = document.getElementById('msgArea').scrollHeight;
        console.log('line height: ' + height); 
        $('.messagebar').css('height', (height + 18) + 'px');
        $('#msgArea').css('height', height + 'px');      
    }

    function resetMsgHeight() {
        $('.messagebar').css('height', def_msgbar_height + 'px');
        $('#msgArea').css('height', def_msgarea_height + 'px');
    }

    function scrollToEnd() {
        $('.page-content').scrollTop(findPos(document.getElementById('pageEnd')));
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

    function loadItemInfo(){ 
        console.log("loadItemInfo");
        //ajax to get itemInfo
        $.ajax({
            type: "POST",
            url: "/getItemInfo",
            data: { "itemId" : "1" },
            dataType: "text",
            success: function (data) {
                console.log("success");
                var json = JSON.parse(data);
                console.log(json);
                rent_item = json;
                setItemInfo();
            },
            error: function(xhr, status, error){
                console.log("error");
            }
        }); 

      
    }
    function setItemInfo(){
        console.log("set item info");
          if(rent_item != undefined){ 
            console.log("setted info: " + rent_item.name);
            $('#item_name').text(rent_item.name);  
            $('#item_price').text("Price: " + rent_item.price); 
            $('#item_deposit').text("Deposit: " + rent_item.deposit); 
            $('#item_location').text("Location: " + rent_item.location); 
            $('#item_description').text("Description: " + rent_item.description); 

            $('#price_text').val(rent_item.price); 
            $('#deposit_price').text('*Price excludes the $' + rent_item.deposit + ' deposit requested by renter.'); 
        } 
    }

    function checkPrice() {
        var price = parseFloat($('#price_text').val()); 
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

    function getSimpleDate(date){
        return new Date(date).getSimpleDate();
    }
    //end offer functions

    function showFeedbackBtn() {
        $('#btndiv').html('<a id="btnFeedback" class="button button-fill color-red">Feedback</a>');
        isBtnShown = true;
    }

    function showOfferAckBtn(bool) {
        if(bool){
            $('#btndiv').html('<p class="buttons-row"><a id="btnReject" class="button" onclick="rejectOffer(event)">Reject Offer</a><a id="btnAccept" class="button" onclick="acceptOffer(event)">Accept Offer</a></p>');   
            isBtnShown = true;
        }else{
            $('#btndiv').html('');
            isBtnShown = false; 
        }
        adjustContentHeight(content_height);
    }

    function acceptOffer() {
        var dateString = getSimpleDate(latestOffer.dates[0]) + ' - ' + getSimpleDate(latestOffer.dates[1]);
        fw7.confirm('Are you sure you want to accept?\n Dates: ' + dateString + ' \n Price: $' + latestOffer.price, 'Accept Offer',
            function() {
                socket.emit('offerResponse', {
                    rentee: latestOffer.rentee, renter: latestOffer.renter,
                    dates: latestOffer.dates, price: latestOffer.price,
                    status: 'Accepted'
                });
                console.log('acceptOffer confirm');
                showFeedbackBtn(); 
                showAcceptedMsg();
            },
            function() {});
    }

    function rejectOffer() {
        console.log('rejectOffer');
        fw7.confirm('Are you sure you want to reject?', 'Reject Offer',
            function() {
                socket.emit('offerResponse', {
                    rentee: latestOffer.rentee, renter: latestOffer.renter,
                    dates: latestOffer.dates,  price: latestOffer.price,
                    status: 'Rejected'
                });
                console.log('RejectOffer confirm');
                showOfferAckBtn(false) ;
            });
    }

    function showAcceptedMsg(){
    	$('#accept_text').html('<a style="font-size:14px;">You have accepted the offer on ' + new Date().toLocaleDateString() + '</a>');
    	isAcceptMsgShown = true;
    	adjustContentHeight(content_height);
    }

    function showMakeOfferBtn(){ 
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
            $('#msg-date').html('<span>' + USER_ROLE.RENTEE.name + ' joined on </span>' + new Date().getFormatedDateTime());
            $('#msg').append(
                '<div class="message message-with-avatar message-received"><div class="message-text">' + renterWelcome + '</div></div><div class = "message message-sent"><div class="message-text">' + renteeWelcome + '</div></div>');

        } else if (role == USER_ROLE.RENTER.val) {
            $('#msg-date').html('<span>' + USER_ROLE.RENTER.name + ' joined on </span>' + new Date().getFormatedDateTime());
            $('#msg').append('<div class = "message message-sent"><div class="message-text">' + renterWelcome + '</div></div><div class="message message-with-avatar message-received"><div class="message-text">' + renteeWelcome + '</div></div>');
        }
    }
  
    function adjustContentHeight(percent){
    	if (isAcceptMsgShown){
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
    function setupPage() {
        console.log('setup page'); 
        setupCalenderPicker();
        initConver();

        if (role == USER_ROLE.RENTEE.val) {
            showMakeOfferBtn();
        } else {
            
        }
    }

    $(document).ready(function() {
        initSocket();
        setupPage();
        loadItemInfo();
    });