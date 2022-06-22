
const input = document.querySelector('#search-box');

export function fetchCountries() {
   return fetch(`https://restcountries.com/v3.1/name/${input.value.trim()}?fields=name,capital,population,flags,languages`)
        .then(res => {
            if (!res.ok) {
                throw new Error(res.status);
            }
            return res.json();
        })
}