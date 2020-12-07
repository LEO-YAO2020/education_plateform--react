import React, { useState } from "react";
import styled from "styled-components";
import { Layout, Menu, message } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import Router from "next/router";
import { logout } from "../../api/response";

const { Header, Sider, Content } = Layout;

const Logo = styled.div`
  text-align: center;
  height: 63px;
  line-height: 63px;
  font-size: 25px;
  color: white;
  text-shadow: 5px 1px 5px;
  transform: rotateX(45deg);
  font-family: monospace;
`;

const Back = styled(LogoutOutlined)`
  float: right;
  margin-top: 23px;
  margin-right: 20px;
  color: white !important;
  font-size: 18px;
  &:hover {
    color: #1890ff;
  }
`;

const Trigger = styled.div`
  .trigger {
    font-size: 18px;
    padding: 0 24px;
    color: white !important;
  }
  &:hover {
    color: #1890ff;
  }
`;

function tableComponent(props) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const logoutHandler = async () => {
    let token = localStorage.getItem("token");
    token = token.substr(1, token.length - 2);
    const logoutMsg = await logout(token);

    if (logoutMsg.data.data) {
      localStorage.removeItem("token");
      localStorage.removeItem("loginType");
      message.success(logoutMsg.data.msg);
      Router.push("/login");
    } else {
      message.error(logoutMsg.data.msg);
    }
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <Logo>CMS</Logo>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />} style={{ marginTop: 0 }}>
              Students List
            </Menu.Item>
            <Menu.Item key="2" icon={<SelectOutlined />}>
              Choose Student
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="site-layout">
          <Trigger>
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: toggle,
                }
              )}

              <Back onClick={logoutHandler} />
            </Header>
          </Trigger>

          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default tableComponent;
