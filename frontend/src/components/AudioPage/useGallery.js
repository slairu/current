import React, { useEffect } from "react";
import debounce from "lodash/debounce";

function useGallery(peers, galleryRef, indicatorJoin) {
  function recalculateLayout() {
    const gallery = galleryRef.current;

    if (!gallery) {
      return;
    }

    const aspectRatio = 16 / 9;
    const screenWidth = document.body.getBoundingClientRect().width;
    const screenHeight = document.body.getBoundingClientRect().height;
    const videoCount = gallery.children.length;

    console.log(videoCount);

    function calculateLayout(
      containerWidth,
      containerHeight,
      videoCount,
      aspectRatio
    ) {
      let bestLayout = {
        area: 0,
        cols: 0,
        rows: 0,
        width: 0,
        height: 0,
      };

      // brute-force search layout where video occupy the largest area of the container
      for (let cols = 1; cols <= videoCount; cols++) {
        const rows = Math.ceil(videoCount / cols);
        const hScale = containerWidth / (cols * aspectRatio);
        const vScale = containerHeight / rows;
        let width;
        let height;
        if (hScale <= vScale) {
          width = Math.floor(containerWidth / cols);
          height = Math.floor(width / aspectRatio);
        } else {
          height = Math.floor(containerHeight / rows);
          width = Math.floor(height * aspectRatio);
        }
        const area = width * height;
        if (area > bestLayout.area) {
          bestLayout = {
            area,
            width,
            height,
            rows,
            cols,
          };
        }
      }
      return bestLayout;
    }

    const { width, height, cols } = calculateLayout(
      screenWidth,
      screenHeight,
      videoCount,
      aspectRatio
    );

    gallery.style.setProperty("--width", width + "px");
    gallery.style.setProperty("--height", height - 9 + "px");
    gallery.style.setProperty("--cols", cols + "");

    console.log("width: ", width, "height: ", height, "cols: ", cols);
  }

  useEffect(() => {
    if (!indicatorJoin) {
      return;
    }
    const debouncedRecalculateLayout = debounce(recalculateLayout, 50);
    window.addEventListener("resize", debouncedRecalculateLayout);
    debouncedRecalculateLayout();
  }, [indicatorJoin]);

  useEffect(() => {
    const debouncedRecalculateLayout = debounce(recalculateLayout, 50);
    debouncedRecalculateLayout();
  }, [peers]);
}

export default useGallery;
