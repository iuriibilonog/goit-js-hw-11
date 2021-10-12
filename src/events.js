import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import config from './config.json';
import axios from 'axios';

const searchForm = document.querySelector('.search-form');
const inputNode = document.querySelector('.search-form input');
const galleryNode = document.querySelector('.gallery');

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
    showData(hits);
    // btnLoadMore.classList.remove('hidden');
  }
});
