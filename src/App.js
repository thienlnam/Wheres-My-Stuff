import React, { useState } from 'react';
import 'antd/dist/antd.css';
import ItemListPage from './pages/ItemListPage';
import ContainerPage from './pages/ContainerPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import * as Constants from './utility/constants';
import { Layout } from 'antd';


function App() {
  const { Header, Content, Footer } = Layout;

  const [currentPage, setPage] = useState(Constants.HEADER_DASHBOARD);

  let pageShown;
  if (currentPage === Constants.HEADER_ITEMLIST) {
    pageShown = <ItemListPage />;
  } else if (currentPage === Constants.HEADER_CONTAINER) {
    pageShown = <ContainerPage />;
  } else if (currentPage === Constants.HEADER_DASHBOARD) {
    pageShown = <DashboardPage />;
  }

  return (
    <Layout className="layout">
      <Header>
        <Navbar currentPage={currentPage} changePage={setPage} />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          {pageShown}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Capstone CS Team 24 ©2020</Footer>
    </Layout>
  );
}

export default App;
