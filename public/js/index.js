import '@babel/polyfill';
import '@babel/plugin-transform-runtime';
import L from 'leaflet';
import { login, logOut } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

const stripe = Stripe(
  'pk_test_51NlrisSEMxTmDuuFw3FeqVVb4e0oynKgOogKLCyfjE3iXOa3NpLpDPLcz8IiAHAXIEPSbv2Df392pLd5vmxi9oc200pIfk5vhA'
);

//DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

const displayMap = location => {
  location.forEach(item => {
    item.coordinates.reverse();
  });

  // Initialize the map
  let map = L.map('map', { scrollWheelZoom: false }).setView(
    location[0].coordinates,
    6
  );

  // Add a tile layer (base map)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  location.forEach(place => {
    // Add a marker
    L.marker(place.coordinates)
      .addTo(map)
      .bindPopup(`Day-${place.day} ${place.description}`);
  });
};

//Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logOut);

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    document.querySelector('.btn--save--password').textContent = 'updating...';
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save--password').textContent =
      'save password';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId, stripe);
  });
}
