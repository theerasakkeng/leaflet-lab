//base map
var streetMap = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 2,
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});
var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    minZoom: 2,
    maxZoom: 19,
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);
const miniTileMap = new L.TileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

// map opption
const mapOption = {
  zoomControl: false,
  zoom: 10,
  center: [16.439625, 102.828728],
  doubleClickZoom: false,
  layers: [streetMap],
};

//add map
var map = L.map("map", mapOption);
//add minimap
var miniMap = new L.Control.MiniMap(miniTileMap, {}).addTo(map);

var baseMaps = {
  OpenStreetMap: streetMap,
  WorldMap: Esri_WorldImagery,
};

//add basemap to control
var layerControl = L.control
  .layers(baseMaps, null, {
    position: "topleft",
  })
  .addTo(map);

//getlocation and setview
const setCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      map.flyTo([position.coords.latitude, position.coords.longitude]);
      markerEl = new L.marker([
        position.coords.latitude,
        position.coords.longitude,
      ]).addTo(map);
      console.log(markerEl);
    });
  }
};

//add zoom control
L.control
  .zoom({
    position: "topright", //"topleft" || "bottomright" || "bottomleft"
  })
  .addTo(map);

//add scale control
// L.control
//   .scale({
//     imperial: false,
//   })
//   .addTo(map);

//getdefault center and zoom to html
const getDefault = () => {
  let zoomlevel = map.getZoom();
  let center = map.getCenter();
  scaleBar(zoomlevel);
  document.querySelector(".zoom-level").innerHTML = zoomlevel;
  document.querySelector(".current-center").innerHTML = `${center.lat},
    ${center.lng}`;
};
getDefault();

//getzoom when zoomed event
map.on("zoomend", () => {
  let zoomlevel = map.getZoom();
  scaleBar(zoomlevel);
  document.querySelector(".zoom-level").innerHTML = zoomlevel;
});

//get latlong when mousemove event
map.on("mousemove", (e) => {
  document.querySelector(".lat").innerHTML = e.latlng.lat;
  document.querySelector(".long").innerHTML = e.latlng.lng;
  let center = map.getCenter();
  document.querySelector(".current-center").innerHTML = `${center.lat},
    ${center.lng}`;
});

//create marker when double click
map.on("dblclick", (e) => {
  let markerEl = new L.marker(e.latlng).addTo(map).bindPopup(`${e.latlng.lat},
        ${e.latlng.lng}`);
});

//get geojson
const getGeojson = async () => {
  //Village geojson
  await fetch("./geojson/VILLAGE.geojson")
    .then((res) => res.json())
    .then((data) => {
      const village = L.geoJSON(data.features);
      layerControl.addOverlay(village, "Village");
      village.on("click", async (e) => {
        await map.flyTo(e.latlng, 17);
        L.popup({
          offset: L.point(1, -25),
        })
          .setLatLng(e.latlng)
          .setContent(e.layer.feature.properties.VILL_NM_T)
          .openOn(map);
      });
    });

  //Tambon geojson
  await fetch("./geojson/TAMBON.geojson")
    .then((res) => res.json())
    .then((data) => {
      const tambon = L.geoJSON(data.features, {
        color: "#ff7800",
        weight: 1,
      });
      layerControl.addOverlay(tambon, "Tambon");
      tambon.on("click", async (e) => {
        let layerCenter = await e.layer.getCenter();
        await tambon.resetStyle();
        await e.layer.setStyle({ fillColor: "green" });
        await map.flyTo([layerCenter.lat, layerCenter.lng], 12);
        let center = await map.getCenter();
        document.querySelector(".current-center").innerHTML = `${center.lat},
  ${center.lng}`;
        document.querySelector(".tambon-detail").innerHTML = `<span>ตำบล ${
          e.layer.feature.properties.TAM_NAMT
        }</span>
    <span>อำเภอ ${e.layer.feature.properties.AMP_NAMT}</span>
    <span>จังหวัด ${e.layer.feature.properties.PROV_NAMT}</span><div>พื้นที่ ${
          e.layer.feature.properties.AREA / 1600
        } ไร่</div>`;
      });
    });

  //Amphoe geojson
  await fetch("./geojson/AMPHOE.geojson")
    .then((res) => res.json())
    .then((data) => {
      const amphoe = L.geoJSON(data.features, {
        color: "red",
      });
      layerControl.addOverlay(amphoe, "Amphoe");
      amphoe.on("click", async (e) => {
        let layerCenter = await e.layer.getCenter();
        await amphoe.resetStyle();
        await e.layer.setStyle({ fillColor: "#0000FF" });
        await map.flyTo([layerCenter.lat, layerCenter.lng], 11);
        let center = await map.getCenter();
        document.querySelector(".current-center").innerHTML = `${center.lat},
  ${center.lng}`;
        document.querySelector(".amphoe-detail").innerHTML = `
    <span>อำเภอ ${e.layer.feature.properties.AMP_NAMT}</span>
    <span>จังหวัด ${e.layer.feature.properties.PROV_NAMT}</span><div>พื้นที่ ${
          e.layer.feature.properties.AREA / 1600
        } ไร่</div>`;
      });
    });
};

getGeojson();
