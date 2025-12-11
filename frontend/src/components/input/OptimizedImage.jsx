import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const OptimizedImage = ({
  src,
  alt = "",
  width = 800,
  height = 600,
  className = "",
  fallback = "/images/no-image.jpg",
}) => {
  const getOptimizedUrl = (url) => {
    if (!url) return fallback;
    if (url.includes("cloudinary")) {
      return url.replace(
        "/upload/",
        `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
      );
    }
    return url;
  };

  const optimizedUrl = getOptimizedUrl(src);

  return (
    <LazyLoadImage
      src={optimizedUrl}
      alt={alt}
      effect="blur"
      className={className}
      loading="lazy"
      onError={(e) => (e.target.src = fallback)}
    />
  );
};

export default OptimizedImage;
