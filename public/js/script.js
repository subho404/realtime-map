const socket=io();


if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const{latitude,longitude}=position.coords;

        socket.emit('send-location',{latitude, longitude});
    },
    (error)=>{
        console.error(error);
        
    },

    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0,

    }



);
}

const map = L.map('map').setView([23.20,20.2], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; SubhamBiswas'
}).addTo(map);

const markers={};
socket.on('all-locations', (locations) => {
    Object.values(locations).forEach(({ id, latitude, longitude }) => {
        if (!markers[id]) {
            markers[id] = L.marker([latitude, longitude]).addTo(map);
        }
    });
});
socket.on('receive-location',(data)=>{
    const {id, latitude, longitude} = data;

    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }else{
        markers[id]=L.marker([latitude, longitude]).addTo(map)
    }
})
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})