
<script>
    /*
    Marker SVG Icons based on: https://github.com/danwild/leaflet-fa-markers
    */

    import L from 'leaflet';
    import {onMount, getContext} from 'svelte';
    import 'leaflet/dist/leaflet.css';
    import '../lib/FontAwsomeIcon.js';

    export let center = [49.2202194, 16.5558572];
    export let zoom = 12;
    export let gpsData = {};

    let mapContainer;
    let leafletMap = null;
    let leafletLegendDiv = null;
    let leafletLegend = null;
    let leafletMarkers = null;

    // attributes to be added to map as static text
    var osmAttr = '&copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
    var mapyCzAttr = '&copy; <a href="https://www.seznam.cz/" target="_blank">Seznam.cz, a.s</a>, ' + osmAttr;

    function formatDate(d) {
        return ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
            d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    }

    function getDeviceColor(devId, devIx) {
        const colors = [
            "orange",
            "violet",
            "white",
            "yellow"
        ]

        let result = colors[devIx];

        // static color assignments
        if (devId == "VDBCKPY") {
            result = "red"
        } else if (devId == "VDBCKPW") {
            result = "green"
        } else if (devId == "VDBCKPX") {
            result = "blue"
        }

        return result;
    }

    onMount(() => {
        leafletMap = L.map(mapContainer, {
            svgSprite: false,
            zoomControl: true,
            center: center,
            zoom: zoom
        });

        // legend control + div for rendering content
        leafletLegendDiv = L.DomUtil.create('div', 'info legend');
        leafletLegend = L.control({position: 'bottomleft'});
        leafletLegend.onAdd = function (map) {
            return leafletLegendDiv;
        };
        leafletLegend.addTo(leafletMap);

        //leafletLegendDiv.innerHTML = '<div class="map-legend">Hello</div>';

        // tile layer - mapy.cz tourist map
        L.tileLayer('https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}', {
            attribution: mapyCzAttr,
            minZoom: 2,
            maxZoom: 20,
            maxNativeZoom: 18,
            id: 'mapycz',
            tileSize: 256
        }).addTo(leafletMap);

        leafletMarkers = L.layerGroup().addTo(leafletMap);

        resize();
    });

    const resize = () => {
        // mapContainer.style.height = `${window.innerHeight - headerHeight}px`;
        leafletMap.invalidateSize();
    };

    // draw markers
    $: {
        //console.log("here we are", leafletMap, gpsData);

        if (leafletMap) {

            let boundLocs = [];

            // remove all previous marks
            leafletMarkers.clearLayers();

            // clear legend
            leafletLegendDiv.innerHTML = '';

            // loop through all devices
            let devIx = 0;
            for (let dev in gpsData) {
                let locs = gpsData[dev].locs;

                // get color for the device
                let color = getDeviceColor(dev, devIx)

                for (let i = 0; i < locs.length; i++) {

                    let d = new Date(gpsData[dev].time[i] * 1000)
                    let dateStr = formatDate(d)

                    let sats = gpsData[dev].sat[i];

                    // popup title for marker and circles

                    let title = "ID: " + dev + ", sat: " + sats + ", time: " + dateStr;

                    // add marker for last position
                    if (i == locs.length -1) {

                        // new marker icon
                        let icon = L.icon.fontAwesome({
                                iconClasses: "fa fa-crosshairs", // you _could_ add other icon classes, not tested.
                                // marker/background style
                                markerColor: color,
                                markerFillOpacity: i == locs.length -1 ? 1 : 0.1,
                                markerStrokeWidth: 1,
                                markerStrokeColor: "grey",
                                // icon style
                                iconColor: "#FFF"
                            })

                        // add marker to map together with popup
                        let marker = L.marker(
                            locs[i],
                            {
                                icon: icon,
                                title
                            }
                        ).bindPopup(title).addTo(leafletMarkers);
                    } else {
                        // add circle for all positions except last one
                        let dot = L.circle(locs[i], {radius: 10, color: sats === 100 ? "blue": "green"}).bindPopup(title).addTo(leafletMarkers);
                    }

                    boundLocs.push(L.latLng(locs[i][0], locs[i][1]));
                }
                let polyline = L.polyline(locs, {color}).addTo(leafletMarkers);

                // add entry to legend
                leafletLegendDiv.innerHTML += '<div class="device-legend"><i style="background:' + color + '"></i>&nbsp;' + dev;

                devIx++;
            }


            if (boundLocs.length > 0) {
                /*let corner1 = L.latLng(40.712, -74.227);
                let corner2 = L.latLng(40.774, -74.125);
                bounds = L.latLngBounds(corner1, corner2);*/
                let bounds = L.latLngBounds(boundLocs)
                leafletMap.fitBounds(bounds);
            }
        }

    }

</script>

<style>
.map {
   height: 100%;
   width: 100%;
}
</style>


<svelte:window on:resize="{resize}" />

<div class="map" bind:this="{mapContainer}">
    <slot></slot>
</div>


