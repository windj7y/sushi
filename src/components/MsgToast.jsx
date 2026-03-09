import { useSelector } from "react-redux";

const MsgToast = () => {
  const msgs = useSelector((state) => state.msg);
  
  return (<>
    <div className="toast-container position-fixed bottom-0 end-0 p-4">
      {
        msgs.map((msg) => (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" key={msg.id}>
            <div className={`toast-header bg-${msg.type}`}>
              <strong className="text-white me-auto">{ msg.title }</strong>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body bg-white">
              { msg.text }
            </div>
          </div>
        ))
      }
    </div>
  </>);
}

export default MsgToast;