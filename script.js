"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const travel = document.querySelector(".travel");
const containerWorkouts = document.querySelector(".workouts");

const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputPlaces = document.querySelector(".form__input--places");
const isValid = (...inputs) => inputs.every((inp) => Number.isNaN(inp));

class App {
  #map;
  #eventEl;
  #travelData = [];
  constructor() {
    this._getPosition();
    this._getLocalStorage();

    form.addEventListener("submit", this._newTravel.bind(this));
    containerWorkouts.addEventListener("click", this.__getPointer.bind(this));
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert("Could not get location");
      });
    }
  }
  _loadMap(position) {
    const { longitude } = position.coords;
    const { latitude } = position.coords;

    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 10);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.marker(coords).addTo(this.#map).bindPopup("Your Location").openPopup();
    this.#map.on("click", this._showMarker.bind(this));
    this.#travelData.forEach((item) => {
      this._renderMarker(item);
    });
  }
  _showMarker(event) {
    this.#eventEl = event;

    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _newTravel(e) {
    e.preventDefault();
    const { lat, lng } = this.#eventEl.latlng;
    const duration = +inputDuration.value;
    const distance = +inputDistance.value;
    const type = inputType.value || "visit";
    const places = inputPlaces.value;
    if (places.trim().length === 0) {
      alert("Please Enter Valid Places");
      return;
    }

    if (isValid(duration, distance)) {
      alert("Please Enter Valid Input");
      return;
    }
    const travel = new Travel([lat, lng], type, distance, duration, places);

    this.#travelData.push(travel);
    this._renderMarker(travel);
    this._showTravelData(travel);
    this._hideForm();
    this._setLocalStorage();
  }
  _renderMarker(travel) {
    L.marker(travel.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          autoClose: false,
          closeOnClick: false,
          maxWidth: 250,
          minWidth: 200,
          className: "running-popup",
        })
      )
      .setPopupContent(travel.description)
      .openPopup();
  }
  _showTravelData(item) {
    let element = "";
    console.log(this.#travelData);

    element = `
         <li class="workout workout--running" id=${item.id} >
          <h2 class="workout__title"> ${item.description}</h2>
          
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${item.duration}</span>
            <span class="workout__unit">Hour</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${item.distance}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">📍</span>
            <span class="workout__unit">Places:-</span>
            <span class="workout__value"> ${item.places}</span>
          </div>
        </li>`;

    form.insertAdjacentHTML("afterend", element);
  }
  __getPointer(e) {
    if (!this.#map) return;

    const id = e.target?.closest(".workout");
    const _id = id?.id;

    const array1 = [...this.#travelData];

    const travel = array1.find(
      (work) => work?.id.toString() === _id.toString()
    );

    if (!travel) {
      return;
    }

    this.#map.setView(travel?.coords, 15, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
  _hideForm() {
    inputDuration.value = inputDistance.value = inputPlaces.value = "";
    form.classList.add("hidden");
    form.style.display = "none";
    setTimeout(() => (form.style.display = "grid"), 1000);
  }
  _setLocalStorage() {
    localStorage.setItem("travel", JSON.stringify(this.#travelData));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("travel"));

    if (!data) {
      return;
    }

    this.#travelData = data;
    this.#travelData.forEach((item) => {
      this._showTravelData(item);
    });

    console.log(this.#travelData);
  }
}
class Travel {
  date = new Date();
  id = Math.random();
  constructor(coords, type, distance, duration, places) {
    this.type = type;
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.places = places;
    this._setDescription();
  }
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}
const app = new App();
