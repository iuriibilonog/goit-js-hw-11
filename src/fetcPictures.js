import config from './config.json';
import axios from 'axios';
import Notiflix from 'notiflix';

export async function fetchPictures(q) {
  const params = new URLSearchParams({
    per_page: config.per_page,
    page: config.page,
    orientation: config.orientation,
    safesearch: config.safesearch,
    image_type: config.image_type,
  });

  const response = await axios(`${config.baseLink}?${config.key}&q=${q}&${params.toString()}`);

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    ),
  );
}
