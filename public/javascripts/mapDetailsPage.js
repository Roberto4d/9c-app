mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: trainer.geometry.coordinates, // starting position [lng, lat]
zoom: 9, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(trainer.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(`<h3>${trainer.firstName}</h3><p>${trainer.location}</p>`)
        )
    .addTo(map)