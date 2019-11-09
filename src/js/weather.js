import './general';

//http://api.openweathermap.org/data/2.5/forecast?zip=97405&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646
//https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1331161200&key=AIzaSyC7QBEyXbpXf53jPvM4lXfgXEHD5caa61A

/* Create a class called Weather
- Part 1 - Retrieve the weather information when the user clicks the buttobn
  - Create the constructor
    - initialize instance variables for the "state" of the app and the ajax call
        this.state = {
          zipcode: "",
          city: {},
          forecast: [],
          simpleForecast: [], 
          selectedDate: null
        };
        this.url = "http://api.openweathermap.org/data/2.5/forecast?zip=";
        this.apikey = "&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646";
        this.googleApiKey = "AIzaSyC1HTCZ6mUEKFuuLHPLdE1zM2_Q7j0vxhk";
        this.googleMapsUrl = "https://maps.googleapis.com/maps/api/timezone/json?location=";
    - initialize instance variables for UI elements
        the form
        the zipcode input element
        the weather list div
        the current day div
    - write the stub of a method onFormSubmit
    - bind the class to onFormSubmit
    - add a submit handler to the form that calls onFormSubmit
  - Write the first version of the method onFormSubmit.  It should
    - prevent the form from being sumbitted to the server
    - get the zip code from the UI and put it in a variable
    - call fetch with the url zipcode and apikey for openweathermap
      - when the response comes back THEN parse the json
      - when that finishes THEN 
        - set the city in the state object
        - set the forecast in the state object
        - set the selectedDate to null
        - clear the zipcode from the UI
        - console.log the forecast and make sure that your ajax call works
  - Don't forget to instantiate the a weather object!
END OF PART 1 - TEST AND DEBUG YOUR APP
- Part 2 - Add a second ajax call to google maps to get timezone information
  for the zipcode.  The dates in the weather information are GMT.  You want
  to translate them to the timezone for the zipcode the user entered.
  - Edit the method onFormSubmit
      - replace the console.log of the forecast (the original weather data)
        with an additional call to fetch
        - call fetch with the url for google maps 
        ** fetch(`${this.googleMapsUrl}
                ${this.state.city.coord.lat},${this.state.city.coord.lon}
                &timestamp=${this.state.forecast[0].dt}
                &key=${this.googleApiKey}`) **
          - when the response comes back THEN parse the json
          - when that finishes THEN
            - calculate the timezone offset using the rawOffset and dstOffset from google
              this.state.timezoneOffset =  (data.rawOffset + data.dstOffset) / (60 * 60);
            - set the simpleForecast in the state object by calling parseForecast (bottom of the file)  
              this.state.simpleForecast = this.parseForecast(this.state.forecast, this.state.timezoneOffset);
            - console.log the simpleForecast 
END OF PART 2 - TEST AND DEBUG YOUR APP
- Part 3 - Write the first version of method renderWeatherList.  It writes the simpleForecast data to the page
  - Write a stub of renderWeatherListItem.  This method returns a template literal containing the html 
    for the weather for ONE day.  It gets called in renderWeatherList.  It has 2 parameters a 
    forecastDay and an index.  The forecastDay is a js object from the "parsed" version of the return from the weather api.
    - in the body of the method console.log both the forecastDay and the index
  - Write a sub of renderWeatherList.  It has forecastDays (which is 5 element simplified forcast array) 
    as a parameter.
    - in the body of the method console.log the value of forecastDays.
  - Edit the constructor to bind the class to the method renderWeatherList
  - call renderWeatherList in onFormSubmit after both ajax calls have completed and the forecast data
    has been parsed.  Pass this.state.simpleForecast as a parameter.
END OF PART 3 - TEST AND DEBUG YOUR APP
- Part 4 - Format ONE weather list item and the weather list as a whole
  - Edit the body of the method renderWeatherListItem
    - Format the weather information for one day on the html page.  At a minimum it should include
      - the month and day as well as the weekday
      - the high and low temperatures for that day
      - the element should be styled with weather-list-item as well
    - CUT the html for ONE day from your html page into the body of your method.
      - Enclose the html in ``.
      - Replace the hardcoded month and day, weekday, high and low temperatures 
        with template strings that use the properties of the forecastDay object
      - Return the template literal 
  - Edit the body of the method renderWeather list.  It should
    - Create the html for each of the weather list items.  Use the array method map to do this.
      const itemsHTML = forecastDays.map((forecastDay, index) => this.renderWeatherListItem(forecastDay, index)).join('');
    - Set the inner html of the weatherList element on the page to 
      - a div element styled with weather-list flex-parent
      - that contains the itemsHTML from above
END OF PART 4 - TEST AND DEBUG YOUR APP
- Part 5 - Display weather details when the user clicks one weather list item
  - Write the method renderCurrentDay.  It takes the index of the day as it's parameter.
    - Format the detailed weather information for the selected day on the html page. Include at least
      - identifying information for the city as well as the date
      - description and icon for the weather
      - temperatures throughout the day
      - humidity and wind information
    - CUT the html for the weather details and paste it into the body of your method
      - Enclose the html in ``.
      - Replace the hardcoded text with data.  The data is in the state instance variable.
      - Set the innerhtml property of the currentDay element on the page
  - Add a click event handler to each of the weather list items 
    - add a loop to the end of the renderWeatherList method that adds the event handler
    - you'll have to bind the method renderCurrentDay to both the class and the index of the item
      forecastElements[i].onclick = this.renderCurrentDay.bind(this, i)
  - Write the method clearCurrentDay.  It sets the inner html property of the currentDay element to ""
  - Call clearCurrentDay at the end of onFormSubmit where you clear the zipcode.  
END OF PART 5 - TEST AND DEBUG YOUR APP
*/



