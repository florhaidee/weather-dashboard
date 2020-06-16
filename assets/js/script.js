var cities = JSON.parse(localStorage.getItem('city')) || [];
var appiKey = '03f2177cf8e0cdeb9ef1461248689ebd'
//function to display UV index
var getUvIndex = function(data){
    aux = data.value
    if(aux <=2.99){
        $("#current-weather").append("<p class='card-text'> UV Index: <span class='low'>" + data.value + "</span><p/>");
    }else if (aux <=5.99){
        $("#current-weather").append("<p class='card-text'> UV Index: <span class='moderate'>" + data.value + "</span><p/>");          
    }else if(aux <=7.99){
        $("#current-weather").append("<p class='card-text'> UV Index: <span class='high'>" + data.value + "</span><p/>");
    }else if (aux <=10.99){
        $("#current-weather").append("<p class='card-text'> UV Index: <span class='very-high'>" + data.value + "</span><p/>");
    }else if(aux >= 11){
        $("#current-weather").append("<p class='card-text'> UV Index: <span class='extreme'>" + data.value + "</span><p/>");
    }
}
//Display Current weather
var currentWeather = function(data){
    console.log(data);
    var Name = data.name;
    var day = moment().format("L")
    var icon = data.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
    var temp = $("#temp").text("Temperature: " + data.main.temp + "°F");
    var hum = $("#humidity").text("Humidity: " + data.main.humidity + "%");
    var wind = $("#wind").text("Wind Speed: " + data.wind.speed + " MPH");
    $("#current-weather").html(`<h2 class='card-title title'>${Name} <span> ${day} <img src=${iconUrl}></span></h2>`)
    $("#current-weather h2").after(temp, hum, wind)
}
//display 5 days forecast
var displayForecast = function(data){
    console.log(data);
    $('#forecast-title h4').text("5-Day Forecast:")
    var x = 4;
    for (var i= 1; i<=5; i++){
        var date = moment().add(i,'day').format('L');
        var icon = data.list[x].weather[0].icon;
        var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        var img = $(`<img id="imgDay"${i}>`)
        img.attr('src',iconUrl)
        var temp= $(`#temp${i}`).text(`Temp: ${data.list[x].main.temp}°F`);
        var hum = $(`#hum${i}`).text(`Humidity: ${data.list[x].main.humidity}%`);
        $(`#day${i}`).html(`<h3 class='card-title'>${date}</h3>`)
        $(`#day${i} h3`).after(img, temp, hum)
        x=x+8;
    }   
}
// function that fetch forecast section
var getForecast =  function(name){
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=imperial&appid=${appiKey}`
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            displayForecast(data)
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
// function that fetch current weather section
var getWeather =  function(apiUrl, name){
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          return response.json();
        } else {
            alert("Please try again. Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect with server");
    })
    .then(function(data) {
        currentWeather(data, data.name)
        getForecast(data.name)
        var lat = data.coord.lat
        var lon = data.coord.lon
        var apiUVurl = `https://api.openweathermap.org/data/2.5/uvi?appid=${appiKey}&lat=${lat}&lon=${lon}`;
        return fetch(apiUVurl);
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        getUvIndex(data)
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        console.log(error,"UV INDEX");
        alert("Unable to connect with server");
    });        
} 
//function to display all cities saved in localStorage
var saveCities = function() {
    $("#cities-list").empty();
    // loop over object properties
    $.each(cities, function (i, city) {
        var name = city.name[0].toUpperCase() + city.name.slice(1).toLowerCase();
        $("#cities-list").append(`<button type="button" class="list-group-item">${name}</button>`)
    });
} 
//function to confirm if a city is already saved on search history.
var validateRepeatCity = function (name) {
    var i=0;
    while(i<cities.length){
        console.log(cities[i].name, name)
        if(cities[i].name.toUpperCase() === name.toUpperCase()){ 
            return true; 
        }
        i++
    }
    return false;
}
// function to display weather for city on history search
var searchHistoryHandler = function (e) {
    e.preventDefault();
    e.target // newly activated tab
    var name = e.target.textContent
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=imperial&APPID=${appiKey}`;
    getWeather(apiUrl);
}
//function to display weather for city submitted on input field.
var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var cityName = $("#city").val().trim();
    $("#city").val("");
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=${appiKey}`;
    if (cityName) {
        getWeather(apiUrl);
        if(cities.length >=1){
            var validate = validateRepeatCity(cityName)
            if( validate === false){
                cityNameOb = { name: cityName}
                cities.push(cityNameOb)
                localStorage.setItem('city', JSON.stringify(cities))
                saveCities();
            }
        }else if(cities.length === 0) {
            cityNameOb = { name: cityName}
            cities.push(cityNameOb)
            localStorage.setItem('city', JSON.stringify(cities))
            saveCities();
        }
    } else {
        alert("Please enter a city");
    }
    $('#cities-list button').on('click', searchHistoryHandler);
};
//function to display current location weather when user load page
var displayPage = function (position) {
    var lat = position.coords.latitude
    var lon = position.coords.longitude
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&APPID=${appiKey}`;
    getWeather(apiUrl);
}
//function to get current user location
var getLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(displayPage);
    } else { 
      alert("Geolocation is not supported by this browser. Please enter a city to display weather");
    }
}
$(function(){
    saveCities();
    $('#cities-list button').on('click', searchHistoryHandler);
    $(".btn").on("click", formSubmitHandler);
});
getLocation();