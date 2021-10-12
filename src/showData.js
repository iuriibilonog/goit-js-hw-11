import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryNode = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');

export function showData(data) {
  const markUp = data
    .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
    <a href= ${largeImageURL} >
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="325" height="220"  />
  
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
  </a>
</div>`;
    })
    .join('');

  galleryNode.insertAdjacentHTML('beforeend', markUp);

  lightbox.refresh();
}
