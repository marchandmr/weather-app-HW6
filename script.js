var submitBtn = $(".submit-btn");
var key = "6cf37dfb9a0f723626baf273dac3a69b";


submitBtn.click(function () {
    var textBox = $(".input").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + textBox + "&Appid=" + key + "&units=imperial";
    var fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + textBox + "&Appid=" + key + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var picture = response.weather[0].icon;
            var pictureURL = "http://openweathermap.org/img/w/" + picture + ".png";
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var uvIndex = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + key;
            $("#city").append("<h4>" + response.name + "</h4>");
            $("#picture").append("<img src=" + pictureURL + ">");
            $("#temperature").append("<p>" + "temperature: " + Math.floor(response.main.temp) + "</p>");
            $("#humidity").append("<p>" + "humidity: " + response.main.humidity + "%" + "</p>");
            $("#wind").append("<p>" + "wind speed: " + response.wind.speed + " mph" + "</p>");

            $.ajax({
                url: uvIndex,
                method: "GET"
            })
                .then(function (response) {
                    $("#uvIndex").append("<p>" + "UV Index:  " + response.value + "</p>");

                })
        })

})