/*
  getIndexOfMidnight(firstDate, timezoneOffset) {
    let dt = firstDate * 1000;
    let date = new Date(dt);
    let utcHours = date.getUTCHours();
    let localHours = utcHours + timezoneOffset;
    let firstMidnightIndex = (localHours > 2 ) ? 
        Math.round((24 - localHours)/3) : 
        Math.abs(Math.round(localHours / 3));
    return firstMidnightIndex;
  }

  findMinTemp(forecast, indexOfMidnight) {
    let min = forecast[indexOfMidnight].main.temp_min;
    for (let i = indexOfMidnight + 1; i < indexOfMidnight + 8; i++)
      if (forecast[i].main.temp_min < min)
        min = forecast[i].main.temp_min;
    return min;
  }

  findMaxTemp(forecast, indexOfMidnight) {
    let max = forecast[indexOfMidnight].main.temp_max;
    for (let i = indexOfMidnight + 1; i < indexOfMidnight + 8; i++)
      if (forecast[i].main.temp_max > max)
        max = forecast[i].main.temp_max;
    return max;
  }

  parseForecast(forecast, timezoneOffset) {
    let simpleForecast = new Array();
    const MIDNIGHT = this.getIndexOfMidnight(forecast[0].dt, timezoneOffset);
    const NOON = 4;
    const SIXAM = 2;
    const SIXPM = 6;
    const NINEPM = 7;
    const MORNING = SIXAM;
    const DAY = NOON;
    const EVENING = SIXPM;
    const NIGHT = NINEPM;
    const PERDAY = 8;
    const DAYS = 4;
    for (let i = MIDNIGHT; i < forecast.length - NINEPM; i+=PERDAY) {
      let oneDay = new Object();
      oneDay.dt = forecast[i + NOON].dt;
      oneDay.temp = forecast[i + NOON].main.temp;
      oneDay.minTemp = this.findMinTemp(forecast, i);
      oneDay.maxTemp = this.findMaxTemp(forecast, i);
      oneDay.morningTemp = forecast[i + MORNING].main.temp;
      oneDay.dayTemp = forecast[i + DAY].main.temp;
      oneDay.eveningTemp = forecast[i + EVENING].main.temp;
      oneDay.nightTemp = forecast[i + NIGHT].main.temp;
      oneDay.description = forecast[i + NOON].weather[0].description;
      oneDay.icon = 
      oneDay.pressure = 
      oneDay.wind = 
      oneDay.humidity = 
      simpleForecast.push(oneDay);
    }
    return simpleForecast;
  }

*/
