import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'react-circular-progressbar/dist/styles.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Error from './pages/Error/Error';
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import ProviderData from './pages/ProviderData/ProviderData';
import Rootlayout from './pages/RootLayout/Rootlayout';
import AddProvider from './pages/AddProvider/AddProvider';
import LicenceData from './pages/LicenceData/LicenceData';
import AddLicence from './pages/AddLicence/AddLicence';
import ClientData from './pages/ClientData/ClientData'
import AddClient from './pages/AddClient/AddClient';
import OrderData from './pages/OrdersData/OrdersData';
import AddOrder from './pages/AddOrder/AddOrder';
import UserData from './pages/UserData/UserData';
import AddUser from './pages/AddUser/AddUser';
import Sales from './pages/Sales/Sales';
import Location from './pages/Location/Location';
import Report from './pages/ReportPage/Report';
import ReportDetals from './pages/ReportDetails/ReportDetals';
import Unauthorized from './pages/Unauthorized/Unauthorized';
function App() {
  const router = createBrowserRouter([
    {path: '/unauthorized', element: <Unauthorized />},
    {path: '/', errorElement: <Error/>, children: [
      {index: true, element: <Landing/>},
      {path: 'login', element: <Login/>},
      {path: 'dashboard', element: <Rootlayout/>, children: [
        {path: 'provider/:providerId/update', element: <AddProvider/>},
        {path: 'licence/:licenceId/update', element: <AddLicence/>},
        {path: 'client/:clientId/update', element: <AddClient/>},
        {path: 'order/:orderId/update', element: <AddOrder/>},
        {path: 'user/:userId/update', element: <AddUser/>},
        {path: 'data', children: [
          {path: 'provider', element: <ProviderData/>},
          {path: 'provider/add', element: <AddProvider/>},
          {path: 'licence', element: <LicenceData/>},
          {path: 'licence/add', element: <AddLicence/>},
          {path: 'client', element: <ClientData/>},
          {path: 'client/add', element: <AddClient/>},
          {path: 'order', element: <OrderData/>},
          {path: 'order/add', element: <AddOrder/>},
          {path: 'user', element: <UserData/>},
          {path: 'user/add', element: <AddUser/>},
        ]},
        {path: 'analytics', children: [
          {path: 'sales', element: <Sales/>},
          {path: 'location', element: <Location/>},
        ]},
        {path: 'report', children: [
          {path: 'add', element: <Report/>},
          {path: ':reportId', element: <ReportDetals/>},
        ]}
      ]}
    ]}
  ])

  return (
    <RouterProvider router={router} />
  );
}

export default App;
