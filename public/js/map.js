    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID  Location DELHI    Latitude  28.70405920    Longitude  77.10249020  
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [77.10249020  , 28.70405920], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });



