var streetMap = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});
var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);
const mapOption = {
  zoomControl: false,
  zoom: 10,
  doubleClickZoom: false,
  layers: [streetMap],
};
var map = L.map("map", mapOption);
var baseMaps = {
  OpenStreetMap: streetMap,
  WorldMap: Esri_WorldImagery,
};
var layerControl = L.control
  .layers(baseMaps, null, {
    position: "topleft",
  })
  .addTo(map);
const setLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      map.setView([position.coords.latitude, position.coords.longitude]);
      markerEl = new L.marker([
        position.coords.latitude,
        position.coords.longitude,
      ]).addTo(map);
    });
  }
};
setLocation();
L.control
  .zoom({
    position: "topright",
  })
  .addTo(map);
L.control.scale().addTo(map);
map.on("load", () => {
  let center = map.getCenter();
  document.querySelector(".current-center").innerHTML = `${center.lat},
    ${center.lng}`;
});
const getzoomDefault = () => {
  let zoomlevel = map.getZoom();
  document.querySelector(".zoom-level").innerHTML = zoomlevel;
};
getzoomDefault();
map.on("zoomend", () => {
  let zoomlevel = map.getZoom();
  document.querySelector(".zoom-level").innerHTML = zoomlevel;
});
map.on("mousemove", (e) => {
  document.querySelector(".lat").innerHTML = e.latlng.lat;
  document.querySelector(".long").innerHTML = e.latlng.lng;
  let center = map.getCenter();
  document.querySelector(".current-center").innerHTML = `${center.lat},
    ${center.lng}`;
});
map.on("dblclick", (e) => {
  let markerEl = new L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
    .bindPopup(`${e.latlng.lat},
        ${e.latlng.lng}`);
});

fetch("./TAMBON.json.geojson")
  .then((res) => res.json())
  .then((data) => {
    var tambon = L.geoJSON(data.features, {
      color: "#ff7800",
    });
    layerControl.addOverlay(tambon, "Tambon");
    tambon.on("click", async (e) => {
      console.log(e)
      let layerCenter = await e.layer.getCenter();
      await tambon.resetStyle();
      await e.layer.setStyle({ fillColor: "#0000FF" });
      await map.flyTo([layerCenter.lat, layerCenter.lng], 12);
      let center = await map.getCenter();
      document.querySelector(".current-center").innerHTML = `${center.lat},
    ${center.lng}`;
      document.querySelector(
        ".tambon-detail"
      ).innerHTML = `<span>ตำบล ${e.layer.feature.properties.TAM_NAMT}</span>
      <span>อำเภอ ${e.layer.feature.properties.AMP_NAMT}</span>
      <span>จังหวัด ${e.layer.feature.properties.PROV_NAMT}</span><div>พื้นที่ ${e.layer.feature.properties.PERIMETER} ไร่</div>`;
    });
  });
