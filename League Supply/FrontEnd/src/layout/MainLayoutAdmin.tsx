import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/layoutAdmin/AdminHeader'
import AdminSidebar from '../components/admin/layoutAdmin/AdminSidebar'
import AdminFooter from '../components/admin/layoutAdmin/AdminFooter'
import '../components/admin/layoutAdmin/admin.css'

const MainLayoutAdmin = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <AdminSidebar />
      <main className="admin-main"><Outlet /></main>
      <AdminFooter />
    </div>
  )
}

export default MainLayoutAdmin
