<script>
    import Map from '../components/Map.svelte'
    import {onMount} from 'svelte';
    import request from 'superagent'
    import {INFLUXDB_URI} from '../config'
    import {profile} from '../stores'

    let gpsData = {}
    let interval = "2h"

    // called when new data are received
    function onGpsData(data) {
        let newData = {}

        // in case response has wrong format
        if (!data.body.results || data.body.results.length  != 1) {
            gpsData = newData;
            return gpsData
        }

        // in case no data are returned
        if (!data.body.results[0].series) {
            gpsData = newData;
            return gpsData
        }

        // column names - needed to fetch indexes
        let cols = data.body.results[0].series[0].columns;

        // values - array of arrays indexed by column indexes
        let vals = data.body.results[0].series[0].values;

        // prepare indexes of important fields
        const nameIx = cols.indexOf("name")
        const latIx = cols.indexOf("lat")
        const lngIx = cols.indexOf("lng")
        const satIx = cols.indexOf("sat")
        const timeIx = cols.indexOf("time")

        // loop through all received measurements
        for (let i = 0; i < vals.length; i++) {

            // filter out data that are not acceptable - latitude
            if (vals[i][latIx] > 51.5176011 || vals[i][latIx] < 47.3261325) {
                console.log('filter out lat', vals[i][latIx])
                continue;
            }
            // filter out data that are not acceptable - longitude
            if (vals[i][lngIx] < 11.5089169 || vals[i][lngIx] > 22.2096006) {
                console.log('filter out lng', vals[i][lngIx])
                continue;
            }

            let name = vals[i][nameIx]

            // create new device entry if doesn't exist
            if (!newData[name]) {
                newData[name] = {
                    name,
                    locs: [],
                    time: [],
                    sat: []
                }
            }
            let rec = newData[name];
            rec.locs.push([vals[i][latIx], vals[i][lngIx]])
            rec.time.push(vals[i][timeIx])
            rec.sat.push(vals[i][satIx])
        }
        gpsData = newData;
    }

    async function fetchData() {
        try {
            let query = 'SELECT * FROM "location" WHERE "sat"<101 AND "sat">3'

            if (interval != "all") {
                query += ' AND time > now() - ' + interval;
            }

            // get org
            let org = $profile.orgs[$profile.org_ix];

            let resp = await request
                .get(INFLUXDB_URI + "query")
                .query({"db": org.influxdb})
                .query({"epoch": "s"})   // get unix time stamps instead of RFC string
                //.query({"q": 'SELECT * FROM "location" WHERE "sat"<30 AND "sat">2'})
                .query({"q": query})
                .auth(org.influxdb_username, org.influxdb_password);

            onGpsData(resp)
        } catch(e) {
            console.error(e)
        }
    }

    $: onMount(() => {
        fetchData()
    });

    function onIntervalChange() {
        /*
        fetchData();
        */
    }
</script>

<style>

.map {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
}

#time-picker {
    position: absolute;
}

</style>

<!--<h1 class="title">Map</h1> -->

<!--
<select id="time-picker" bind:value={interval} on:change={onIntervalChange}>
    <option value="5m">5min</option>
    <option value="15m">15min</option>
    <option value="30m">30min</option>
    <option value="1h">1h</option>
    <option value="2h">2h</option>
    <option value="5h">5h</option>
    <option value="10h">10h</option>
    <option value="1d">1d</option>
    <option value="5d">5d</option>
    <option value="all">All</option>
</select>
-->

<div class="map">
    <Map gpsData={gpsData}></Map>
</div>
