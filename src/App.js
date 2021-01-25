import React, {useState} from 'react';
import 'antd/dist/antd.css';
import PartListPage from './pages/PartListPage';
import ContainerPage from './pages/ContainerPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CategoryPage from './pages/CategoryPage';
import Navbar from './components/Navbar';
import * as Constants from './utility/constants';
import {Layout} from 'antd';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';

const queryClient = new QueryClient();

function App() {
    const {Header, Content, Footer} = Layout;

    const [currentPage, setPage] = useState(Constants.HEADER_DASHBOARD);

    let pageShown;
    if (currentPage === Constants.HEADER_PARTSLIST) {
        pageShown = <PartListPage />;
    } else if (currentPage === Constants.HEADER_CONTAINER) {
        pageShown = <ContainerPage />;
    }  else if (currentPage === Constants.HEADER_PROFILES) {
        pageShown = <ProfilePage />;
    } else if (currentPage === Constants.HEADER_CATEGORY) {
        pageShown = <CategoryPage />;
    } else if (currentPage === Constants.HEADER_DASHBOARD) {
        pageShown = <DashboardPage />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Layout className="layout">
                <Header>
                    <Navbar currentPage={currentPage} changePage={setPage} />
                </Header>
                <Content style={{padding: '0 50px'}}>
                    <div className="site-layout-content">
                        {pageShown}
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>Capstone CS Team 24 ©2020</Footer>
            </Layout>
        </QueryClientProvider>
    );
}

export default App;
