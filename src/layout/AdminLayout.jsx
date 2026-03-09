import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import useMsg from "../hooks/useMsg";

const apiBase = import.meta.env.VITE_API_BASE;
const basePath = import.meta.env.BASE_URL.slice(0, -1) || '/';

const AdminLayout = () => {
  const [navOpen, setNavOpen] = useState(false);

  const navigate = useNavigate();
  const showMsg = useMsg();

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (!token) {
      navigate('/login');
      return;
    }

    axios.defaults.headers.common.Authorization = token;
    checkLogin();
  }, [navigate]);

  const checkLogin = async () => {
    try {
      await axios.post(`${apiBase}/api/user/check`);
    } catch (error) {
      showMsg(error.response.data);
      handleClearAuth();
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${apiBase}/logout`);
      showMsg(res.data);
    } catch (error) {
      showMsg(error.response.data);
    } finally {
      handleClearAuth();
    }
  };

  const handleClearAuth = () => {
    document.cookie = `hexToken=; Max-Age=0; path=${basePath};`;
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (<>
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <NavLink className="navbar-brand" to="/admin/products" onClick={() => setNavOpen(false)}>sushi</NavLink>
        <button className="navbar-toggler" type="button" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/products" onClick={() => setNavOpen(false)}>產品管理</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/orders" onClick={() => setNavOpen(false)}>訂單管理</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/coupons" onClick={() => setNavOpen(false)}>優惠券管理</NavLink>
            </li>
            <li className="nav-item">
              <button type="button" className="nav-link" onClick={handleLogout}>登出</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main className="pt-4 pb-8">
      <Outlet />
    </main>
  </>);
}

export default AdminLayout;