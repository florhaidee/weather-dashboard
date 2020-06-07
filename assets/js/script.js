var currentWeather = function(data){
    console.log(typeof(data));
}
var getWeather =  function(name){
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&APPID=03f2177cf8e0cdeb9ef1461248689ebd`;
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            console.log(data)
            currentWeather(data);
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
    console.log(city);
    if (city) {
    getWeather(city);
    $("#city").val("");
    } else {
    alert("Please enter a city");
    }
};
$(".btn").on("click", formSubmitHandler);
