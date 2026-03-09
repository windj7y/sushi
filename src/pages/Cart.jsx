import { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { updateStep, removeCartAsync, updateCartNumAsync, removeAllCartAsync, updateCode, checkCouponAsync } from "../slices/cartSlice";

import { money } from '../filter/money';
import useSweetAlert from "../hooks/useSweetAlert";

import Stepper from "../components/Stepper";

const Cart = () => {
  const carts = useSelector(state => state.cart.carts);
  const total = useSelector(state => state.cart.total);
  const final_total = useSelector(state => state.cart.final_total);

  const coupon = useSelector(state => state.cart.coupon);
  const code = useSelector(state => state.cart.code);

  const loading = useSelector(state => state.cart.loading);
  const loadingItem = useSelector(state => state.cart.loadingItem);

  const dispatch = useDispatch();
  const { confirm, alert } = useSweetAlert();

  useEffect(() => {
    dispatch(updateStep(1));
  }, [dispatch]);

  const removeAllCart = async () => {
    const confirmed = await confirm('確定要清空購物車嗎？');
    if (!confirmed) return;

    try {
      await dispatch(removeAllCartAsync()).unwrap();
      alert('刪除商品成功');
    } catch(errorMsg) {
      alert('刪除商品失敗', 'error', `${errorMsg}`);
    }
  }

  const removeCart = async (id) => {
    const confirmed = await confirm('確定要刪除商品嗎？');
    if (!confirmed) return;

    try {
      await dispatch(removeCartAsync(id)).unwrap();
      alert('刪除商品成功');
    } catch (errorMsg) {
      alert('刪除商品失敗', 'error', `${errorMsg}`);
    }
  }

  const updateCart = async (cart, qty) => {
    const { id, product_id } = cart;

    if (qty === 0) {
      alert('購物車數量最少為1', 'error');
      return;
    }
  
    const cartData = {
      id,
      data: {
        product_id,
        qty
      }
    }

    try {
      await dispatch(updateCartNumAsync(cartData)).unwrap();
      alert('更新數量成功');
    } catch (errorMsg) {
      alert('更新數量失敗', 'error', `${errorMsg}`);
    }
  }

  const checkCoupon = async () => {
    const data = {
      code
    }

    try {
      await dispatch(checkCouponAsync(data)).unwrap();
    } catch (errorMsg) {
      alert('取得優惠卷失敗', 'error', `${errorMsg}`);
    }
  }

  const handleCodeChange = (e) => {
    dispatch(updateCode(e.target.value));
  }

  return (<>
    <Stepper />

    <section className="container pt-8 pb-12 pb-lg-15">
      {
        carts.length > 0 ? (<>
          <div className="row gy-6 mb-10">
            <div className="col-lg-8">
              <div className="bg-white h-100 rounded-4 shadow-sm p-6">
                <div className="text-end border-bottom pb-4">
                  <button type="button" className="btn btn-primary btn-sm py-2" onClick={removeAllCart} disabled={loading}>
                    {loading ? <>刪除中 <span className="spinner-border spinner-border-sm" aria-hidden="true"></span></> : '清空購物車'}
                  </button>
                </div>
                <ul className="list-unstyled">
                  {
                    carts.map((cart) => (
                      <li className="border-bottom py-4" key={cart.id}>
                        <div className="row d-none d-md-flex align-items-center">
                          <div className="col-md-3">
                            <img src={cart.product.imageUrl} className="rounded" alt={cart.product.title} />
                          </div>
                          <div className="col-md-4">
                            <h3 className="fs-5 mb-0">{ cart.product.title }</h3>
                          </div>
                          <div className="col-md-2">
                            <span className="fw-bold">${ money(cart.product.price) }</span>
                          </div>
                          <div className="col-md-2">
                            <div className="d-flex align-items-center">
                              <button type="button" className="btn btn-outline-secondary hover-primary btn-sm fs-5 border-0 bg-transparent px-0" onClick={() => updateCart(cart, cart.qty - 1)} disabled={cart.qty === 1}>
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="mx-2">{ cart.qty }</span>
                              <button type="button" className="btn btn-outline-secondary hover-primary btn-sm fs-5 border-0 bg-transparent px-0" onClick={() => updateCart(cart, cart.qty + 1)}>
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </div>
                          <div className="col-md-1 d-flex justify-content-end">
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeCart(cart.id)} disabled={loadingItem === cart.id}>
                              {loadingItem === cart.id ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : <i className="bi bi-trash"></i>}
                            </button>
                          </div>
                        </div>

                        <div className="row g-3 d-md-none align-items-center">
                          <div className="col-4">
                            <img src={cart.product.imageUrl} className="rounded" alt={cart.product.title} />
                          </div>
                          <div className="col-8">
                            <div className="d-flex justify-content-between align-items-center">
                              <h3 className="fs-6 fs-sm-5 mb-0 text-truncate">{ cart.product.title }</h3>
                              <button type="button" className="btn btn-outline-danger btn-sm px-2" onClick={() => removeCart(cart.id)} disabled={loadingItem === cart.id}>
                                {loadingItem === cart.id ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : <i className="bi bi-trash"></i>}
                              </button>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold">${ money(cart.product.price) }</span>
                              <div className="d-flex align-items-center flex-nowrap">
                                <button type="button" className="btn btn-outline-secondary hover-primary btn-sm fs-5 border-0 bg-transparent px-1" onClick={() => updateCart(cart, cart.qty - 1)} disabled={cart.qty === 1}>
                                  <i className="bi bi-dash"></i>
                                </button>
                                <span className="mx-2">{ cart.qty }</span>
                                <button type="button" className="btn btn-outline-secondary hover-primary btn-sm fs-5 border-0 bg-transparent px-1" onClick={() => updateCart(cart, cart.qty + 1)}>
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white h-100 rounded-4 shadow-sm p-6">
                <h3 className="fs-5 mb-4">訂單明細</h3>
                <div className="d-flex justify-content-between">
                  <span>{ carts.length } 項商品小計</span>
                  <span>${ money(total) }</span>
                </div>
                <hr />
                <div className="py-2">
                  <label htmlFor="code" className="form-label">優惠碼</label>
                  <div className="d-flex">
                    <input type="text" className="form-control flex-grow-1 me-2" placeholder="請輸入優惠碼" value={code} onChange={handleCodeChange} />
                    <button className="btn btn-outline-secondary flex-shrink-0" type="button" onClick={checkCoupon} disabled={loadingItem && loadingItem === code} >
                      {loadingItem && loadingItem === code ? <>套用中 <span className="spinner-border spinner-border-sm" aria-hidden="true"></span></> : '套用'}
                    </button>
                  </div>
                  { coupon?.message && <p className="text-success mt-1">{ coupon.message }</p> }
                </div>
                <hr />
                {
                  coupon && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>折扣</span>
                      <span>${ money(total - final_total) }</span>
                    </div>
                  )
                }
                <div className="d-flex justify-content-between fw-bold">
                  <span>總計</span>
                  <span>${ money(final_total) }</span>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <Link className="btn btn-outline-secondary me-3" to="/products">
              <i className="bi bi-caret-left"></i> 繼續購物
            </Link>
            <Link className="btn btn-primary" to="/checkout">
              我要結帳 <i className="bi bi-caret-right"></i>
            </Link>
          </div>
        </>) : (
            <p className="fs-5 text-center">
              您的購物車目前是空的，快去<Link className="link-primary d-inline" to="/products">選購商品</Link>吧！
            </p>
          )
      }
    </section>
  </>);
}

export default Cart;