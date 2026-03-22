import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addCartAsync } from "../slices/cartSlice";

import { categories } from '../data/categories';
import { reviews } from '../data/reviews';

import { money } from '../filter/money';
import useSweetAlert from "../hooks/useSweetAlert";

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const Home = () => {
  const [hotProducts, setHotProducts] = useState([]);
  const loadingItem = useSelector(state => state.cart.loadingItem);
  const dispatch = useDispatch();
  const { alert } = useSweetAlert();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/${apiPath}/products/all`);
        const hot = res.data.products.filter(product => product.badges && product.badges.includes('hot'));
        setHotProducts(hot);
      } catch (error) {
        alert('取得產品失敗', 'error', `${error.response.data.message}`);
      }
    }
    
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCart = async (id, qty = 1) => {
    const data = {
      product_id: id,
      qty
    };

    try {
      await dispatch(addCartAsync(data)).unwrap();
      alert('已加入購物車');
    } catch (errorMsg) {
      alert('加入購物車失敗', 'error', `${errorMsg}`);
    }
  }

  return (<>
    <section className="hero">
      <div className="container position-relative z-1">
        <p className="fs-8 fs-lg-7 ls-sm">
          CRAFTED DAILY · PREMIUM SUSHI
        </p>
        <h1 className="display-fs-6 display-fs-lg-4 fw-semibold lh-sm mb-6">
          每日現做壽司
          <br />
          新鮮直送到家
        </h1>
        <Link className="btn btn-primary btn-lg fw-black" to="/products">
          立即選購<i className="bi bi-arrow-right ms-3"></i>
        </Link>
      </div>
    </section>

    <main>
      <section className="bg-white text-center py-11 py-lg-15">
        <div className="container">
          <h2 className="fs-3 fs-md-2 fw-bold mb-4">職人精神 × 嚴選食材</h2>
          <p className="text-secondary fs-md-5 mb-6">
            我們堅持每日現做，<br className="d-sm-none" />選用當季漁獲與日本進口米，<br />
            讓每一口壽司都呈現最純粹的鮮味。
          </p>
          <div className="d-flex justify-content-center gap-3 fs-3">
            <span className="emoji">🍣</span>
            <span className="emoji">🥬</span>
            <span className="emoji">🐚</span>
            <span className="emoji">🍚</span>
            <span className="emoji">🍶</span>
          </div>
        </div>
      </section>

      <section className="container py-11 py-lg-15">
        <div className="text-center mb-8">
          <h2 className="fs-2 fs-md-1 fw-bold mb-2">今天想吃什麼？</h2>
          <p className="fs-5 fw-medium text-secondary">三種風味，三種享受！✨</p>
        </div>
        <ul className="row g-6 list-unstyled">
          {
            categories.map((category) => (
              <li className="col-md-4" key={category.id}>
                <Link className="category text-dark bg-white border rounded-4 overflow-hidden" to={category.link}>
                  <img src={category.img} className="w-100 h-lg-220 object-fit-cover" alt={category.title} />
                  <div className="text-center p-6">
                    <p className="fs-8 text-secondary text-opacity-50 ls-sm mb-2">
                      { category.subTitle }
                    </p>
                    <h3 className="fs-5 fw-semibold">
                      { category.title }
                    </h3>
                  </div>
                </Link>
              </li>
            ))
          }
        </ul>
      </section>

      <section className="container py-11 py-lg-15 overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="fs-2 fs-md-1 fw-bold mb-2">大家都在點什麼？</h2>
          <p className="fs-5 fw-medium text-secondary">人氣美食一次看！🔥</p>
        </div>
        {
          hotProducts && hotProducts.length > 0 ? (
            <Swiper
              slidesPerView={1}
              spaceBetween={16}
              pagination={{ clickable: true }}
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 24 },
                992: { slidesPerView: 4, spaceBetween: 24 },
              }}
              modules={[Pagination]}
              className="overflow-visible"
            >
              {
                hotProducts.map((product) => (
                  <SwiperSlide key={ product.id }>
                    <div className="card hover-shadow">
                      <img src={ product.imageUrl } className="card-img-top" alt={ product.title } />
                      <div className="card-body">
                        <h3 className="fs-5 fw-bold card-title">{ product.title }</h3>
                        <p className="card-text mb-2">{ product.description }</p>
                        <div>
                          <span className="text-primary me-2">${ money(product.price) }</span>
                          <del className="">${ money(product.origin_price) }</del>
                        </div>
                      </div>
                      <div className="card-footer">
                        <Link className="btn btn-outline-secondary w-100 mb-2" to={`/product/${product.id}`}>了解更多</Link>
                        <button type="button" className="btn btn-primary w-100" onClick={() => {
                          addCart(product.id);
                        }} disabled={loadingItem === product.id}>
                          {loadingItem === product.id ? <>加入中 <span className="spinner-border spinner-border-sm" aria-hidden="true"></span></> : '加入購物車'}
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              }
            </Swiper>
          ) : (
            <p>尚無商品資料</p>
          )
        }
      </section>

      <section className="bg-white py-11 py-lg-15 overflow-hidden">
        <div className="container">
          <div className="text-center mb-8 mb-lg-10">
            <h2 className="fs-2 fs-md-1 fw-bold mb-2">顧客的真心話</h2>
            <p className="fw-medium text-secondary">每一口都是故事，每一句都是誠意</p>
          </div>
          <Swiper
            slidesPerView={1}
            spaceBetween={24}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3, grid: { rows: 1, fill: "row" }}
            }}
            modules={[Pagination]}
            className="overflow-visible"
          >
            {
              reviews.map((review, index) => (
                <SwiperSlide className="h-auto" key={index}>
                  <div className="card bg-transparent">
                    <img src={review.img} alt={review.name} className="rounded-4 me-13 me-lg-16" />
                    <div className="card-body d-flex flex-column bg-white shadow rounded-4 p-6 ms-10 ms-lg-12 mt-n10 mt-lg-n12">
                      <h3 className="fs-5 text-black mb-4">
                        {review.city} {review.name}
                      </h3>
                      <p className="text-justify flex-grow-1">{review.comment}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </section>
    </main>
  </>);
}

export default Home;