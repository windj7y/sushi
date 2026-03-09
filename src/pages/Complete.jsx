import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { updateStep } from "../slices/cartSlice";

import { money } from '../filter/money';
import useSweetAlert from "../hooks/useSweetAlert";
import dayjs from 'dayjs';

import Stepper from "../components/Stepper";

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const Complete = () => {
  const [order, setOrder] = useState({
    products: {},
    user: {}
  });
  const [discount, setDiscount] = useState(0);
  const { id } = useParams();

  const dispatch = useDispatch();
  const { alert } = useSweetAlert();

  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/${apiPath}/order/${id}`);
        const orderData = res.data.order;
        setOrder(orderData);

        const totalDiscount = Object.values(orderData.products).reduce((acc, item) => {
          if (item.coupon && item.coupon.is_enabled) {
            return acc + (item.total - item.final_total);
          }
          return acc;
        }, 0);
        setDiscount(totalDiscount);
      } catch (error) {
        alert('取得訂單失敗', 'error', `${error.response.data.message}`);
      }
    }

    getOrder();
  }, []);

  useEffect(() => {
    dispatch(updateStep(3));
  }, [dispatch]);

  return (<>
    <Stepper />

    <section className="container pt-8 pb-12 pb-lg-15">
      <div className="text-center mb-10">
        <span className="d-block display-6 mb-2">🎉</span>
        <h2 className="fs-3 fs-md-2">訂購成功</h2>
      </div>

      <div className="row gy-6 mb-10">
        <div className="col-lg-8">
          <div className="bg-white h-100 rounded-4 shadow-sm p-6">
            <h3 className="fs-5 fs-md-4 ">訂單明細</h3>
            <div className="text-secondary border-bottom pb-4">
              <p className="fs-7 fs-sm-6 mb-0">訂單編號：{ order.id }</p>
              <p className="fs-7 fs-sm-6 mb-0">建立時間：{ dayjs(order.create_at * 1000).format("YYYY-MM-DD HH:mm:ss") }</p>
            </div>
            <ul className="list-unstyled mb-4">
            {
              Object.values(order.products).map((item) => (
                <li key={item.id} className="border-bottom py-4">
                  <div className="d-flex align-items-center">

                    <img
                      className="rounded me-3"
                      width="80"
                      src={item.product.imageUrl}
                      alt={item.product.title}
                    />

                    <div className="flex-grow-1">
                      <h3 className="fs-6 fs-md-5 mb-1">
                        {item.product.title}
                      </h3>
                      <small className="text-secondary">
                        數量 × {item.qty}
                      </small>
                    </div>

                    <div className="fw-bold">
                      ${money(item.final_total || item.total)}
                    </div>

                  </div>
                </li>
              ))
            }
            </ul>
            {
              discount > 0 && (<>
                <div className="d-flex justify-content-between mb-1">
                  <span>小計</span>
                  <span>${ money(order.total + discount) }</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>折扣</span>
                  <span className="text-danger">
                    - ${ money(discount) }
                  </span>
                </div>
              </>)
            }
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>總計</span>
              <span>${ money(order.total) }</span>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-white h-100 rounded-4 shadow-sm p-6">
            <h3 className="fs-5 fs-md-4 border-bottom pb-4">訂購者資訊</h3>
            <ul className="list-unstyled py-2">
              <li className="d-flex justify-content-between mb-3">
                <span className="fw-bold text-secondary">姓名</span>
                <span>{ order.user.name }</span>
              </li>
              <li className="d-flex justify-content-between mb-3">
                <span className="fw-bold text-secondary">信箱</span>
                <span>{ order.user.email }</span>
              </li>
              <li className="d-flex justify-content-between mb-3">
                <span className="fw-bold text-secondary">電話</span>
                <span>{ order.user.tel }</span>
              </li>
              <li className="d-flex justify-content-between mb-3">
                <span className="fw-bold text-secondary">地址</span>
                <span className="text-end">{ order.user.address }</span>
              </li>
              {
                order.message && (
                  <li className="border-top pt-3 mt-3">
                    <span className="fw-bold text-secondary d-block mb-1">留言</span>
                    <small>{order.message}</small>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  </>);
}

export default Complete;