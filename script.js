const searchInput = document.querySelector('.tracker__input');
const searchBtn = document.querySelector('.tracker__btn');

const ipAddress = document.querySelector('.display__item-text--address');
const ipLocation = document.querySelector('.display__item-text--location');
const ipTimezone = document.querySelector('.display__item-text--timezone');
const ipIsp = document.querySelector('.display__item-text--isp');

const zoom = 18;
let inputAddress;
let map = L.map('map');

searchBtn.addEventListener('click', async (e) => {
  if (!searchInput.value) return;
  inputAddress = searchInput.value;

  const data = await getIP(inputAddress);
  const { lat, lon: lng } = data;

  updateDisplay(data);
  loadMap(lat, lng);

  searchInput.value = '';
});

const loadMap = (lat, lng) => {
  map = map.setView([lat, lng], zoom);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: './images/icon-location.svg',
    }),
  }).addTo(map);
};

const getIP = async (address = '192.212.174.101') => {
  const res = await fetch(`http://ip-api.com/json/${address}`);
  const data = await res.json();
  return data;
};

const updateDisplay = (data) => {
  const { query: address, city, region, zip, timezone, isp } = data;
  ipAddress.textContent = address;
  ipLocation.textContent = `${city}, ${region} ${zip}`;
  ipTimezone.textContent = timezone;
  ipIsp.textContent = isp;
};

const init = async () => {
  const initialData = await getIP();
  const { lat, lon: lng } = initialData;

  updateDisplay(initialData);
  loadMap(lat, lng);
};

init();
