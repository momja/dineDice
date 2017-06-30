

// set the information so the next page can make use of them, and they can be remembered
function setInformation() {
  var radius = document.getElementById("distanceRange").value;
  sessionStorage.setItem("radius", radius);

  var price = document.getElementById("priceRange").value;
  sessionStorage.setItem("price", price);
}

// fetch the information or set the default inputs
function getInformation() {
  var radius = sessionStorage.getItem("radius") || 5000;
  var price = sessionStorage.getItem("price") || 1;

  document.getElementById("distanceRange").value = parseInt(radius);
  document.getElementById("priceRange").value = parseInt(price);
}
