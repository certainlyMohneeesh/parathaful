'use client';
import HorizontalGallery from './HorizontalGallery';

const GallerySection = () => {
  return (
    <section className="gallery-section">
      {/* Reduced padding for smoother scroll transition */}
      <div className="text-center py-8 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Our Gallery
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Explore the vibrant world of our stuffed parathas through these delightful images. Each photo captures the essence of our culinary journey, showcasing the love and care that goes into every dish.
        </p>
      </div>
      <HorizontalGallery />
    </section>
  );
};

export default GallerySection;