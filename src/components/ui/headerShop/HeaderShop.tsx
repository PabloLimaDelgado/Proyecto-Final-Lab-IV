import { useState } from "react";
import logo from "../../../images/logonegro.png";
import styles from "./headerShop.module.css";
import { FiltrosHeader } from "../filtrosHeader/FiltrosHeader";
import { useNavigate } from "react-router-dom";

export const HeaderShop = () => {
  const [hoverShop, setHoverShop] = useState<boolean>(false);
  const [hoverAccount, setHoverAccount] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleHoverEnter = () => {
    setHoverShop(true);
  };

  const handleHoverLeave = () => {
    setTimeout(() => {
      setHoverShop(false);
    }, 1500);
  };

  const handleHoverAccountEnter = () => {
    setHoverAccount(true);
  };

  const handleHoverAccountLeave = () => {
    setTimeout(() => {
      setHoverAccount(false);
    }, 1500);
  };

  const handleHome = () => {
    navigate("/vistaLanding");
  };

  const handleLogin = () => {
    navigate("/vistaLogin");
  };

  const handleUser = () => {
    navigate("/VistaUsuario");
  };

  const handleCarrito = () => {
    navigate("/VistaCarrito");
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
          </ul>
        </nav>
        <div className={styles.icons}>
          <div className={styles.iconUser}>
            <span
              className="material-symbols-outlined"
              onMouseEnter={handleHoverAccountEnter}
              onMouseLeave={handleHoverAccountLeave}
            >
              account_circle
            </span>
            {hoverAccount && (
              <div className={styles.hoverMenu}>
                <h4 onClick={handleUser}>Configuracion</h4>
                <h4 onClick={handleLogin}>Salir</h4>
              </div>
            )}
          </div>
          <span className="material-symbols-outlined" onClick={handleCarrito}>
            shopping_cart
          </span>
        </div>
      </header>

      <FiltrosHeader estado={hoverShop} />
    </>
  );
};
