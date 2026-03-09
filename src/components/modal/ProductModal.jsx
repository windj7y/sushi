import axios from 'axios';
import { useRef } from "react";
import useMsg from '../../hooks/useMsg';

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const badges = ['hot', 'chef', 'new'];
const badgeLabel = {
  hot: '熱門商品',
  chef: '主廚推薦',
  new: '新品上市'
};

const ProductModal = ({ productModalRef, tempProduct, setTempProduct, type, getProducts, closeModal }) => {
  const fileRef = useRef(null);
  const showMsg = useMsg();

  const updateProduct = async (id) => {
    // 新增產品
    let url = `${apiBase}/api/${apiPath}/admin/product`;
    let method = 'post';

    // 編輯產品
    if (id) {
      url = `${apiBase}/api/${apiPath}/admin/product/${id}`;
      method = 'put';
    }

    const product = {
      data: {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price),
        price: Number(tempProduct.price),
        is_enabled: tempProduct.is_enabled ? 1 : 0
      }
    }

    try {
      const res = await axios[method](url, product);
      showMsg(res.data);
      closeModal();
      getProducts();
    } catch (error) {
      showMsg(error.response.data);
    }
  }

  const removeProduct = async (id) => {
    try {
      const res = await axios.delete(`${apiBase}/api/${apiPath}/admin/product/${id}`);
      showMsg(res.data);
      closeModal();
      getProducts();
    } catch (error) {
      showMsg(error.response.data);
    }
  }

  const uploadFile = async () => {
    const file = fileRef.current.files[0];
    const formData = new FormData();
    formData.append('file-to-upload', file);

    try {
      const res = await axios.post(`${apiBase}/api/${apiPath}/admin/upload`, formData);
      const imageUrl = res.data.imageUrl;
      setTempProduct({
        ...tempProduct,
        imageUrl
      });
      fileRef.current.value = '';
    } catch (error) {
      showMsg(error.response.data);
    }
  }

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'badges') {
      const updatedBadges = checked
        ? [...(tempProduct.badges || []), value]
        : (tempProduct.badges || []).filter((badge) => badge !== value);

      setTempProduct({
        ...tempProduct,
        badges: updatedBadges
      });
    } else {
      setTempProduct({
        ...tempProduct,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  }

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages
    })
  }

  const handleAddImage = () => {
    setTempProduct(() => ({
      ...tempProduct,
      imagesUrl: [...tempProduct.imagesUrl, '']
    }));
  }

  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();
    setTempProduct(() => ({
      ...tempProduct,
      imagesUrl: newImages
    }));
  }

  return (
    <div
      ref={productModalRef}
      id="productModal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 id="productModalLabel" className="modal-title">
              <span>
                { type === 'edit' ? '編輯' : type === 'remove' ? '刪除' : '新增' }產品
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ></button>
          </div>
          <div className="modal-body">
            {
              type === 'remove' ? (
                <p className="h4">
                  確定要刪除
                  <span className="text-danger">{ tempProduct.title }</span>
                  嗎？
                </p>
              ) : (
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-2">
                      <div className="mb-4">
                        <label htmlFor="fileInput" className="form-label">
                          圖片上傳
                        </label>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="form-control"
                          id="fileInput"
                          ref={fileRef}
                          onChange={uploadFile}
                        />
                      </div>
                      <p className="my-2">or</p>
                      <div className="mb-4">
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          name="imageUrl"
                          id="imageUrl"
                          type="text"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                          value={ tempProduct.imageUrl }
                          onChange={handleModalInputChange}
                          />
                      </div>
                      {tempProduct.imageUrl && (
                        <img className="img-fluid" src={ tempProduct.imageUrl } alt="主圖" />
                      )}
                    </div>
                    {tempProduct.imagesUrl.length > 0 && (
                      tempProduct.imagesUrl.map((image, index) => (
                        <div key={index} className="mb-2">
                          <input
                            type="text"
                            className="form-control mb-2"
                            placeholder={`圖片網址 ${index + 1}`}
                            value={image}
                            onChange={(e) => {
                              handleImageChange(e, index)
                            }}
                          />
                          {image && (
                            <img className="img-preview mb-2" src={image} alt={`副圖 ${index + 1}`} />
                          )}
                        </div>
                    )))}
                    <div className="d-flex justify-content-between">
                      {tempProduct.imagesUrl.length < 5 &&
                        tempProduct.imagesUrl[
                          tempProduct.imagesUrl.length - 1
                        ] !== "" && (
                          <button
                            className="btn btn-outline-secondary btn-sm w-100"
                            onClick={handleAddImage}
                          >
                            新增圖片
                          </button>
                      )}

                      {tempProduct.imagesUrl.length >= 1 && (
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={handleRemoveImage}
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="mb-4">
                      <label htmlFor="title" className="form-label">標題</label>
                      <input
                        name="title"
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        value={ tempProduct.title }
                        onChange={handleModalInputChange}
                        />
                    </div>

                    <div className="row">
                      <div className="mb-4 col-md-6">
                        <label htmlFor="category" className="form-label">分類</label>
                        <input
                          name="category"
                          id="category"
                          type="text"
                          className="form-control"
                          placeholder="請輸入分類"
                          value={ tempProduct.category }
                          onChange={handleModalInputChange}
                          />
                      </div>
                      <div className="mb-4 col-md-6">
                        <label htmlFor="unit" className="form-label">單位</label>
                        <input
                          name="unit"
                          id="unit"
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                          value={ tempProduct.unit }
                          onChange={handleModalInputChange}
                          />
                      </div>
                    </div>

                    <div className="row">
                      <div className="mb-4 col-md-6">
                        <label htmlFor="origin_price" className="form-label">原價</label>
                        <input
                          name="origin_price"
                          id="origin_price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入原價"
                          value={ tempProduct.origin_price }
                          onChange={handleModalInputChange}
                          />
                      </div>
                      <div className="mb-4 col-md-6">
                        <label htmlFor="price" className="form-label">售價</label>
                        <input
                          name="price"
                          id="price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入售價"
                          value={ tempProduct.price }
                          onChange={handleModalInputChange}
                          />
                      </div>
                    </div>
                    <hr />

                    <div className="mb-4">
                      <label htmlFor="description" className="form-label">產品描述</label>
                      <textarea
                        name="description"
                        id="description"
                        className="form-control"
                        placeholder="請輸入產品描述"
                        value={ tempProduct.description }
                        onChange={handleModalInputChange}
                        ></textarea>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="content" className="form-label">說明內容</label>
                      <textarea
                        name="content"
                        id="content"
                        className="form-control"
                        placeholder="請輸入說明內容"
                        value={ tempProduct.content }
                        onChange={handleModalInputChange}
                        ></textarea>
                    </div>
                    <div className="mb-4">
                      <label className="form-label w-100">產品標章</label>
                      {
                        badges.map((badge) => (
                          <div className="form-check form-check-inline" key={badge}>
                            <input
                              name="badges"
                              id={badge}
                              className="form-check-input"
                              type="checkbox"
                              value={badge} 
                              checked={tempProduct.badges?.includes(badge)}
                              onChange={handleModalInputChange}
                              />
                            <label className="form-check-label" htmlFor={badge}>
                              { badgeLabel[badge] }
                            </label>
                          </div>
                        ))
                      }
                    </div>
                    <hr />

                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          name="is_enabled"
                          id="is_enabled"
                          className="form-check-input"
                          type="checkbox"
                          checked={ tempProduct.is_enabled }
                          onChange={handleModalInputChange}
                          />
                        <label className="form-check-label" htmlFor="is_enabled">
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              >
              取消
            </button>
            {
              type === 'remove' ? (
                <button type="button" className="btn btn-danger" onClick={() => {
                  removeProduct(tempProduct.id);
                }}>刪除</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => {
                  updateProduct(tempProduct.id);
                }}>確認</button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;