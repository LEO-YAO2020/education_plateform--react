import React, { useState } from "react";
import styled from "styled-components";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import Router from "next/router";

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
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginType");
    Router.push("/login");
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <Logo>CMS</Logo>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />} style={{ marginTop: 0 }}>
              学员对象
            </Menu.Item>
            <Menu.Item key="2" icon={<SelectOutlined />}>
              选择学员
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

              <Back onClick={logOut} />
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
