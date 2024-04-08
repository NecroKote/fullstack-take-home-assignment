import { useState } from "react";

export const useTabs = (tabs, initial) => {
  const [currentIndex, setCurrentIndex] = useState(initial);

  return {
    currentIndex,
    activeTab: tabs[currentIndex],
    changeTab: setCurrentIndex
  }
}

export default useTabs;