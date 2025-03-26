import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ApiProvider } from "./config/baseUrl.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/Login.jsx";
import Registration from "./Components/Register.jsx";
import AdminDashboard from "./AdminDashboard/AdminDashboard.jsx";
import EmployeOne from "./EmployeeDashboard/EmployeOne.jsx";
import VeiwMoreFileDetails from "./Components/VeiwMoreFileDetails.jsx";
import EmployeHeader from "./EmployeeDashboard/EmployeeHeader.jsx";
import UserDetails from "./EmployeeDashboard/UserDetails.jsx";
import AddDepartOfOffice from "./AdminDashboard/AddDepartOfOffice.jsx";
import FileHistory from "./Components/FileHistory.jsx";
const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    children: [
      { element: <Login />, path: "/login" },
      { element: <Registration />, path: "/register" },
      { element: <AdminDashboard />, path: "/admindashboard" },
      { element: <EmployeOne />, path: "/employee1" },
      { element: <VeiwMoreFileDetails />, path: "/file-details/:id" },
      { element: <EmployeHeader/>, path:"/employeeheader"},
      { element: <UserDetails/>, path:'/userDetails'},
      { element: <AddDepartOfOffice/>, path:'/addDepartment/:officeId'},
      { element: <FileHistory/>, path: "/file-history/:id"},
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ApiProvider>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </ApiProvider>
    </Provider>
  </StrictMode>
);
