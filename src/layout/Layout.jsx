import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, NavLink } from "react-router";
import { getCartAsync } from "../slices/cartSlice";
import useSweetAlert from "../hooks/useSweetAlert";

import ScrollToTop from "../components/ScrollToTop";

const Layout = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const carts = useSelector(state => state.cart.carts);
  const dispatch = useDispatch();
  const { alert } = useSweetAlert();

  useEffect(() => {
    const getCart = async () => {
      try {
        await dispatch(getCartAsync()).unwrap();
      } catch (errorMsg) {
        alert('取得購物車失敗', 'error', `${errorMsg}`);
      }
    }

    getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (<>
    <ScrollToTop />

    <nav className={`navbar navbar-expand-lg bg-light sticky-top ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <NavLink className="navbar-brand fw-medium fs-3 ls-sm" to="/" onClick={() => setNavOpen(false)}>sushi</NavLink>
        <button className="navbar-toggler" type="button" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={() => setNavOpen(false)}>首頁</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products" onClick={() => setNavOpen(false)}>商品專區</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={() => setNavOpen(false)}>關於我們</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link position-relative" to="/cart" onClick={() => setNavOpen(false)}>
                <i className="bi bi-cart">
                </i>
                <span className="position-absolute translate-middle badge rounded-pill bg-danger mt-1 ms-1">{ carts.length }</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div className="flex-grow-1">
      <Outlet />
    </div>

    <footer className="bg-dark px-3 px-lg-0 py-11 py-lg-15">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-8 gap-lg-0 mb-6 mb-lg-5">
          <NavLink to="/" className="fw-medium fs-3 ls-sm link-white" onClick={() => setNavOpen(false)}>sushi</NavLink>
          <ul className="list-unstyled d-flex flex-column flex-lg-row gap-6 gap-lg-0 fs-7 fw-medium">
            <li>
              <NavLink to="/" className="link-white px-lg-4" onClick={() => setNavOpen(false)}>首頁</NavLink>
            </li>
            <li>
              <NavLink to="/products" className="link-white px-lg-4" onClick={() => setNavOpen(false)}>商品專區</NavLink>
            </li>
            <li>
              <NavLink to="/about" className="link-white ps-lg-4" onClick={() => setNavOpen(false)}>關於我們</NavLink>
            </li>
          </ul>
        </div>
        <div className="d-flex flex-column-reverse flex-lg-row justify-content-between align-items-lg-end gap-4 gap-lg-0">
          <p className="fs-8 fs-lg-7 text-light mb-0">
            copyright © {new Date().getFullYear()} sushi All Rights Reserved.
          </p>
          <ul className="list-unstyled d-flex gap-1 gap-lg-3">
            <li>
              <a href="#" className="d-flex justify-content-center align-items-center link-icon">
                <i className="bi bi-line fs-5 fs-lg-4"></i>
              </a>
            </li>
            <li>
              <a href="#" className="d-flex justify-content-center align-items-center link-icon">
                <i className="bi bi-youtube fs-5 fs-lg-4"></i>
              </a>
            </li>
            <li>
              <a href="#" className="d-flex justify-content-center align-items-center link-icon">
                <i className="bi bi-instagram fs-5 fs-lg-4"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  </>);
}

export default Layout;