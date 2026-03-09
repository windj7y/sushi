import axios from 'axios';
import useMsg from '../../hooks/useMsg';

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const OrderModal = ({ orderModalRef, tempOrder, type, getOrders, closeModal }) => {
  const showMsg = useMsg();

  const removeOrder = async (id) => {
    try {
      const res = await axios.delete(`${apiBase}/api/${apiPath}/admin/order/${id}`);
      showMsg(res.data);
      closeModal();
      getOrders();
    } catch (error) {
      showMsg(error.response.data);
    }
  }

  return (<>
    <div ref={orderModalRef} id="orderModal" className="modal fade" tabIndex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title" id="orderModalLabel">
              { type === 'view' ? '客戶資料' : '刪除訂單' }
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {
              type === 'view' ? (
                <ul className="list-unstyled">
                  <li>姓名：{ tempOrder.user.name }</li>
                  <li>信箱：{ tempOrder.user.email }</li>
                  <li>電話：{ tempOrder.user.tel }</li>
                  <li>地址：{ tempOrder.user.address }</li>
                  { 
                    tempOrder.message && <li>留言：{ tempOrder.message }</li>
                  }
                </ul>
              ) : (
                <p className="h4">
                  確定要刪除
                  <span className="text-danger">{ tempOrder.user.name }</span>
                  的訂單嗎？
                </p>
              )
            }
          </div>
          <div className="modal-footer">
            {
              type === 'view' ? (
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
              ) : (<>
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
                <button type="button" className="btn btn-danger" onClick={() => {
                  removeOrder(tempOrder.id);
                }}>刪除</button>
              </>)
            }
          </div>
        </div>
      </div>
    </div>
  </>);
}

export default OrderModal;