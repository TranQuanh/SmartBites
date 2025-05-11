import React from 'react';
import './skeletonCard.scss';

const SkeletonCard = () => {
  return (
    <div className="col-skeleton">
      <div className="movie--isloading">
        <div className="loading-image"></div>
        <div className="loading-content">
          <div className="loading-text-container">
            <div className="loading-main-text"></div>
            <div className="loading-sub-text"></div>
          </div>
          <div className="loading-btn"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;