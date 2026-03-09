import { useDispatch } from "react-redux";
import { addMsg, removeMsg } from "../slices/msgSlice";

const useMsg = () => {
  const dispatch = useDispatch();

  const showMsg = (data) => {
    const id = Date.now();
    const isSuccess = data.success || data.status;

    const msgData = {
      id,
      type: isSuccess ? 'success' : 'danger',
      title: isSuccess ? '成功' : '失敗',
      text: Array.isArray(data.message)
        ? data.message.join("、")
        : data.message,
    };

    dispatch(addMsg(msgData));

    setTimeout(() => {
      dispatch(removeMsg(id));
    }, 2000);
  };

  return showMsg;
};

export default useMsg;