const apiKey = 'bcb20e39ddcf7f7a39ba4aa9fa2505ec';
const iconUrl = `https://openweathermap.org/img/wn/`;


const form = document.querySelector('form');

//event listener to the form
//the form is text input where the user tyes the city 
//and option values for the forecast every X hours
form.addEventListener('submit', function (event) {
    event.preventDefault();
    resetEverything();

    const searchedCity = document.querySelector('input');
    const city = searchedCity.value;
    const forecastOptions = document.querySelector('#forecastOptions');
    const forecastValue = forecastOptions.value;

    const cityApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    form.reset();

    //fetching the api url based on the given city
    //taking the latitude and longitude from the city data 
    //and fetch the api url for the current weather in the specific coord (lat and lon)
    //if something doesn't happen as it is planned, for example writting a city that does not exist
    //then it catches it and throws an error message
    //also checking if the lat is being accessed, otherwise throws error message
    fetch(cityApiUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw 'The given city does not exist! Make sure you wrote it correct!';
            }
        })
        .then(city => {
            if (city && city[0] && city[0].lat) {
                const cityUrlWithCoords = `https://api.openweathermap.org/data/2.5/weather?lat=${city[0].lat}&lon=${city[0].lon}&appid=${apiKey}&units=metric`;
                fetch(cityUrlWithCoords)
                    .then(response => {
                        if (response.ok) {
                            containerDiv.style.display = 'block';
                            return response.json();
                        } else {
                            throw 'The given city does not exist! Make sure you wrote it correct!';
                        }
                    })
                    .then(city => {
                        displayWeather(city);
                        changeBackground(city);
                    })
            }
            else {
                throw 'The given city does not exist! Make sure you wrote it correctly!';
            }


        })
        .catch(handleError);


    //fetching the forecast api url
    //if everything is fine it responses with json
    //if something unexpected happens then it throws an error message
    fetch(forecastApiUrl)
        .then(response => {
            if (response.ok) {
                forecastDiv.style.display = 'block';

                return response.json();
            }
            else {
                throw 'The given city does not exist! Make sure you wrote it correct!';
            }
        })
        .then(city => {
            displayForecast(city, forecastValue);
        })
        .catch(handleError);


})


const containerDiv = document.querySelector('#container');
const h2CityName = document.querySelector('h2');
const pCityPrognos = document.querySelector('#cityPrognos');
const pWind = document.querySelector('#wind');
const img = document.querySelector('img');

//based on the given city (parameter city) the function shows the weather info
//info such like temperature in Celsius degrees, wind speed, description and icon
//Rounds the temperature to the nearest number
//windSpeed is converting the wind speed value to a string representation with two decimal places.
function displayWeather(city) {

    containerDiv.append(h2CityName, pCityPrognos, pWind, img);

    let celsius = Math.round((city.main.temp));
    let windSpeed = city.wind.speed;
    windSpeed = windSpeed.toFixed(2);
    let weatherDescription = city.weather[0].description;
    weatherDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

    h2CityName.innerText = city.name + ', ' + city.sys.country;
    pCityPrognos.innerText = weatherDescription + ' ' + celsius + '°';
    pWind.innerText = 'Wind: ' + windSpeed + ' m/s';
    img.src = iconUrl + city.weather[0].icon + '.png';
}






const forecastDiv = document.querySelector('#forecast');
//displaying the forecast and presenting it by creating div and paragraph
//the loop stops when the desired number of forecast entries (forecastValue) is reached or when there are no more forecast entries
//the function iterates through the forecast data and creates HTML elements for each forecast
function displayForecast(city, forecastValue) {

    const cityList = city.list;
    let forecastCount = 0;
    for (let i = 1; i < forecastValue && forecastCount < forecastValue / 3; i++) {

        const pForecast = document.createElement('p');
        const divForEveryForecast = document.createElement('div');
        let celsius = Math.round(cityList[i].main.temp);
        const weatherIcon = document.createElement('img');
        weatherIcon.src = iconUrl + cityList[i].weather[0].icon + '.png';

        pForecast.innerText = `${cityList[i].dt_txt.slice(11, -3)} ${cityList[i].weather[0].description} ${celsius}°`;
        pForecast.classList.add('forecastP');
        pForecast.append(weatherIcon);

        divForEveryForecast.append(pForecast);
        forecastDiv.append(divForEveryForecast);


        forecastCount++;

    }


}



