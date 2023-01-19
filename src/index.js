import './css/styles.css';
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const listCountry = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange({ target }) {
  const searchCountry = target.value.trim();
  if (searchCountry === '') {
    reset();
    return;
  } else {
    fetchCountries(searchCountry)
      .then(country => {
        if (country.length < 2) {
          createCountrieCard(country);
          createCountrieCard(country);
          Notify.success('Here your result');
        } else if (country.length < 10 && country.length > 1) {
          createCountrieList(country);
          Notify.success('Here your results');
        } else {
          reset();
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        reset();
        Notify.failure('Oops, there is no country with that name.');
      });
  }
}

function createCountrieCard(country) {
  reset();
  const { flags, name, capital, population, languages } = country[0];
  const countryCard = `
   <div class="country-card">
		<div class="country-card__header">
			<img class="country-card__img"src="${flags.svg}" alt="${
    name.official
  } width="55", height="35"">
			<h2 class="country-card__name">${name.official}</h2>
		</div>
		<p class="country-card__text">Capital: <span>${capital}</span></p>
		<p class="country-card__text">Population: <span>${population}</span></p>
		<p class="country-card__text">Languages: <span>${Object.values(languages).join(
      ','
    )}</span></p>
	</div>`;
  countryInfo.innerHTML = countryCard;
}

function createCountrieList(array) {
  reset();
  listCountry.innerHTML = array
    .map(({ flags, name }) => {
      `<li class="country-list__item">
            <img src="${flags.svg}" alt="${name.official}" width="40", height="40">
            <span class="country-list__name">${name.official}</span>
        </li>`;
    })
    .join('');
}

function reset() {
  listCountry.innerHTML = '';
  countryInfo.innerHTML = '';
}
