import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axiosClient from '@/shared/api/axiosClient';

const AdminRoute = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await axiosClient.get('/auth/me');
                if (res.user && res.user.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Đang kiểm tra quyền truy cập...</div>;

    return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
