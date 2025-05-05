import { useState } from "react";
import logo from "../../../images/logonegro.png";
import styles from "./headerShop.module.css";
import { FiltrosHeader } from "../filtrosHeader/FiltrosHeader";
import { useNavigate } from "react-router-dom";

export const HeaderShop = () => {
  const [hoverShop, setHoverShop] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleHoverEnter = () => {
    setHoverShop(true);
  };

  const handleHoverLeave = () => {
    setTimeout(() => {
      setHoverShop(false);
    }, 1000);
  };

  const handleHome = () => {
    navigate(`/vistaLanding`);
  };
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.logo}>
          <img src={logo} alt="" />
          <h1>SneakShop</h1>
        </div>
        <nav className={styles.navbar}>
          <ul>
            <li>
              <a href="" onClick={handleHome}>
                Home
              </a>
            </li>
            <li>
              <a
                href=""
                onMouseEnter={handleHoverEnter}
                onMouseLeave={handleHoverLeave}
              >
                Shop
              </a>
            </li>
            <li>
              <a href="">About</a>
            </li>
            <li>
              <a href="">Contact</a>
            </li>
          </ul>
        </nav>
        <div className={styles.icons}>
          <span className="material-symbols-outlined">account_circle</span>
          <span className="material-symbols-outlined">shopping_cart</span>
        </div>
      </header>

      <FiltrosHeader estado={hoverShop} />
    </>
  );
};
