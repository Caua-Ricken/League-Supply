import { Outlet } from 'react-router-dom';
import UserHeader from '../components/user/layoutUser/UserHeader';
import UserFooter from '../components/user/layoutUser/UserFooter'
import { CarrinhoProvider } from '../context/CarrinhoContext';
import './MainLayoutUser.css';

const MainLayoutUser = () => {
  return (
    <CarrinhoProvider>
  <div className="user-layout">
    <UserHeader />

    <main className="user-main">
      <Outlet />
    </main>

    <UserFooter />
  </div>
</CarrinhoProvider>
  );
};

export default MainLayoutUser;