//arrays with photos about different weather conditions
const fewClouds = ['./img/fewClouds/fewClouds.jpg', './img/fewClouds/fewClouds1.jpg', './img/fewClouds/fewClouds2.jpg', './img/fewClouds/fewClouds3.jpg', './img/fewClouds/fewClouds4.jpg'];
const clouds = ['./img/clouds/overcast.jpg', './img/clouds/clouds.jpg', './img/clouds/clouds1.jpg', './img/clouds/clouds2.jpg', './img/clouds/clouds3.jpg'];
const rain = ['./img/rain/rain.jpg', './img/rain/rain1.jpg', './img/rain/rain2.jpg', './img/rain/rain3.jpg', './img/rain/rain4.jpg'];
const sun = ['./img/sunny/sunny.jpg', './img/sunny/sunny1.jpg', './img/sunny/sunny2.jpg', './img/sunny/sunny3.jpg', './img/sunny/sunny4.jpg', './img/sunny/sunny5.jpg', './img/sunny/sunny6.jpg', './img/sunny/sunny7.jpg', './img/sunny/sunny8.jpg'];
const night = ['./img/night/night.jpg', './img/night/night1.jpg', './img/night/night2.jpg', './img/night/night3.jpg'];
const thunderstorm = ['./img/thunderstorm/thunderstorm1.jpg', './img/thunderstorm/thunderstorm2.jpg', './img/thunderstorm/thunderstorm3.jpg'];
const mist = ['./img/misty/misty.jpg', './img/misty/misty1.jpg', './img/misty/misty2.jpg', './img/misty/misty3.jpg'];
const snow = ['./img/snow/snow.jpg', './img/snow/snow1.jpg', './img/snow/snow2.jpg', './img/snow/snow3.jpg', './img/snow/snow4.jpg'];

//it returns a random image from a given array
function generateRandomBg(array) {
    return Math.floor(Math.random() * array.length);
}



//changing the background based on the current weather of the given city (rain background if it is raining etc)
//also changing the background based on if the time is after sunset or before sunset
//after sunset the background image is a random night photo
//the photos are random from different arrays
function changeBackground(city) {

    const randomFewCloudsImg = generateRandomBg(fewClouds);
    const randomCloudsImg = generateRandomBg(clouds);
    const randomRainImg = generateRandomBg(rain);
    const randomSunnyImg = generateRandomBg(sun);
    const randomNightImg = generateRandomBg(night);
    const randomThunderImg = generateRandomBg(thunderstorm);
    const randomMistyImg = generateRandomBg(mist);

    //getting the current time of the given city from timezone
    const currentTime = new Date().toLocaleTimeString({ timeZone: city.timezone });
    const sunsetTime = city.sys.sunset;
    const sunsetDate = new Date(sunsetTime * 1000);

    const weatherDescription = city.weather[0].description;
    if (currentTime < sunsetDate.toLocaleTimeString({ timeZone: city.timezone })) {
        if (weatherDescription === "broken clouds") {
            document.body.style.backgroundImage = 'url(' + fewClouds[randomFewCloudsImg] + ')';
        }
        else if (weatherDescription === "few clouds") {
            document.body.style.backgroundImage = 'url(' + fewClouds[randomFewCloudsImg] + ')';
        }
        else if (weatherDescription === "overcast clouds") {
            document.body.style.backgroundImage = 'url(' + clouds[randomCloudsImg] + ')';
        }
        else if (weatherDescription === "scattered clouds") {
            document.body.style.backgroundImage = 'url(' + fewClouds[randomFewCloudsImg] + ')';
        }
        else if (weatherDescription === "light rain") {
            document.body.style.backgroundImage = 'url(' + rain[randomRainImg] + ')';
        }
        else if (weatherDescription === "clear sky") {
            document.body.style.backgroundImage = 'url(' + sun[randomSunnyImg] + ')';
        }
        else if (weatherDescription === "thunderstorm") {
            document.body.style.backgroundImage = 'url(' + thunderstorm[randomThunderImg] + ')';
        }
        else if (weatherDescription === "mist") {
            document.body.style.backgroundImage = 'url(' + mist[randomMistyImg] + ')';
        }
        else if (weatherDescription === "snow") {
            document.body.style.backgroundImage = 'url(' + mist[randomMistyImg] + ')';
        }
    }
    else {
        document.body.style.backgroundImage = 'url(' + night[randomNightImg] + ')';
    }

    //adding a class that sets the background image to no-repeat
    document.body.classList.add('changeBg');
}





const divError = document.querySelector('#error');
const pError = document.querySelector('#pError');

function handleError(error) {

    containerDiv.style.display = 'none';
    forecastDiv.style.display = 'none';
    pError.innerText = error;
    divError.style.display = 'block';
}


function resetEverything() {
    h2CityName.innerText = '';
    pCityPrognos.innerText = '';
    pWind.innerText = '';
    img.src = "";
    pError.innerText = '';
    divError.style.display = 'none';
    forecastDiv.innerHTML = '';
}


