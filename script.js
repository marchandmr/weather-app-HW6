var submitBtn = $(".submit-btn");
var key = "6cf37dfb9a0f723626baf273dac3a69b";
var dateIDcounter = ["0", "1", "2", "3", "4"];
var array = [];
submitBtn.click(function (event) {
    event.preventDefault();
    $("#city").empty();
    $("#picture").empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#wind").empty();
    $("#wind").empty();
    $("#uvIndex").empty();
    var textBox = $(".input").val();
    array.push(textBox);
    console.log(array);
    localStorage.setItem("textBox", JSON.stringify(textBox));
    var get = JSON.parse(localStorage.getItem("textBox"));
    $(".list-group").append("<li>" + get + "</li>");

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
            $("#city").append("<h4>" + response.name + " " + "(" + (moment().format('MM-DD-YYYY')) + ")" + "</h4>");
            $("#picture").append("<img src=" + pictureURL + ">");
            $("#temperature").append("<p>" + "temperature: " + Math.floor(response.main.temp) + " F" + "</p>");
            $("#humidity").append("<p>" + "humidity: " + response.main.humidity + "%" + "</p>");
            $("#wind").append("<p>" + "wind speed: " + response.wind.speed + " mph" + "</p>");

            $.ajax({
                url: uvIndex,
                method: "GET"
            })
                .then(function (response) {
                    $("#uvIndex").removeClass("favorable");
                    $("#uvIndex").removeClass("moderate");
                    $("#uvIndex").removeClass("severe");
                    $("#uvIndex").append("<p>" + "UV Index:  " + response.value + "</p>");
                    var uv = response.value;
                    if (uv > 0 && uv <= 2) {
                        $("#uvIndex").addClass("favorable")
                    }
                    else if (uv > 3 && uv <= 5.9) {
                        $("#uvIndex").addClass("moderate")
                    }
                    else {
                        $("#uvIndex").addClass("severe")
                    };

                })
        })

    $.ajax({
        url: fiveDay,
        method: "GET"
    })
        .then(function (response) {

            console.log(fiveDay)
            for (var counter = 0; counter < dateIDcounter.length; counter++) {
                $("#date" + dateIDcounter[counter]).empty();
                $("#img" + dateIDcounter[counter]).empty();
                $("#temp" + dateIDcounter[counter]).empty();
                $("#hum" + dateIDcounter[counter]).empty();
                $("#date" + dateIDcounter[counter]).append(response.list[((counter + 1) * 8) - 1].dt_txt);
                var picture = response.list[((counter + 1) * 8) - 1].weather[0].icon;
                var pictureURL = "https://openweathermap.org/img/wn/" + picture + ".png";
                $("#img" + dateIDcounter[counter]).append("<img src=" + pictureURL + ">");
                $("#temp" + dateIDcounter[counter]).append("<p>" + "Temp: " + Math.floor(response.list[((counter + 1) * 8) - 1].main.temp) + "F" + "</p>");
                $("#hum" + dateIDcounter[counter]).append("<p>" + "Humidity: " + response.list[((counter + 1) * 8) - 1].main.humidity + "%" + "</p>");

            }
        })


})


