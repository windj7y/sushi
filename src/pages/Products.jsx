import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addCartAsync } from "../slices/cartSlice";

import { money } from '../filter/money';
import useSweetAlert from "../hooks/useSweetAlert";

import Pagination from '../components/Pagination';
import FullPageLoading from '../components/FullPageLoading';

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const categories = [
  { 
    name: '', 
    slug: ''
  },
  { 
    name: '壽司', 
    slug: 'sushi'
  },
  { 
    name: '生魚片',
    slug: 'sashimi'
  },
  { 
    name: '丼飯',
    slug: 'donburi'
  }
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const loadingItem = useSelector(state => state.cart.loadingItem);
  const dispatch = useDispatch();
  const { alert } = useSweetAlert();

  const { categorySlug } = useParams();
  const categoryDef = categories.find((item) => item.slug === categorySlug)?.name || '';
  const [category, setCategory] = useState(categoryDef);

  const getProducts = useCallback(async (page = 1, category = '') => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiBase}/api/${apiPath}/products?page=${page}&category=${category}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      alert('取得產品失敗', 'error', `${error.response.data.message}`);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      await getProducts(1, category);
    })();
  }, [category, getProducts]);

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

  const handleCategoryChange = (item) => {
    setCategory(item);
  };

  return (<>
    <FullPageLoading loading={loading} />
    
    <section className="container-lg px-0 px-lg-3">
      <div className="position-relative">
        <img src="https://storage.googleapis.com/vue-course-api.appspot.com/wind-api/1774129532721.jpg" className="w-100 h-450 object-fit-cover" alt="product-banner" />
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <div className="position-absolute top-50 start-50 translate-middle text-white text-center ls-sm">
          <h2 className="fs-2 fs-md-1 fw">商品專區</h2>
        </div>
      </div>
    </section>

    <main className="container mb-10">
      <section className="py-11 py-lg-13">
        <ul className="row justify-content-center border-bottom pb-6 list-unstyled">
          {categories.map((item) => (
            <li className="col-auto text-center" key={item.slug}>
              <button
                type="button"
                className={`link-underline-slide p-0 mx-sm-2 mx-lg-5 ${category === item.name ? 'active' : ''}`}
                onClick={() => handleCategoryChange(item.name)}
              >
                <span className="d-block small text-uppercase opacity-50">{ item.slug || 'all' }</span>
                <span className="fs-5 fw-bold">{ item.name || '全部' }</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <ul className="row gy-6 list-unstyled">
          {
            products && products.length > 0 ? (
              products.map((product) => (
                <li className="col-md-6 col-lg-3" key={ product.id }>
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
                </li>
              ))
            ) : (
              <li>尚無商品資料</li>
            )
          }
        </ul>
      </section>
      <Pagination pagination={pagination} getData={getProducts} path="/products" category={category} />
    </main>
  </>);
}

export default Products;