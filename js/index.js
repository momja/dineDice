
// set the information so the next page can make use of them, and they can be remembered
function setInformation() {
  var radiusinMiles = document.getElementById("distanceRange").value/10;
  var radiusinMeters = convertMilesToMeters(radiusinMiles);
  sessionStorage.setItem("radius", radiusinMeters);

  if (document.getElementById("price_level_1").checked) {
    // price 1 and 2 are checked
    if (document.getElementById("price_level_2").checked) {
      sessionStorage.setItem("minprice", "1");
      sessionStorage.setItem("maxprice", "2");
    }
    // price 1 and 3 are checked
    else if (document.getElementById("price_level_3").checked) {
      sessionStorage.setItem("minprice", "1");
      sessionStorage.setItem("maxprice", "3");
    }
    // only price 1 is checked
    else {
      sessionStorage.setItem("minprice", "1");
      sessionStorage.setItem("maxprice", "1");
    }
  }
  else if (document.getElementById("price_level_2").checked) {
    // price 2 and 3 are checked
    if (document.getElementById("price_level_3").checked) {
      sessionStorage.setItem("minprice", "2");
      sessionStorage.setItem("maxprice", "3");
    }
    // only price 2 is checked
    else {
      sessionStorage.setItem("minprice", "2");
      sessionStorage.setItem("maxprice", "2");
    }
  }
  // only price 3 is checked
  else {
    sessionStorage.setItem("minprice", "3");
    sessionStorage.setItem("maxprice", "3");
  }

}

// fetch the information or set the default inputs
function getInformation() {
  var radius = sessionStorage.getItem("radius") || 3;
  document.getElementById("distanceRange").value = parseInt(radius) + " miles";
}

function convertMilesToMeters(miles) {
  return miles/0.000621371;
}
