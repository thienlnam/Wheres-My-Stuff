import React, {useState} from 'react';
import 'antd/dist/antd.css';
import PartListPage from './pages/PartListPage';
import ContainerPage from './pages/ContainerPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CategoryPage from './pages/CategoryPage';
import ContainedByPage from './pages/ContainedByPage';
import FAQPage from './pages/FAQPage';
import Navbar from './components/Navbar';
import * as Constants from './utility/constants';
import Store from './state/Store';
import {Layout} from 'antd';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
    const {Header, Content, Footer} = Layout;

    return (
        <Router>
            <Store>
                <QueryClientProvider client={queryClient}>
                    <Layout className="layout">
                        <Header>
                            <Navbar />
                        </Header>
                        <Content style={{padding: '0 50px'}}>
                            <div className="site-layout-content">
                                <Switch>
                                    <Route exact path="/">
                                        <Redirect to="/dashboard" />
                                    </Route>
                                    <Route path="/parts">
                                        <PartListPage />
                                    </Route>
                                    <Route path="/containedBy">
                                        <ContainedByPage />
                                    </Route>
                                    <Route path="/container">
                                        <ContainerPage />
                                    </Route>
                                    <Route path="/profile">
                                        <ProfilePage />
                                    </Route>
                                    <Route path="/category">
                                        <CategoryPage />
                                    </Route>
                                    <Route path="/dashboard">
                                        <DashboardPage />
                                    </Route>
                                    <Route path="/faq">
                                        <FAQPage />
                                    </Route>

                                </Switch>
                            </div>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>Capstone CS Team 24 ©2020</Footer>
                    </Layout>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </Store>
        </Router>
    );
}

export default App;
