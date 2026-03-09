import { createHashRouter, RouterProvider } from 'react-router'
import routes from './routes/index.jsx'
import MsgToast from './components/MsgToast.jsx';

const App = () => {
  const router = createHashRouter(routes);
  return (<>
    <MsgToast />
    <RouterProvider router={router} />
  </>)
}

export default App
