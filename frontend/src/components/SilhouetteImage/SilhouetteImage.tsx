import { useState } from 'react';
import './SilhouetteImage.css';

interface SilhouetteImageProps {
  imageUrl: string;
  pokemonName: string;
  isRevealed: boolean;
}

function SilhouetteImage({ imageUrl, pokemonName, isRevealed }: SilhouetteImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleImageLoad = () => {
  setImageLoaded(true);
};

return (
  <div className="silhouette-container">
    {!imageLoaded && (
      <div className="image-loading">
        <div className="loading-spinner"></div>
      </div>
    )}
    
    <img
      src={imageUrl}
      alt={pokemonName}
      className={`pokemon-image ${isRevealed ? 'revealed' : 'silhouette'} ${imageLoaded ? 'loaded' : ''}`}
      onLoad={handleImageLoad}
    />
  </div>
);
}

export default SilhouetteImage;