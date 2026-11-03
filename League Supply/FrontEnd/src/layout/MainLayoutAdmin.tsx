import { Outlet } from 'react-router-dom';

import AdminHeader from '../components/admin/layoutAdmin/AdminHeader';
import AdminSidebar from '../components/admin/layoutAdmin/AdminSidebar';

import './MainLayoutAdmin.css';

const MainLayoutAdmin = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />

      <div className="admin-layout-corpo">
        <AdminSidebar />

        <main className="admin-layout-conteudo">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayoutAdmin;