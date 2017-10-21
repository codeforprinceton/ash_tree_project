
/**
getCurrentPosition() accepts 3 arguments:
a success callback (required), an error callback (optional), and a set of options (optional)
**/
 
var options = {
// enableHighAccuracy = should the device take extra time or power to return a really accurate result, or should it give you the quick (but less accurate) answer?  
   enableHighAccuracy: false, 
// timeout = how long does the device have, in milliseconds to return a result?
   timeout: 5000,  
// maximumAge = maximum age for a possible previously-cached position. 0 = must return the current position, not a prior cached position
   maximumAge: 0 
};
 
// call getCurrentPosition()
navigator.geolocation.getCurrentPosition(success, error, options); 
 
// upon success, do this
function success(pos){
// get longitude and latitude from the position object passed in
   var lng = pos.coords.longitude;
   var lat = pos.coords.latitude;
// and presto, we have the device's location! Let's just alert it for now... 
   alert("You appear to be at longitude: " + lng + " and latitude: " + lat);
}
 
// upon error, do this
function error(err){
   alert('Error: ' + err + ' :('); // alert the error message
}
 
