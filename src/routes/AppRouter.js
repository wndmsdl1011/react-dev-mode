import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

// Layout
import AppLayOut from "../Layout/AppLayOut";

// Pages
import HomePage from "../pages/Homepage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import MyPage from "../pages/MyPage/MyPage";
import PersonalRegisterPage from "../pages/RegisterPage/PersonalRegisterPage";
import NotaryRegisterPage from "../pages/RegisterPage/NotaryRegisterPage";
import WillWritePage from "../pages/WillWritePage";
import WillDetailPage from "../pages/WillDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import WillDetails from "../pages/WillDetailPage";
import UserProfileComponent from "../components/UserProfileComponent";
import UserMyPage from "../pages/MyPage/MyPage";
import NotaryServicePage from "../pages/NotaryServicePage/NotaryServicePage";
import NotaryServiceCreatePage from "../pages/NotaryServicePage/NotaryServiceCreatePage";
import AdminManagement from "../pages/AdminManagement/AdminManagement";
import UserWillListPage from "../pages/WillListPage/UserWillListPage";
import NotaryWillListPage from "../pages/WillListPage/NotaryWillListPage";

const AppRouter = () => {
  const userType = sessionStorage.getItem('role'); 

  return (
    <Routes>
      {/* Main App Layout - All pages below share the AppLayOut */}
      <Route element={<AppLayOut />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/personal" element={<PersonalRegisterPage />} />
        <Route path="/register/notary" element={<NotaryRegisterPage />} />

        {/* User Routes */}
        <Route path="/mypage" element={<MyPage />} />

        {/* Will Routes */}
        <Route path="/write" element={<WillWritePage />} />
        {/* Dynamic route for Will detail, supports backend integration */}
        <Route path="/will/:willId" element={<WillDetailPage />} />
        <Route
          path="/success"
          element={
            userType == "NOTARY" ? (
              <AdminManagement />
            ) : (
              <UserWillListPage />
            )
          }
        />
        <Route path="/detail/:willId" element={<WillDetails />} />
        <Route path="/name" element={<UserProfileComponent />} />
        <Route path="/MyPage" element={<UserMyPage />} />
        <Route path="/notary-service" element={<NotaryServicePage />} />
        <Route
          path="/notary-service/create"
          element={<NotaryServiceCreatePage />}
        />

        <Route path="/admin" element={<AdminManagement />} />
      </Route>

      {/* Catch-All Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
