import { defineComponent } from '../deps.js';

export default defineComponent({
  name: 'LookbookPage',
  template: `
    <div id="lookbook-page">
      <div class="lookbook-header">
        <video
          src="http://mazwai.com/system/posts/videos/000/000/179/original/french_polynesia--matt_devir.mp4?1442356252"
          loop
          autoplay
          muted
          playsinline
        >
          <p>Your browser does not support video.</p>
        </video>
      </div>
      <h1>Lookbook</h1>
      <p>
        Rocktown Kicks isn't just about the shoe — it's about the story behind the lace-up.
        This season we're shooting raw, lifestyle-first photography that puts the sneaker in its element.
      </p>
      <p>
        From street courts in Harrisonburg to rooftops in the city, every frame here was captured
        with real culture in mind. No studio. No fake backdrops. Just kicks living their best life.
      </p>

      <div class="lookbook-grid">
        <div class="left-grid">
          <div class="left-img1 left-images">
            <img src="images/lookbook.jpg" alt="Lookbook photo 1" loading="lazy" />
          </div>
          <div class="left-img2 left-images">
            <img src="images/lookbook2.jpg" alt="Lookbook photo 2" loading="lazy" />
          </div>
        </div>
        <div class="right-grid">
          <div class="right-img1 right-images">
            <img src="images/lookbook3.jpg" alt="Lookbook photo 3" loading="lazy" />
          </div>
          <div class="right-img2 right-images">
            <img src="images/lookbook4.jpg" alt="Lookbook photo 4" loading="lazy" />
          </div>
          <div class="right-img3 right-images">
            <img src="images/lookbook5.jpg" alt="Lookbook photo 5" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  `
});
