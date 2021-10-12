import config from './config.json';
import axios from 'axios';
import Notiflix from 'notiflix';

export async function fetchPictures(q) {
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
