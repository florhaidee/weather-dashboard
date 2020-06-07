var dataOb = [];
var getUvIndex = function(url){

}
//Display Current weather
var currentWeather = function(data, name){
    console.log(data);
    var Name = name[0].toUpperCase() + name.slice(1);
    var day = moment().format("L")
    var icon = data.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";
    var temp = $("#temp").text("Temperature: " + data.main.temp + "°F");
    var hum = $("#humidity").text("Humidity: " + data.main.humidity + "%");
    var wind = $("#wind").text("Wind Speed: " + data.wind.speed + " MPH");
    //var uv = getUvIndex(data.coord.lat, dat.coord.lon);
    $("#current-weather").html(`<h2 class='card-title mycard'>${Name} <span> ${day} <img src=${iconUrl}></span></h2>`)
    $("#current-weather h2").after(temp, hum, wind)
}
var getWeather =  function(apiUrl, name){
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            currentWeather(data, name)
        });
        } else {
          alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect with server");
    });
}  
var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var city = $("#city").val().trim();
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=03f2177cf8e0cdeb9ef1461248689ebd`;
    console.log(city);
    if (city) {
        getWeather(apiUrl,city);
        $("#city").val("");
    } else {
        alert("Please enter a city");
    }
};
$(".btn").on("click", formSubmitHandler);
