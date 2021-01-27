import { 
  useState, useEffect } from "react";

interface SizeITF {
  width: number | undefined
  height: number | undefined
}

export const useWindowSize = () => {
  const isClient: boolean = typeof window === 'object';

  // Get size of window screen [width & height]
  function getSize() {
    const sizeObj: SizeITF = {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    }
    return sizeObj
  }

  const [windowSize, setWindowSize] = useState(getSize);

  // Init window size
  useEffect(() => {
    if (!isClient) {
      return;
    }
    
    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}