import { fetchPictures } from './fetcPictures';
import { showData } from './showData';
import config from './config.json';
import Notiflix from 'notiflix';

const loading = document.querySelector('.loading');
const searchForm = document.querySelector('.search-form');
const inputNode = document.querySelector('.search-form input');
const galleryNode = document.querySelector('.gallery');

let isEnd = false;
window.addEventListener('scroll', async () => {
  if (isEnd) return;
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  console.log({ scrollTop, scrollHeight, clientHeight });

  if (clientHeight + Math.ceil(scrollTop) >= scrollHeight) {
    loading.classList.remove('hidden');

    config.page += 1;
    const { hits, totalHits } = await fetchPictures(inputNode.value);
    if (config.page > Math.ceil(totalHits / config.per_page)) {
      Notiflix.Notify.failure('We are sorry, but you have reached the end of search results');
      loading.classList.add('hidden');
      isEnd = true;
    } else {
      showData(hits);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  }
  loading.classList.add('hidden');
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
