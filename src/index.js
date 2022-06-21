import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio'

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
let markup;



function search() {
    if (input.value === '') {
        countryInfo.innerHTML = ""
        list.innerHTML = ""
        return
    }
    fetch(`https://restcountries.com/v3.1/name/${input.value.trim()}?fields=name,capital,population,flags,languages`)
        .then(res => {
            if (!res.ok) {
                throw new Error(res.status);
            }
            return res.json();
        }).then(countries => {
            console.log(countries)
            if (countries.length > 10) {
                countryInfo.innerHTML = ""
                list.innerHTML = ""
                return Notify.info("Too many matches found. Please enter a more specific name.")}
            if (countries.length < 10 && countries.length > 2) {
                markup = countries.map((country) => {
                    return `<li class = "li-country">
                                <img class = "flag" src="${country.flags.svg}"></img>
                                <p class = "p-country">${country.name.official}</p>
                            </li>`
                }).join("")
                list.innerHTML = markup
                countryInfo.innerHTML = ""
            } else if (countries.length === 1) {
                list.innerHTML = ""
                markup = countries.map(({ flags, name, capital, population, languages }) => { 
                    return `<div class="title">
                                <img class = "flag" src="${flags.svg}"></img>
                                <p class = "info">${name.official}</p>
                            </div>
                            <p class = "info">Capital: ${capital}</p>
                            <p class = "info">Population: ${population}</p>
                            <p class = "info">Languages: ${Object.values(languages)}</p>`
                 })
                countryInfo.innerHTML = markup
            }
        }
    ).catch(error => {
        countryInfo.innerHTML = ""
        list.innerHTML = ""
        console.log(error);
        return Notify.failure("Oops, there is no country with that name");})
}


input.addEventListener('keydown', debounce(search, DEBOUNCE_DELAY))