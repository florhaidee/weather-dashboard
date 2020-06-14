var dataOb = []
var appiKey = '03f2177cf8e0cdeb9ef1461248689ebd'
//function to display UV index
var getUvIndex = function(data){
    aux = data.value
    console.log(aux);
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
var currentWeather = function(data, name){
    console.log(data);
    var Name = name[0].toUpperCase() + name.slice(1);
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
        currentWeather(data, name)
        var lat = data.coord.lat
        var lon = data.coord.lon
        console.log(lat, "lat:", typeof(lat))
        console.log("lon:", typeof(lon));
        var apiUVurl = 'http://api.openweathermap.org/data/2.5/uvi?appid='+ appiKey +'&lat='+lat+'&lon='+lon;
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
var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var city = $("#city").val().trim();
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${appiKey}`;
    console.log(city);
    if (city) {
        getWeather(apiUrl,city);
        getForecast(city);
        $("#city").val("");
    } else {
        alert("Please enter a city");
    }
};
$(".btn").on("click", formSubmitHandler);
