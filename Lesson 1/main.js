var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.arc(95, 50, 40, 0, 2 * Math.PI);
ctx.stroke();

var x = document.getElementById("demo")

function getLocation() {
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition);
	}
	else{
		x.innerHTML = "Geolocation is not supported by this browswer.";
	}
}

function showPosition(position){
	x.innerHTML = "Latitude: " + position.coords.latitude + 
	"<br>Longitude: " + position.coords.longitude;
}

getLocation();
showPosition(position);



function setValues(){
	localStorage.setItem("First name:", "user")
}