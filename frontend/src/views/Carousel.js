import React, { useState, useEffect } from "react";

const Carousel = ({ content }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + content.length) % content.length
    );
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - translateX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTranslateX(e.pageX - startX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const threshold = window.innerWidth / 4;
    if (translateX > threshold) {
      prevSlide();
    } else if (translateX < -threshold) {
      nextSlide();
    }
    setTranslateX(0);
  };

  useEffect(() => {
    const autoScroll = setInterval(() => {
      nextSlide();
    }, 5000); // Auto scroll every 5 seconds

    // Add event listener to track mouse move on the document
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(autoScroll);
      document.removeEventListener("mousemove", handleMouseMove); // Remove the event listener on unmount
    };
  }, [currentIndex]);

  return (
    <div className="container">
      <div
        className="carousel"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
      >
        <h2>{content[currentIndex].title}</h2>
        <p>{content[currentIndex].text}</p>
        <div className="controls">
          <button onClick={prevSlide}>Previous</button>
          <button onClick={nextSlide}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
