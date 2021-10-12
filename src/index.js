import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import config from './config.json';

const searchForm = document.querySelector('.search-form');
const inputNode = document.querySelector('.search-form input');
const galleryNode = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  galleryNode.innerHTML = '';
  config.page = 1;
  fetchPictures(inputNode.value)
    .then(data => {
      if (data.hits.length === 0)
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      else {
        showData(data.hits);
        btnLoadMore.classList.remove('hidden');
      }
    })
    .catch(error => console.log(error));
});

btnLoadMore.addEventListener('click', e => {
  e.preventDefault();
  config.page += 1;
  fetchPictures(inputNode.value)
    .then(data => {
      if (config.page > Math.ceil(data.totalHits / config.per_page)) {
        Notiflix.Notify.failure('We are sorry, but you have reached the end of search results');
        btnLoadMore.classList.add('hidden');
        searchForm.reset();
      } else {
        showData(data.hits);
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error));
});

function fetchPictures(q) {
  const params = new URLSearchParams({
    per_page: config.per_page,
    page: config.page,
  });

  return fetch(
    `https://pixabay.com/api/?key=23766907-8949d781ce5b5ece952eeda6b&q=${q}&image_type=photo&${params.toString()}&orientation=horizontal&safesearch=true`,
  ).then(response => {
    if (!response.ok) {
      throw new Error(
        Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.'),
      );
    }
    return response.json();
  });
}

function showData(data) {
  const markUp = data
    .map(item => {
      return `<div class="photo-card">
    <a href= ${item.largeImageURL} >
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="325" height="220"  />
  </a>
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

  galleryNode.insertAdjacentHTML('beforeend', markUp);

  lightbox.refresh();
}
