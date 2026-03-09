import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useMsg from "../hooks/useMsg";

const apiBase = import.meta.env.VITE_API_BASE;

const Login = () => {
  const navigate = useNavigate();
  const showMsg = useMsg();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const res = await axios.post(`${apiBase}/admin/signin`, data);
      const { expired, token } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;
      showMsg(res.data);
      navigate('/admin/products');
    } catch (error) {
      showMsg(error.response.data);
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token) {
      axios.defaults.headers.common.Authorization = token;
      navigate('/admin/products');
    }
  }, []);

  return (<>
    <div className="login">
      <form className="form-login" onSubmit={handleSubmit(handleLogin)}>
        <h2 className="fs-3 text-center border-bottom pb-4 mb-4">
          <i className="bi bi-circle-half"></i> 後台管理系統
        </h2>
        <div className="form-floating mb-3">
          <input type="email" className="form-control" {...register('username', {
            required: '請輸入Email',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "請輸入有效的 Email 格式",
            },
          })} id="username" placeholder="name@example.com" />
          <label htmlFor="username">Email address</label>
          {errors.username && <p className="text-danger mt-1">{ errors.username.message }</p>}
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" {...register('password', {
            required: '請輸入密碼',
            minLength: {
              value: 6,
              message: "密碼長度至少需為 6 個字元",
            },
          })} id="password" placeholder="Password" />
          <label htmlFor="password">Password</label>
          {errors.password && <p className="text-danger mt-1">{ errors.password.message }</p>}
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-100">
          <i className="bi bi-box-arrow-in-right"></i> 登入
        </button>
      </form>
    </div>
  </>);
}

export default Login;