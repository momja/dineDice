
// set the information so the next page can make use of them, and they can be remembered
function setInformation() {
  var radiusinMiles = document.getElementById("distanceRange").value/10;
  var radiusinMeters = convertMilesToMeters(radiusinMiles);
  sessionStorage.setItem("radius", radiusinMeters);

  var price = document.getElementById("priceRange").value;
  sessionStorage.setItem("price", price);

}

// fetch the information or set the default inputs
function getInformation() {
  var radius = sessionStorage.getItem("radius") || 3;
  var price = sessionStorage.getItem("price") || 1;

  document.getElementById("distanceRange").value = parseInt(radius) + " miles";
  document.getElementById("priceRange").value = parseInt(price);
}

function convertMilesToMeters(miles) {
  return miles/0.000621371;
}
