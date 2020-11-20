//variables
var submitBtn = $(".submit-btn");
var key = "6cf37dfb9a0f723626baf273dac3a69b";
var dateIDcounter = ["0", "1", "2", "3", "4"];
var array = []

submitBtn.click(function (event) {
    event.preventDefault();
    //empty functions to clear out all previous data
    $(".list-group").empty();
    $("#city").empty();
    $("#picture").empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#wind").empty();
    $("#wind").empty();
    $("#uvIndex").empty();
    //saves the value of the input box
    var textBox = $(".input").val();
    // shows previously cities that were searched
    // pushes the value of the input box into an array
    // adds previous searches to the page
    var x = array;
    console.log(x);
    localStorage.setItem("array", JSON.stringify(x))
    for (var i = 0; i < array.length; i++) {
        getHistory = localStorage.getItem('array');
        $(".list-group").append("<button>" + JSON.parse(getHistory)[i] + "</button>");


    }

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + textBox + "&Appid=" + key + "&units=imperial";
    var fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + textBox + "&Appid=" + key + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) { // appends all of the current weather info of the city that was searched for 
            array.push(response.name);
            console.log(array)
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
                .then(function (response) { // adds a class of favorable, moderate, or severe based on the current uv index, while removing the classes of previously searched cities
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

    $.ajax({  // 5 day forecast, data is cleared before being re-initiaized each time the submit button is pressed, I also used the substring function to cut off unnecessary parts of the date that were stored in the API
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
                var date = response.list[((counter + 1) * 8) - 1].dt_txt;
                $("#date" + dateIDcounter[counter]).append(date.substring(0, 10));
                var picture = response.list[((counter + 1) * 8) - 1].weather[0].icon;
                var pictureURL = "https://openweathermap.org/img/wn/" + picture + ".png";
                $("#img" + dateIDcounter[counter]).append("<img src=" + pictureURL + ">");
                $("#temp" + dateIDcounter[counter]).append("<p>" + "Temp: " + Math.floor(response.list[((counter + 1) * 8) - 1].main.temp) + "F" + "</p>");
                $("#hum" + dateIDcounter[counter]).append("<p>" + "Humidity: " + response.list[((counter + 1) * 8) - 1].main.humidity + "%" + "</p>");

            }
        })


})


