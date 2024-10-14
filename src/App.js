import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import PropertyList from './components/property/PropertyList';
import PropertyDetail from './components/property/PropertyDetail';
import PostForm from './components/property/PostForm';
import Login from './components/auth/Login';
import Header from "./components/property/Header";
import Footer from "./components/property/Footer";
import BookingForm from "./components/booking/BookingForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider } from "./components/auth/AuthContext";
import HostDashboard from "./components/host/HostDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import ListMyHomestay from "./components/host/ListMyHomestay";
import RegisterForm from "./components/user/Register";
import ViewUserProfile from "./components/user/ViewUserProfile";
import PrivateRoute from './components/PrivateRoute';
import SuccessPage from './components/user/SuccessPage';
import UserDetail from "./components/user/UserDetail";
import UpdateUserProfile from "./components/user/UpdateUserProfile";
import ChangePassword from "./components/user/ChangePassword";
import UpdateProperty from "./components/host/UpdateProperty";

// Main Layout: Dùng cho tất cả các route không thuộc host
const MainLayout = () => (
    <>
        <Header />
        <Outlet />
        <Footer />
    </>
);

// Host Layout: Dùng cho tất cả các route liên quan đến host
const HostLayout = () => (
    <>
        <Outlet /> {/* Không có Header và Footer */}
    </>
);

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Các route dùng MainLayout */}
                    <Route element={<MainLayout />}>
                        <Route path="/home" element={<PropertyList />} />
                        <Route path="/property/detail/:id" element={<PropertyDetail />} />
                        <Route path="/booking/:id" element={<BookingForm />} />
                        <Route path="/host/update-property/:id" element={<UpdateProperty />} />
                        <Route path="/host/create-property" element={<PostForm />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/user/detail" element={<UserDetail />} />
                        <Route path="/success-page" element={<SuccessPage />} />
                        <Route path="/profile-update" element={<UpdateUserProfile />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/user/view-profile" element={<ViewUserProfile />} />
                    </Route>

                    {/* Các route dùng HostLayout */}
                    <Route element={<HostLayout />}>
                        <Route path="/host/dashboard" element={<HostDashboard />} />
                        <Route path="/host/update-property/:id" element={<UpdateProperty />} />
                        <Route path="/host/listMyHome" element={<ListMyHomestay />} />
                        <Route path="/host/create-property" element={<PostForm />} />
                    </Route>

                    {/* Các route bảo vệ bằng quyền hạn */}
                    <Route element={<PrivateRoute requiredRole="ROLE_ADMIN" />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;