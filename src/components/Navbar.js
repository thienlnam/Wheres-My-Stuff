import React from 'react';
import {Menu} from 'antd';
import PropTypes from 'prop-types';
import {UnorderedListOutlined, CodeSandboxOutlined, DashboardOutlined, UserOutlined, FolderOutlined} from '@ant-design/icons';
import * as Constants from '../utility/constants';

const Navbar = (props) => {
    const handleClick = (e) => {
        props.changePage(e.key);
    };

    return (
        <>
            <Menu onClick={handleClick} theme="light" selectedKeys={[props.currentPage]} mode="horizontal">
                <Menu.Item key={Constants.HEADER_DASHBOARD} icon={<DashboardOutlined />}>
            Dashboard
                </Menu.Item>
                <Menu.Item key={Constants.HEADER_PARTSLIST} icon={<UnorderedListOutlined />}>
            Parts List
                </Menu.Item>
                <Menu.Item key={Constants.HEADER_CONTAINER} icon={<CodeSandboxOutlined />}>
            Containers
                </Menu.Item>
                <Menu.Item key={Constants.HEADER_PROFILES} icon={<UserOutlined />}>
            Profiles
                </Menu.Item>
                <Menu.Item key={Constants.HEADER_CATEGORY} icon={<FolderOutlined />}>
            Categories
                </Menu.Item>
            </Menu>
        </>
    );
};

Navbar.propTypes = {
    changePage: PropTypes.func,
    currentPage: PropTypes.string,
};

export default Navbar;
