import React from "react";
import styles from "./NavigationStrip.module.css";
import logo from "../../assets/logo.svg";

export const NavigationStrip = ({ tabs, currentIndex, changeTab }) => {
  const activeTabClass = (tab) => currentIndex == tab ? styles.active : '';

  return (
    <nav>
      <img src={logo} className={styles.logo} alt="Logo" />
      <ul className={styles.menu}>
        {Object.keys(tabs).map((tab, index) => (
          <li key={index}>
            <a href="#" className={activeTabClass(tab)} onClick={() => changeTab(tab)}>
              {tabs[tab]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
	)
};

export default NavigationStrip;