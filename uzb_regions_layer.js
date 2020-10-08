mapboxAccessToken =
  "pk.eyJ1IjoiZG9uaXNoIiwiYSI6ImNrZnc1amt1djE3ajkycXQ4d2hpNGl5b24ifQ.daCqLcqMoGmy2806N6Dy4A";

var street = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
  grayscale = new L.TileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" +
      mapboxAccessToken,
    {
      id: "mapbox/light-v9",
      tileSize: 512,
      zoomOffset: -1,
    }
  );

var map = L.map("map", {
  attributionControl: false,
  layers: [street, grayscale],
}).setView([41.219986, 65.334717], 5);

var reg_borders = L.geoJSON(data);

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); //create a div with class info
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML =
    "<h4>Population of </h4>" +
    (props
      ? "<b>" + props.name + "</b><br />" + props.population + " people"
      : "Turn on population data layer<br/>and hover over a region");
};

info.addTo(map);

function getColor(p) {
  return p > 3000000
    ? "#de2d26"
    : p > 2000000
    ? "#fc9272"
    : p > 1000000
    ? "#fcae91"
    : "#fee5d9";
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.population),
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

var populationLayer;

function resetHighlight(e) {
  populationLayer.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

populationLayer = L.geoJSON(data, {
  style: style,
  onEachFeature: onEachFeature,
});

var city_marker = L.geoJSON(city_centres);

var baseMaps = {
  street: street,
  "Gray layer": grayscale,
};

var overlayMaps = {
  "Uzbekistan regions": reg_borders,
  "Region Population data": populationLayer,
  "Region Centers": city_marker,
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

// map.on("click", function (e) {
//   L.marker([e.latlng.lat, e.latlng.lng])
//     .bindPopup(e.latlng.toString())
//     .addTo(map);
// });
