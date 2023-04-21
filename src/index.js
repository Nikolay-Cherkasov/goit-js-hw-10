import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './api/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(() => {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    const inputValue = input.value.trim();
    if (inputValue) {
      return fetchCountries(inputValue).then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
        if (countries.length >= 2 && countries.length <= 10) {
          makeCountryList(countries);
        }
        if (countries.length === 1) {
          oneCountry(countries);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

function makeCountryList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li><img src="${flags.svg}" width="30" height="20"/><p>${name.official} </p></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function oneCountry(countries) {
  const markup = countries
    .map(({ flags, name, population, capital, languages }) => {
      return `<h1>${name.official}</h1>
        <img src="${flags.svg}" width="30" height="20"/>
      <p><b>Capital: </b>${capital}</p>
      <p><b>Population: </b>${population}</p>
      <p><b>Languages: </b>${Object.values(languages)}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
