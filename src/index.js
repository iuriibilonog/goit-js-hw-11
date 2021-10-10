import './sass/main.scss';
import Notiflix from 'notiflix';
import config from './config.json';

const searchForm = document.querySelector('.search-form');
const inputNode = document.querySelector('.search-form input');
const galleryNode = document.querySelector('.gallery');

// inputNode.addEventListener('input',document.querySelector('.search-form'); e => {
//   return e.target.value;
// });

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  fetchCountries(inputNode.value)
    .then(data => {
      if (data.hits.length === 0)
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      else showData(data.hits);
    })
    .catch(error => console.log(error));
});

function fetchCountries(q) {
  return fetch(
    `https://pixabay.com/api/?key=23766907-8949d781ce5b5ece952eeda6b&q=${q}&image_type=photo&per_page=40`,
  ).then(response => {
    if (!response.ok) {
      throw new Error(Notiflix.Notify.failure('Oops, there is no country with that name'));
    }
    return response.json();
  });
}

function showData(data) {
  const markUp = data
    .map(item => {
      return `<div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="325"  />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>${item.likes}
    </p>
    <p class="info-item">
      <b>Views:</b>${item.views}
    </p>
    <p class="info-item">
      <b>Comments:</b>${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>${item.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  galleryNode.innerHTML = markUp;
}
