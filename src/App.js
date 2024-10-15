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
                        {/* Trang Home không cần đăng nhập */}
                        <Route element={<MainLayout />}>
                            <Route path="/home" element={<PropertyList />} />
                        </Route>

                        {/* Các route yêu cầu đăng nhập */}
                        <Route element={<MainLayout />}>
                            <Route path="/property/detail/:id" element={<PrivateRoute element={<PropertyDetail />} />} />
                            <Route path="/booking/:id" element={<PrivateRoute element={<BookingForm />} />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/user/detail" element={<PrivateRoute element={<UserDetail />} />} />
                            <Route path="/success-page" element={<PrivateRoute element={<SuccessPage />} />} />
                            <Route path="/profile-update" element={<PrivateRoute element={<UpdateUserProfile />} />} />
                            <Route path="/change-password" element={<PrivateRoute element={<ChangePassword />} />} />
                            <Route path="/user/view-profile" element={<PrivateRoute element={<ViewUserProfile />} />} />
                            <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminDashboard />} requiredRole="ROLE_ADMIN" />} />
                        </Route>

                        {/* Các route dùng HostLayout */}
                        <Route element={<HostLayout />}>
                            <Route path="/host/dashboard" element={<PrivateRoute element={<HostDashboard />} requiredRole="ROLE_HOST" />} />
                            <Route path="/host/listMyHome" element={<PrivateRoute element={<ListMyHomestay />} requiredRole="ROLE_HOST" />} />
                            <Route path="/host/update-property/:id" element={<PrivateRoute element={<UpdateProperty />} requiredRole="ROLE_HOST" />} />
                            <Route path="/host/create-property" element={<PrivateRoute element={<PostForm />} requiredRole="ROLE_HOST" />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        );
    };

    export default App;