import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminFooter from '../components/admin/AdminFooter'
import '../components/admin/admin.css'

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
