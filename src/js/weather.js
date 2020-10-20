// same as previous lab
import './general';

// my ES6 modules export functions that you need
// getLocation is the ONLY export (default) from googleMaps.js
import getLocation from './googleMaps';
// getWeekday and getDate are named exports (functions) from dates.js
import { getWeekday, getDate } from './dates';
import { event } from 'jquery';

// sample openweathermap api call
//https://api.openweathermap.org/data/2.5/onecall?lat=43.9698&lon=-123.2006&exclude=minutely,hourly,current&units=imperial&appid=3fca0a11ad63bd24761e381b964b5ae9


/* Create a class called Weather*/
/*- Part 1 - Retrieve the lat and lng for zipcode when the user clicks the button
  - Create the constructor
    - initialize instance variables for the "state" of the app and the ajax call
        this.state = {
          zipcode: "",
          city: {},
          forecast: [], 
          selectedDate: null
        };
        this.url = "https://api.openweathermap.org/data/2.5/onecall?";
        this.apikey = "&exclude=minutely,hourly,current&units=imperial&appid=3fca0a11ad63bd24761e381b964b5ae9";
    - initialize instance variables for UI elements
        the form
        the zipcode input element
        the weather list div
        the current day div
    - write the stub of a method onFormSubmit
    - bind the class to onFormSubmit
    - add a submit handler to the form that calls onFormSubmit*/
class Weather {

  constructor() {
    this.state = {
      zipcode: "",
      city: {},
      forecast: [],
      selectedDate: null
    };

    this.url = "https://api.openweathermap.org/data/2.5/onecall?";
    this.apikey = "&exclude=minutely,hourly,current&units=imperial&appid=b60f3e43cd09edb1dee89e759d2a4049";
    this.form = document.querySelector('#zipForm');
    this.zipcode = document.querySelector('#zipcode').value; //gets user input
    this.weather = document.querySelector('#weatherList');
    this.currentDay = document.querySelector('#currentDay');
    this.renderWeatherList = this.renderWeatherList.bind(this);

    document.getElementById('zipForm').onsubmit = this.onFormSubmit.bind(this);
  }

  /*- Write the first version of the method onFormSubmit.  It should
  - prevent the form from being sumbitted to the server
  - get the zip code from the UI and put it in a variable
  - call getLocation (from googleMaps.js).  It is an async call and returns a promise.
    - when the response comes back the response will give you
      city, lat and lng based on the zipcode THEN
      - set the city.name in the state object instance variable
      - set the city.lat in the state object
      - set the city.lng in the state object
      - console.log the state object instance variable
- Don't forget to instantiate the a weather object!
END OF PART 1 - TEST AND DEBUG YOUR APP*/

  /* 
  version 1 (because I take things way too literal sometimes)
  
    onFormSubmit(event) {
      event.preventDefault();
      this.state.zipcode = document.querySelector('#zipcode').value;
      getLocation(this.state.zipcode)
        .then(data => {
          this.state.city.name = data.results[0].address_components[1].long_name;
          this.state.city.lat = data.results[0].geometry.location.lat;
          this.state.city.lng = data.results[0].geometry.location.lng;
          //console.log(this.state.city.name);
        })
        .catch(error => {
          alert("There was a problem getting location information!");
        });
  
    }*/

  /*- Part 2 - Add a second ajax call to openweathermap to get weather information
for the zipcode.  The dates in the weather information are GMT.  You want
to translate them to the timezone for the zipcode the user entered.
- Edit the method onFormSubmit
    - replace the console.log of the state
      with an additional call to fetch
      - call fetch with the url for openweather map
      ** fetch(`${this.url}
        lat=${this.state.city.lat}&lon=${this.state.city.lng}
        ${this.apikey}`) **
        - when the response comes back THEN parse the json
        - when that finishes THEN
          - set the timezoneOffset in the state object instance variable
          - set the forecast (array) in the state object instance variable
          - there may be 8 days - use splice to get rid of the 8th day
          - console.log the forecast
          - clear the zipcode from the UI
END OF PART 2 - TEST AND DEBUG YOUR APP*/

