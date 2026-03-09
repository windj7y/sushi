import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import useMsg from '../../hooks/useMsg';
import dayjs from 'dayjs';

import Pagination from '../../components/Pagination';
import CouponModal from '../../components/modal/CouponModal';

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [tempCoupon, setTempCoupon] = useState({
    id: '',
    title: '',
    code: '',
    percent: '',
    due_date: '',
    is_enabled: ''
  });

  const [type, setType] = useState('');
  const [pagination, setPagination] = useState({});

  const couponModalRef = useRef(null);
  const showMsg = useMsg();

  useEffect(() => {
    couponModalRef.current = new Modal(couponModalRef.current, {
      keyboard: false,
    });

    getCoupons();
  }, []);

  const getCoupons = async (page = 1) => {
    try {
      const res = await axios.get(`${apiBase}/api/${apiPath}/admin/coupons?page=${page}`);
      setCoupons(res.data.coupons);
      setPagination(res.data.pagination);
    } catch (error) {
      showMsg(error.response.data);
    }
  }

  const openModal = (coupon, type) => {
    setTempCoupon({
      id: coupon.id || '',
      title: coupon.title || '',
      code: coupon.code || '',
      percent: coupon.percent || '',
      due_date: coupon?.due_date? dayjs.unix(coupon.due_date).format("YYYY-MM-DD") : '',
      is_enabled: coupon.is_enabled || ''
    });
    setType(type);
    couponModalRef.current.show();
  }

  const closeModal = () => {
    couponModalRef.current.hide();
  }

  return (<>
    <div className="container">
      <h2 className="fs-3 mb-6">
        <i className="bi bi-ticket-perforated"></i> 優惠卷管理
      </h2>
      <div className="text-end mb-6">
        <button className="btn btn-primary" onClick={() => {
          openModal({}, 'add');
        }}>建立新的優惠卷</button>
      </div>
      <table className="table text-center mb-8">
        <thead>
          <tr>
            <th>標題</th>
            <th>優惠碼</th>
            <th width="15%">折扣</th>
            <th width="15%">到期日</th>
            <th width="15%">是否啟用</th>
            <th width="150">操作</th>
          </tr>
        </thead>
        <tbody>
          {
            coupons && coupons.length > 0 ? (
              coupons.map((coupon) => (
                <tr key={ coupon.id }>
                  <td>{ coupon.title }</td>
                  <td>{ coupon.code }</td>
                  <td>{ coupon.percent }</td>
                  <td>{ dayjs.unix(coupon.due_date).format("YYYY-MM-DD") }</td>
                  <td>
                    { coupon.is_enabled ? <span className="text-success">啟用</span> : <span>未啟用</span> }
                  </td>
                  <td>
                    <div className="btn-group">
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
                        openModal(coupon, 'edit');
                      }}>
                        編輯
                      </button>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => {
                        openModal(coupon, 'remove');
                      }}>
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">尚無優惠卷資料</td>
              </tr>
            )
          }
        </tbody>
      </table>
      <Pagination pagination={pagination} getData={getCoupons} path="/admin/coupons" />
    </div>
    <CouponModal couponModalRef={couponModalRef} tempCoupon={tempCoupon} setTempCoupon={setTempCoupon} type={type} getCoupons={getCoupons} closeModal={closeModal} />
  </>);
}

export default Coupons;