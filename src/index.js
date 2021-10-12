import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import config from './config.json';
import axios from 'axios';

const loading = document.querySelector('.loading');
const searchForm = document.querySelector('.search-form');
const inputNode = document.querySelector('.search-form input');
const galleryNode = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a');

let isEnd = false;
window.addEventListener('scroll', async () => {
  if (isEnd) return;
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  console.log({ scrollTop, scrollHeight, clientHeight });

  if (clientHeight + Math.ceil(scrollTop) >= scrollHeight) {
    console.log('Есть скролл');
    loading.classList.remove('hidden');

    config.page += 1;
    const { hits, totalHits } = await fetchPictures(inputNode.value);
    if (config.page > Math.ceil(totalHits / config.per_page)) {
      Notiflix.Notify.failure('We are sorry, but you have reached the end of search results');
      loading.classList.add('hidden');
      isEnd = true;
    } else {
      showData(hits);
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }
    loading.classList.add('hidden');
  }
});

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  galleryNode.innerHTML = '';
  config.page = 1;
  const { hits } = await fetchPictures(inputNode.value);

  if (hits.length === 0)
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  else {
    isEnd = false;
    showData(hits);
    // btnLoadMore.classList.remove('hidden');
  }
});

// btnLoadMore.addEventListener('click', async e => {
//   e.preventDefault();
//   config.page += 1;
//   const { hits, totalHits } = await fetchPictures(inputNode.value);
//   if (config.page > Math.ceil(totalHits / config.per_page)) {
//     Notiflix.Notify.failure('We are sorry, but you have reached the end of search results');
//     btnLoadMore.classList.add('hidden');
//     searchForm.reset();
//   } else {
//     showData(hits);
//     Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
//   }
// });

async function fetchPictures(q) {
  const params = new URLSearchParams({
    per_page: config.per_page,
    page: config.page,
  });

  const response = await axios.get(
    `https://pixabay.com/api/?key=23766907-8949d781ce5b5ece952eeda6b&q=${q}&image_type=photo&${params.toString()}&orientation=horizontal&safesearch=true`,
  );
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    ),
  );
}

function showData(data) {
  const markUp = data
    .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
    <a href= ${largeImageURL} >
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="325" height="220"  />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>${likes}
    </p>
    <p class="info-item">
      <b>Views:</b>${views}
    </p>
    <p class="info-item">
      <b>Comments:</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>${downloads}
    </p>
  </div>
  
</div>`;
    })
    .join('');

  galleryNode.insertAdjacentHTML('beforeend', markUp);

  lightbox.refresh();
}
