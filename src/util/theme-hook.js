import { useState, useCallback, useEffect } from 'react';

export const useThemeCustom = () => {
  const [showImage, setShowImage] = useState(false);

  const changeShowImage = useCallback((value) => {
    setShowImage(value);
  }, []);

  return {
    showImage,
    changeShowImage,
  };
};
