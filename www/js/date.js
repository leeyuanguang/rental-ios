//date.js
Date.prototype.getFormatedDateTime = function() {
    var timeFormatOptions = {  weekday: "short", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit" };
        return this.toLocaleTimeString("en-us", timeFormatOptions);
};

Date.prototype.getFormatedDate = function() {
    var timeFormatOptions = {  year: "numeric", month: "numeric",
    day: "numeric"};
        return this.toLocaleTimeString("en-us", timeFormatOptions);
};

Date.prototype.getSimpleDate = function() {
	return this.getDate() + "/" + (this.getMonth() + 1) + "/" + this.getFullYear();
};

Date.prototype.getFormatedTime = function() {
    var timeFormatOptions = { hour: "2-digit", minute: "2-digit" };
    return this.toLocaleTimeString("en-us", timeFormatOptions);
};