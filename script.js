"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputPlaces = document.querySelector(".form__input--places");

class App {
  #map;
  #eventEl;
  constructor() {
    this._getPosition();
    console.log(this);
    form.addEventListener("submit", this._newTravel.bind(this));
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
    this.#map = L.map("map").setView(coords, 12);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.marker(coords).addTo(this.#map).bindPopup("Your Location").openPopup();
    this.#map.on("click", this._showMarker.bind(this));
  }
  _showMarker(event) {
    this.#eventEl = event;
    console.log(event);
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _newTravel(e) {
    e.preventDefault();
    inputDuration.value = inputDistance.value = inputPlaces.value = "";

    const { lat, lng } = this.#eventEl.latlng;
    L.marker([lat, lng])
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
      .setPopupContent("Visit")
      .openPopup();
  }
}
const app = new App();
