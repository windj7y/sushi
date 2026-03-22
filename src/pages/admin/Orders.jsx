import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import { money } from '../../filter/money';
import useMsg from '../../hooks/useMsg';
import useSweetAlert from '../../hooks/useSweetAlert';
import dayjs from 'dayjs';

import Pagination from '../../components/Pagination';
import OrderModal from '../../components/modal/OrderModal';

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [tempOrder, setTempOrder] = useState({
    user: {}
  });

  const [type, setType] = useState('');
  const [pagination, setPagination] = useState({});

  const orderModalRef = useRef(null);
  const showMsg = useMsg();
  const { confirm } = useSweetAlert();

  const getOrders = useCallback(async (page = 1) => {
    try {
      const res = await axios.get(`${apiBase}/api/${apiPath}/admin/orders?page=${page}`);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (error) {
      showMsg(error.response.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      await getOrders();
    })();
  }, [getOrders]);

  useEffect(() => {
    orderModalRef.current = new Modal(orderModalRef.current, {
      keyboard: false,
    });
  }, []);

  const updatePaid = async (id) => {
    const oldOrder = orders.find(order => order.id === id);
    const orderData = {
      ...oldOrder,
      is_paid: !oldOrder.is_paid
    };

    try {
      const res = await axios.put(`${apiBase}/api/${apiPath}/admin/order/${id}`, { data: orderData });
      showMsg(res.data);
      getOrders();
    } catch (error) {
      showMsg(error.response.data);
    }
  }

  const removeOrders = async () => {
    const confirmed = await confirm('確定要刪除所有訂單嗎？');
    if (!confirmed) return;
    
    try {
      const res = await axios.delete(`${apiBase}/api/${apiPath}/admin/orders/all`);
      showMsg(res.data);
      closeModal();
      getOrders();
    } catch (error) {
      showMsg(error.response.data);
    }
  }

  const openModal = (order, type) => {
    setTempOrder(order);
    setType(type);
    orderModalRef.current.show();
  }

  const closeModal = () => {
    orderModalRef.current.hide();
  }

  return (<>
    <div className="container">
      <h2 className="fs-3 mb-6">
        <i className="bi bi-file-earmark"></i> 訂單管理
      </h2>
      {
        orders.length > 0 && <div className="text-end mb-6">
          <button className="btn btn-primary" onClick={removeOrders}>刪除所有訂單</button>
        </div>
      }
      <table className="table text-center mb-8">
        <thead>
          <tr>
            <th width="20%" className="text-start">購買時間</th>
            <th className="text-start">購買款項</th>
            <th width="15%">應付金額</th>
            <th width="20%">是否付款</th>
            <th width="10%">客戶資料</th>
            <th width="10%">操作</th>
          </tr>
        </thead>
        <tbody>
          {
            orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={ order.id }>
                  <td className="text-start">
                    { 
                      dayjs(order.create_at * 1000).format("YYYY-MM-DD HH:mm:ss")
                    }
                  </td>
                  <td className="text-start">
                    <ul className="list-unstyled">
                    {
                      Object.values(order.products).map((item) => (
                        <li key={item.id}>
                          【{ item.product.title }】
                          { item.qty } { item.product.unit }
                        </li>
                      ))
                    }
                    </ul>
                  </td>
                  <td>{ money(order.total) }</td>
                  <td>
                    <div className="form-check form-check-inline">
                      <input
                        name="is_paid"
                        id={`is_paid_${index+1}`}
                        className="form-check-input"
                        type="checkbox"
                        checked={ order.is_paid }
                        onChange={() => {
                          updatePaid(order.id)
                        }}
                        />
                      <label className="form-check-label" htmlFor={`is_paid_${index+1}`}>
                        { order.is_paid ? '已付款' : '待付款' }
                      </label>
                    </div>
                  </td>
                  <td>
                    <button type="button" className="btn btn-outline-secondary btn-sm" title="檢視" onClick={() => {
                      openModal(order, 'view');
                    }}>
                      <i className="bi bi-people-fill"></i>
                    </button>
                  </td>
                  <td>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => {
                        openModal(order, 'remove');
                      }}>
                        刪除
                      </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">尚無訂單資料</td>
              </tr>
            )
          }
        </tbody>
      </table>
      <Pagination pagination={pagination} getData={getOrders} path="/admin/orders" />
    </div>
    <OrderModal orderModalRef={orderModalRef} tempOrder={tempOrder} type={type} getOrders={getOrders} closeModal={closeModal} />
  </>);
}

export default Orders;