  //edited 2nd version onFormSubmit
  onFormSubmit(event) {
    event.preventDefault();
    this.state.zipcode = document.querySelector('#zipcode').value;
    getLocation(this.state.zipcode)
      .then(data => {
        this.state.city.name = data.results[0].address_components[1].long_name;
        this.state.city.lat = data.results[0].geometry.location.lat;
        this.state.city.lng = data.results[0].geometry.location.lng;
        fetch(`${this.url}lat=${this.state.city.lat}&lon=${this.state.city.lng}${this.apikey}`)
          .then(response => response.json())
          .then(data => {
            this.state.timezoneOffset = data.timezone_offset;
            this.state.forecast = data.daily;
            this.state.forecast.splice(7);
            //console.log(this.state.forecast) //test trash
            this.renderWeatherList(this.state.forecast);
          })
          .catch(error => {
            alert("There was a problem getting weather information!");
            //alert(error.message); //test trash
          });
      })

      .catch(error => {
        alert("There was a problem getting location information!");
        //alert(error.message); //test trash
      });

    //correct clear UI
    document.getElementById("zipcode").value = '';
  }

  /*- Part 3 - Write the first version of method renderWeatherList.  It writes the forecast data to the page
- Write a stub of renderWeatherListItem.  This method returns a template literal containing the html
  for the weather for ONE day.  It gets called in renderWeatherList.  It has 2 parameters a
  forecastDay and an index.  The forecastDay is a js object from the weather api.
  - in the body of the method console.log both the forecastDay and the index
- Write a sub of renderWeatherList.  It has forecastDays (which is 7 element forcast array)
  as a parameter.
  - in the body of the method console.log the value of forecastDays.
- Edit the constructor to bind the class to the method renderWeatherList
- call renderWeatherList in onFormSubmit AFTER BOTH ajax calls have completed.
  Pass this.state.forecast as a parameter.
END OF PART 3 - TEST AND DEBUG YOUR APP*/

  //forcastDays is an array passed in this.state.forecast ~ forecast value is derived from the api call payload
  renderWeatherList(forecastDays) {
    //console.log(forecastDays);//test trash
    //loop?
      const itemsHTML = forecastDays.map((forecastDay, index) => this.renderWeatherListItem(forecastDay, index)).join('');
      document.getElementById("weatherList").innerHTML = itemsHTML;
    

  }

  //edit html and use template literal?//
  /*- Part 4 - Format ONE weather list item and the weather list as a whole
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
  END OF PART 4 - TEST AND DEBUG YOUR APP*/

  renderWeatherListItem(forecastDay, index) {
    //console.log("day: " + forecastDay + " Index " + index);//test trash
    this.date = getDate(forecastDay.dt, this.state.timezoneOffset);
    this.weekDay = getWeekday(this.date)
    this.month = this.date.getMonth();
    this.day = this.date.getDate();
    
    return `
      <div class="weather-list-item" id="${index}">
        <div>${this.day} / ${this.month}</div>
        <div>${this.weekDay}</div>
        <div>${forecastDay.temp.max} | ${forecastDay.temp.min}</div>
      </div>
        ` ;
  }

  renderCurrentDay(index) {

  }
  
  
  /*- Part 5 - Display weather details when the user clicks one weather list item
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
    - you'll need to declare and initialize a variable forecastElements that contains
      an array of elements that have the class .weather-list-item
    - you'll have to bind the method renderCurrentDay to both the class and the index of the item
      forecastElements[i].onclick = this.renderCurrentDay.bind(this, i)
  - Write the method clearCurrentDay.  It sets the inner html property of the currentDay element to ""
  - Call clearCurrentDay at the end of onFormSubmit where you clear the zipcode.
  END OF PART 5 - TEST AND DEBUG YOUR APP
  */
}
let weather;
window.onload = () => { weather = new Weather(); }


/*  Part 1 - calling get location
    getLocation(this.state.zipcode)
      .then(data => {
        this.state.city.name = data.results[0].address_components[1].long_name;
        this.state.city.lat = data.results[0].geometry.location.lat;
        this.state.city.lng = data.results[0].geometry.location.lng;
        console.log(this.state.city);
      })
      .catch(error => {
        alert('There was a problem getting location information!')
      });

*/
