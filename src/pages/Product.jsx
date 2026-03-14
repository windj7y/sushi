import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addCartAsync } from "../slices/cartSlice";

import { money } from '../filter/money';
import useSweetAlert from "../hooks/useSweetAlert";

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const badgeLabel = {
  hot: '🔥熱門商品',
  chef: '👨‍🍳主廚推薦',
  new: '✨新品上市'
};

const Product = () => {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const { id } = useParams();

  const loadingItem = useSelector(state => state.cart.loadingItem);
  const dispatch = useDispatch();
  const { alert } = useSweetAlert();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/${apiPath}/product/${id}`);
        setProduct(res.data.product);
        getProducts(res.data.product.category);
      } catch (error) {
        alert('取得產品失敗', 'error', `${error.response.data.message}`);
      }
    }

    const getProducts = async (category = '') => {
      try {
        const res = await axios.get(`${apiBase}/api/${apiPath}/products?category=${category}`);
        const productData = res.data.products.filter((product) => product.id !== id);
        setProducts(productData);
      } catch (error) {
        alert('取得產品失敗', 'error', `${error.response.data.message}`);
      }
    }

    getProduct();
  }, [id]);

  const addCart = async (product_id) => {
    const data = {
      product_id,
      qty: 1
    };

    try {
      await dispatch(addCartAsync(data)).unwrap();
      alert('已加入購物車');
    } catch (errorMsg) {
      alert('加入購物車失敗', 'error', `${errorMsg}`);
    }
  }

  return (<>
    <section className="container py-11 py-lg-13 border-top border-secondary-subtle">
    {
      product ? (<>
        <span className="badge bg-secondary mb-2">{ product.category }</span>
        <h2 className="fs-3 fs-md-2 fw-bold mb-4">{ product.title }</h2>
        <div className="row g-6 gx-lg-11 gy-lg-0 justify-content-center align-items-center">
          <div className="col-lg-7 position-relative">
            <img src={product.imageUrl} className="w-100 object-fit-cover rounded-5 shadow-sm" alt={product.title} />
            <ul className="d-none d-md-flex gap-2 list-unstyled position-absolute bottom-0 start-0 px-10 py-2">
              {product.badges?.map((badge) => (
                <li key={badge}>
                  <span className="tag tag-glass rounded-pill">
                    { badgeLabel[badge] || badge }
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-5">
            <p className="fs-5 fs-lg-4 text-secondary text-justify mb-3">{ product.content }</p>
            <p className="fs-6 text-secondary mb-4"><em>-- { product.description } --</em></p>
            <div className="text-end mb-4">
              <span className="text-danger fs-4 me-2">${ money(product.price) }</span>
              <del className="fs-5 text-secondary">${ money(product.origin_price) }</del>
            </div>
            <button type="button" className="btn btn-primary fs-5 w-100 py-3" onClick={() => {
              addCart(product.id);
            }} disabled={loadingItem === product.id}>
              {loadingItem === product.id ? <>加入中 <span className="spinner-border spinner-border-sm" aria-hidden="true"></span></> : '加入購物車'}
            </button>
          </div>
        </div>
      </>) : (
        <p>尚無商品資料</p>
      )
    }
    </section>

    <section className="bg-white py-11 py-lg-13">
      <div className="container">
        <ul className="nav nav-tabs mb-4" id="productTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="shipping-tab" data-bs-toggle="tab"
              data-bs-target="#shipping-info" type="button" role="tab"
              aria-controls="shipping-info" aria-selected="true">
              購物須知
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="faq-tab" data-bs-toggle="tab"
              data-bs-target="#faq" type="button" role="tab"
              aria-controls="faq" aria-selected="false">
              常見問題
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="ingredients-tab" data-bs-toggle="tab"
              data-bs-target="#ingredients" type="button" role="tab"
              aria-controls="ingredients" aria-selected="false">
              食材來源
            </button>
          </li>
        </ul>

        <div className="tab-content text-justify lh-lg rounded-4 p-5" id="productTabContent">
          <div className="tab-pane fade show active" id="shipping-info" role="tabpanel" aria-labelledby="shipping-tab">
            <div className="mb-6">
              <h4 className="fs-5 fw-bold mb-2">配送方式</h4>
              <ul className="text-secondary">
                <li>本店商品皆採「低溫冷藏宅配」配送，確保生魚片的新鮮品質。</li>
                <li>出貨後約 1–2 個工作天送達（依宅配物流實際配送為準）。</li>
                <li>部分偏遠地區或離島可能無法配送，敬請見諒。</li>
              </ul>
            </div>
            <div className="mb-6">
              <h4 className="fs-5 fw-bold mb-2">保存方式</h4>
              <ul className="text-secondary">
                <li>商品收到後請立即冷藏保存（0°C ~ 5°C）。</li>
                <li>建議於當日食用完畢，以確保最佳風味與口感。</li>
                <li>若未立即食用，請密封保存並避免長時間暴露於室溫。</li>
              </ul>
            </div>
            <div className="mb-6">
              <h4 className="fs-5 fw-bold mb-2">注意事項</h4>
              <ul className="text-secondary">
                <li>商品為新鮮食材，圖片僅供參考，實際商品以實物為準。</li>
                <li>生魚片屬易腐食品，請務必確認收貨時間以確保新鮮。</li>
                <li>若有海鮮過敏體質者，請評估後再食用。</li>
              </ul>
            </div>
            <div>
              <h4 className="fs-5 fw-bold mb-2">退換貨說明</h4>
              <ul className="text-secondary">
                <li>生鮮食品基於食品安全與衛生考量，恕不接受退換貨。</li>
                <li>若商品於配送過程中有嚴重損壞或品質問題，請於 2 小時內拍照並聯繫客服。</li>
                <li>客服將協助您進行後續處理。</li>
              </ul>
            </div>
          </div>

          <div className="tab-pane fade" id="faq" role="tabpanel" aria-labelledby="faq-tab">
            <ul className="list-unstyled text-secondary">
              <li className="mb-6">
                <p className="fw-bold mb-2">Q: 商品是否可指定送達日期？</p>
                <p>A: 部分宅配可指定送達時間，請於下單時備註。</p>
              </li>
              <li className="mb-6">
                <p className="fw-bold mb-2">Q: 若收到商品不新鮮怎麼辦？</p>
                <p>A: 請立即拍照並聯繫客服，我們會依情況處理。</p>
              </li>
              <li>
                <p className="fw-bold mb-2">Q: 可以一次購買多盒嗎？</p>
                <p>A: 可以，多盒購買可享運費優惠，詳情請查看結帳頁。</p>
              </li>
            </ul>
          </div>

          <div className="tab-pane fade" id="ingredients" role="tabpanel" aria-labelledby="ingredients-tab">
            <ul className="text-secondary">
              <li>所有生魚片皆選用當日新鮮漁獲，確保食材鮮度。</li>
              <li>主要漁場：台灣沿海及國際認證漁場。</li>
              <li>每批食材皆經過嚴格檢驗，符合衛生安全標準。</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="py-11 py-lg-13 overflow-hidden">
      <div className="container">
        <h3 className="mb-6">你可能也會喜歡</h3>
        {
          products && products.length > 0 ? (
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
                products.map((product) => (
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
      </div>
    </section>
  </>);
}

export default Product;