import React from 'react';
import {Menu} from 'antd';
import PropTypes from 'prop-types';
import {UnorderedListOutlined, CodeSandboxOutlined, DashboardOutlined, UserOutlined, FolderOutlined, InboxOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import * as Constants from '../utility/constants';
import {
    Link,
} from 'react-router-dom';


const Navbar = () => {
    return (
        <>
            <Menu theme="light" mode="horizontal">
                <Menu.Item key={Constants.HEADER_DASHBOARD} icon={<DashboardOutlined />}>
                    <Link to="/dashboard">Home</Link>
                </Menu.Item>
                <Menu.Item key={Constants.HEADER_CONTAINEDBY} icon={<InboxOutlined />}>
                    <Link to="/containedBy">Parts Locations</Link>
                </Menu.Item>
                <Menu.Item key={Constants.HEADER_PARTSLIST} icon={<UnorderedListOutlined />}>
                    <Link to="/parts">Parts</Link>
                </Menu.Item>
                <Menu.Item key={Constants.HEADER_CONTAINER} icon={<CodeSandboxOutlined />}>
                    <Link to="/container">Containers</Link>
                </Menu.Item>
                <Menu.Item key={Constants.HEADER_PROFILES} icon={<UserOutlined />}>
                    <Link to="/profile">Profiles</Link>
                </Menu.Item>
                <Menu.Item key={Constants.HEADER_CATEGORY} icon={<FolderOutlined />}>
                    <Link to="/categories">Categories</Link>
                </Menu.Item>
                <Menu.Item key={Constants.HEADER_FAQ} icon={<QuestionCircleOutlined />}>
                    <Link to="/faq">FAQ</Link>
                </Menu.Item>
            </Menu>
        </>
    );
};

export default Navbar;
