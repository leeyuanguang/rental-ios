//Convert price
function setTwoNumberDecimal() {
    var value = document.getElementById("itemPricePerDay").value;
    document.getElementById("itemPricePerDay").value = parseFloat(value).toFixed(2);
}