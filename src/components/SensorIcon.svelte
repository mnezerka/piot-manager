<script>
    export let sensorClass = null;

    let iconName = '';

    if (sensorClass == 'temperature') {
        iconName = 'fa-thermometer-half'
    } else if (sensorClass == 'humidity') {
        iconName = 'fa-bath'
    } else if (sensorClass == 'pressure') {
        iconName = 'fa-weight-hanging'
    }
</script>

<span class="fas {iconName}" alt="{sensorClass}"></span>
