import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import PropertyList from './components/property/PropertyList';
import PropertyDetail from './components/property/PropertyDetail';
import Login from './components/auth/Login';
import Header from "./components/property/Header";
import Footer from "./components/property/Footer";
import BookingForm from "./components/booking/BookingForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./components/auth/AuthContext";
import HostDashboard from "./components/host/HostDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import ListMyHomestay from "./components/host/ListMyHomestay";
import RegisterForm from "./components/user/Register";
import ViewUserProfile from "./components/user/ViewUserProfile";
import PrivateRoute from './components/PrivateRoute';
import SuccessPage from './components/user/SuccessPage';
import UserHistoryBooking from "./components/admin/UserHistoryBooking"; // Import SuccessPage
import UpdateUserProfile from "./components/user/UpdateUserProfile"; // Import SuccessPage
import ChangePassword from "./components/user/ChangePassword"
import UpdateProperty from "./components/host/UpdateProperty";
import AddNewProperty from "./components/host/AddProperty";
import MonthlyRevenue from "./components/host/MonthlyRevenue";
import UserBooking from "./components/booking/UserBooking";
import OwnerBookingHistory from "./components/host/OwnerBookingHistory";
import HostTable from "./components/admin/HostTable";
import HostProperties from "./components/admin/HostProperties";
import UserTable from "./components/admin/UserTable";

import HostChatWindow from "./components/comunication/HostChatWindow";
import AboutUs from "./components/property/AboutUs";
import Founders from "./components/property/Founders";


const MainLayout = () => (
    <>
        <Header />
        <Outlet />
        <Footer />
    </>
);

const HostLayout = () => (
    <>
        <Outlet /> {/* Không có Header và Footer */}
    </>
);

const LoginLayout = () => (
    <>
        <Outlet /> {/* Không có Header và Footer */}
    </>
);
const AdminLayout = () => (
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
                        <Route path="/" element={<PropertyList />} />
                        <Route path="/home" element={<PropertyList />} />
                        <Route path="/property/detail/:id" element={<PropertyDetail />} />
                        <Route path="/booking/:id" element={<BookingForm />} />
                        <Route path="/home/about" element={<AboutUs />} />
                        <Route path="/home/founders" element={<Founders />} />

                        <Route path="/user/history-booking" element={<UserBooking />} />


                        <Route path="/admin/user-detail/:userId" element={<UserHistoryBooking />} />
                        <Route path="/success-page" element={<SuccessPage />} />
                        <Route path="/profile-update" element={<UpdateUserProfile />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/user/view-profile" element={<ViewUserProfile />} />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <PrivateRoute requiredRole="ROLE_ADMIN" element={<AdminDashboard />} />
                            }
                        />



                    </Route>

                    {/* Các route dùng HostLayout */}
                    <Route element={<HostLayout />}>
                        <Route
                            path="/host/dashboard"
                            element={
                                <PrivateRoute requiredRole="ROLE_HOST" element={<HostDashboard />} />
                            }
                        />

                        <Route
                            path="/host/update-property/:id"
                            element={
                                <PrivateRoute requiredRole="ROLE_HOST" element={<UpdateProperty />} />
                            }
                        />


                        <Route
                            path="/host/listMyHome"
                            element={
                                <PrivateRoute requiredRole="ROLE_HOST" element={<ListMyHomestay />} />
                            }
                        />


                        <Route path="/host/create-property" element={
                            <PrivateRoute requiredRole="ROLE_HOST"
                               element={<AddNewProperty />} />
                        }
                        />

                        <Route
                            path="/host/monthlyRevenue"
                            element={
                                <PrivateRoute requiredRole="ROLE_HOST" element={<MonthlyRevenue />} />
                            }
                        />


                        <Route
                            path="/host/ownerBookingHistory"
                            element={
                                <PrivateRoute requiredRole="ROLE_HOST" element={<OwnerBookingHistory />} />
                            }
                        />


                        <Route
                            path="/host/chat-room/:chatRoomId"
                            element={
                                <PrivateRoute requiredRole="ROLE_HOST" element={<HostChatWindow />} />
                            }
                        />

                    </Route>


                    <Route element={<LoginLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<RegisterForm />} />



                    </Route>

                    <Route element={<AdminLayout />}>
                        <Route path="admin/users" element={<UserTable/>}/>
                        <Route path="admin/hosts" element={<HostTable />} />
                        <Route path="/host-properties/:hostId" element={<HostProperties />} />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <PrivateRoute requiredRole="ROLE_ADMIN" element={<AdminDashboard />} />
                            }
                        />
                        <Route
                            path="/admin/user-detail/:userId"
                            element={
                                <PrivateRoute requiredRole="ROLE_ADMIN" element={<UserHistoryBooking />} />
                            }
                        />

                    </Route>





                    <Route
                        path="/host/*"
                        element={<PrivateRoute requiredRole="ROLE_HOST" />}
                    />
                    <Route
                        path="/admin/*"
                        element={<PrivateRoute requiredRole="ROLE_ADMIN" />}

                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};


export default App;