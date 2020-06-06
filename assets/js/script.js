var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var city = $("#city").val().trim();
    console.log(city);
    if (city) {
    //getCityId(city);
    $("#city").val("");
    } else {
    alert("Please enter a city");
    }
};
$(".btn").on("click", formSubmitHandler);