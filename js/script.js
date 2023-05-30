const apiKey = 'bcb20e39ddcf7f7a39ba4aa9fa2505ec';
const iconUrl = `https://openweathermap.org/img/wn/`;


const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    resetEverything();

    const searchedCity = document.querySelector('input');
    const city = searchedCity.value;
    const forecastOptions = document.querySelector('#forecastOptions');
    const forecastValue = forecastOptions.value;

    const cityUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    form.reset();


    fetch(cityUrl)
        .then(response => {
            if (response.ok) {
                containerDiv.style.display = 'block';
                return response.json();
            }
            else {
                throw 'The given city does not exist! Make sure you wrote it correct!';
            }
        })
        .then(city => {
            const cityUrlWithCoords = `https://api.openweathermap.org/data/2.5/weather?lat=${city[0].lat}&lon=${city[0].lon}&appid=${apiKey}&units=metric`;
            return fetch(cityUrlWithCoords);
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw 'The given city does not exist! Make sure you wrote it correct!';
            }
        })
        .then(city => {
            displayWeather(city);
            changeBackground(city);
        })
        .catch(handleError);


    fetch(forecastUrl)
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
        pForecast.append(weatherIcon);

        divForEveryForecast.append(pForecast);
        forecastDiv.append(divForEveryForecast);



        forecastCount++;

    }


}



//arrays with photos about different weather conditions
const fewClouds = ['./img/fewClouds/fewClouds.jpg', './img/fewClouds/fewClouds1.jpg', './img/fewClouds/fewClouds2.jpg'];
const clouds = ['./img/clouds/overcast.jpg', './img/clouds/clouds.jpg'];
const rain = ['./img/rain/rain.jpg', './img/rain/rain1.jpg', './img/rain/rain2.jpg', './img/rain/rain3.jpg'];
const sun = ['./img/sunny/sunny.jpg', './img/sunny/sunny1.jpg', './img/sunny/sunny2.jpg', './img/sunny/sunny3.jpg'];
const night = ['./img/night/night.jpg', './img/night/night1.jpg', './img/night/night2.jpg'];
const thunderstorm = ['./img/thunderstorm/thunderstorm1.jpg', './img/thunderstorm/thunderstorm2.jpg'];

//it returns a random image from a given array
function generateRandomBg(array) {
    return Math.floor(Math.random() * array.length);
}



//changing the background based on the current weather of the given city (rain background if it is raining etc)
//also changing the background based on if the time is after sunset or before sunset
//after sunset the background image is dark
//the photos are random from different arrays
function changeBackground(city) {

    const randomFewCloudsImg = generateRandomBg(fewClouds);
    const randomCloudsImg = generateRandomBg(clouds);
    const randomRainImg = generateRandomBg(rain);
    const randomSunnyImg = generateRandomBg(sun);
    const randomNightImg = generateRandomBg(night);
    const randomThunderImg = generateRandomBg(thunderstorm);

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
        else if (weatherDescription === "thunderstorm"){
            document.body.style.backgroundImage = 'url(' + thunderstorm[randomThunderImg] + ')';
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
    //console.log(error);

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


