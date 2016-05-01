//Convert price
function setTwoNumberDecimal() {
    var value = document.getElementById("itemPricePerDay").value;
    document.getElementById("itemPricePerDay").value = parseFloat(value).toFixed(2);
}

$('input, textarea, button, a, select').off('touchstart mousedown').on('touchstart mousedown', function(e) {
    e.stopPropagation();
});