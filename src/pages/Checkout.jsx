import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { clearCart } from "../slices/cartSlice";
import { updateStep } from "../slices/cartSlice";
import useSweetAlert from "../hooks/useSweetAlert";

import Stepper from "../components/Stepper";

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alert } = useSweetAlert();

  useEffect(() => {
    dispatch(updateStep(2));
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    try {
      const { username, email, phone, address, message } = data;
      const order = {
        data: {
          user: {
            name: username,
            email,
            tel: phone,
            address,
          },
          message
        }
      }

      const res = await axios.post(`${apiBase}/api/${apiPath}/order`, order);
      dispatch(clearCart());
      alert('恭喜您訂購成功');
      setTimeout(() => {
        navigate(`/complete/${res.data.orderId}`, {
          replace: true
        });
      }, 2000);
    } catch (error) {
      alert('訂購失敗', 'error', `${error.response.data.message}`);
    }
  };

  return (<>
    <Stepper />

    <section className="container pt-8 pb-12 pb-lg-15">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow p-2 p-md-6">
            <h2 className="fs-3 card-header">訂購者資訊</h2>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                  <label htmlFor="username" className="form-label">* 姓名</label>
                  <input type="text" className="form-control" {...register('username', {
                    required: '請輸入姓名'
                  })} id="username" />
                  {errors.username && <p className="text-danger mt-1">{ errors.username.message }</p>}
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="form-label">* Email</label>
                  <input type="email" className="form-control" {...register('email', {
                    required: '請輸入Email',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "請輸入有效的 Email 格式",
                    },
                  })} id="email" />
                  {errors.email && <p className="text-danger mt-1">{ errors.email.message }</p>}
                </div>
                <div className="mb-6">
                  <label htmlFor="phone" className="form-label">* 電話</label>
                  <input type="tel" className="form-control" {...register('phone', {
                    required: '請輸入電話',
                    pattern: {
                      value: /^\d{8,10}$/,
                      message: "電話長度需 8~10 碼，且只能是數字",
                    },
                  })} id="phone" />
                  {errors.phone && <p className="text-danger mt-1">{ errors.phone.message }</p>}
                </div>
                <div className="mb-6">
                  <label htmlFor="address" className="form-label">* 地址</label>
                  <input type="text" className="form-control" {...register('address', {
                    required: '請輸入地址'
                  })} id="address" />
                  {errors.address && <p className="text-danger mt-1">{ errors.address.message }</p>}
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="form-label">留言</label>
                  <textarea className="form-control" {...register('message')} id="message" cols="30" rows="6" v-model="form.message" />
                </div>
                
                <div className="d-flex justify-content-center">
                  <Link className="btn btn-outline-secondary me-3" to="/cart">
                    <i className="bi bi-caret-left"></i> 回上一步
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    送出訂單 <i className="bi bi-caret-right"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>);
}

export default Checkout;