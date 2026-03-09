import axios from 'axios';
import useMsg from '../../hooks/useMsg';
import dayjs from 'dayjs';

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const CouponModal = ({ couponModalRef, tempCoupon, setTempCoupon, type, getCoupons, closeModal }) => {
  const showMsg = useMsg();

  const updateCoupon = async (id) => {
    // 新增優惠券
    let url = `${apiBase}/api/${apiPath}/admin/coupon`;
    let method = 'post';

    // 編輯優惠券
    if (id) {
      url = `${apiBase}/api/${apiPath}/admin/coupon/${id}`;
      method = 'put';
    }

    const data = {
      ...tempCoupon,
      percent: Number(tempCoupon.percent),
      due_date: dayjs(tempCoupon.due_date).unix(),
      is_enabled: tempCoupon.is_enabled ? 1 : 0
    }

    try {
      const res = await axios[method](url, { data });
      showMsg(res.data);
      closeModal();
      getCoupons();
    } catch (error) {
      showMsg(error.response.data);
    }
  }

  const removeCoupon = async (id) => {
    try {
      const res = await axios.delete(`${apiBase}/api/${apiPath}/admin/coupon/${id}`);
      showMsg(res.data);
      closeModal();
      getCoupons();
    } catch (error) {
      showMsg(error.response.data);
    }
  }

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempCoupon({
      ...tempCoupon,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  return (<>
    <div ref={couponModalRef} id="couponModal" className="modal fade" tabIndex="-1" aria-labelledby="couponModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title" id="couponModalLabel">
              { type === 'edit' ? '編輯' : type === 'remove' ? '刪除' : '新增' }優惠卷
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {
              type === 'remove' ? (
                <p className="h4">
                  確定要刪除
                  <span className="text-danger">{ tempCoupon.title }</span>
                  嗎？
                </p>
              ) : (<>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">標題</label>
                  <input type="text" className="form-control" name="title" id="title" placeholder="請輸入標題" value={ tempCoupon.title } onChange={handleModalInputChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">優惠碼</label>
                  <input type="text" className="form-control" name="code" id="code" placeholder="請輸入優惠碼" value={ tempCoupon.code } onChange={handleModalInputChange} />
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="percent" className="form-label">折扣</label>
                    <input type="number" className="form-control" name="percent" id="percent" placeholder="請輸入折扣" value={ tempCoupon.percent } onChange={handleModalInputChange} />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="due_date" className="form-label">到期日</label>
                    <input type="date" className="form-control" name="due_date" id="due_date" placeholder="請輸入到期日" value={ tempCoupon.due_date } onChange={handleModalInputChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      name="is_enabled"
                      id="is_enabled"
                      className="form-check-input"
                      type="checkbox"
                      checked={ tempCoupon.is_enabled }
                      onChange={handleModalInputChange}
                      />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </>)
            }
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
            {
              type === 'remove' ? (
                <button type="button" className="btn btn-danger" onClick={() => {
                  removeCoupon(tempCoupon.id);
                }}>刪除</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => {
                  updateCoupon(tempCoupon.id);
                }}>確認</button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  </>);
}

export default CouponModal;