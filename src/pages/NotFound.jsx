import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/', {
        replace: true
      })
    }, 3000);
  }, [navigate])

  return (<>
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2 className="mb-3">此頁面不存在或已被移除</h2>
      <p>
        請稍候，系統將自動帶您回到<Link className="link-primary d-inline" to="/">首頁</Link>
      </p>
    </div>
  </>);
}

export default NotFound;