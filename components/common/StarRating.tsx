import React from 'react';
import StarIcon from '../icons/StarIcon';

interface StarRatingProps {
  rating: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, className = '' }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className="h-5 w-5 text-yellow-400" fill="currentColor" />
      ))}
      {/* Note: This implementation only shows full stars for simplicity. Half-star logic could be added here. */}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-600" fill="currentColor" />
      ))}
    </div>
  );
};

export default StarRating;