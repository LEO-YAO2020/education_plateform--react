import React, { useState } from "react";
import styled from "styled-components";
import { Layout, Menu, message, Breadcrumb } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Router, { withRouter } from "next/router";
import { logout } from "../../api/response";
import SubMenu from "antd/lib/menu/SubMenu";
import { routes } from "../../data/menuData/menuList";
import Link from "next/link";

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
  color: white;
  font-size: 18px;
  &:hover {
    color: #1890ff;
  }
`;

const Trigger = styled.div`
  .trigger {
    font-size: 18px;
    padding: 0 24px;
    color: white;
  }
  .trigger:hover {
    color: #1890ff;
  }
`;

const StyledContent = styled(Content)`
  margin: 16px;
  background-color: #fff;
  padding: 16px;
  min-height: auto;
`;

const isDetailPath = (path) => {
  const length = path.length;
  const last = path[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

const getSubBreadcrumbNode = (menuList, pathnameNode, subPath) => {
  let path = subPath.split("/");
  let result = isDetailPath(pathnameNode);

  if (result) {
    pathnameNode.pop();
    path.pop();
    path = path.join("/");
  } else {
    path = path.join("/");
  }
  return menuList.map((item) => {
    if (item.children) {
      if (item.key === pathnameNode[pathnameNode.length - 1]) {
        return item.children.map((subList) => {
          if (subList.path === path) {
            return (
              <>
                <Breadcrumb.Item key={path}>{item.title}</Breadcrumb.Item>

                {pathnameNode[pathnameNode.length - 1] === item.key ? (
                  result ? (
                    <>
                      <Breadcrumb.Item key={path}>
                        <Link href={path}>{subList.title}</Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item key={path}> Detail</Breadcrumb.Item>
                    </>
                  ) : (
                    <Breadcrumb.Item key={path}>
                      {subList.title}
                    </Breadcrumb.Item>
                  )
                ) : null}
              </>
            );
          }
        });
      }
    }
  });
};

function TableComponent(props) {
  let pathname = props.router.pathname;
  let defaultSelectedKeys = pathname;
  let subMenu = pathname.split("/");

  if (isDetailPath(subMenu)) {
    defaultSelectedKeys = pathname.slice(0, -5);
    subMenu.pop();
  }

  const menuList = routes.get(subMenu[2]);
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

  const getMenuNodes = (MenuList) => {
    return MenuList.map((item) => {
      if (!item.children) {
        return (
          <Menu.Item
            key={item.path}
            icon={item.icon}
            style={{ marginTop: 0 }}
            onClick={() => {
              Router.push(item.path);
            }}
          >
            {item.title}
          </Menu.Item>
        );
      } else {
        return (
          <SubMenu key={item.key} title={item.title} icon={item.icon}>
            {getMenuNodes(item.children)}
          </SubMenu>
        );
      }
    });
  };

  const getBreadcrumbNode = (menuList) => {
    const pathnameNode = pathname.split("/");
    const root = pathnameNode.slice(0, 3).join("/");
    const subPath = pathnameNode.slice(0).join("/");

    return (
      <Breadcrumb style={{ margin: "10px 16px" }}>
        <Breadcrumb.Item>
          <Link
            href={root}
          >{`CMS ${pathnameNode[2].toLocaleUpperCase()} SYSTEM`}</Link>
        </Breadcrumb.Item>
        {getSubBreadcrumbNode(menuList, pathnameNode, subPath)}
      </Breadcrumb>
    );
  };

  subMenu = subMenu.slice(-1);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Logo>CMS</Logo>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={subMenu}
          defaultSelectedKeys={[defaultSelectedKeys]}
        >
          {getMenuNodes(menuList)}
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

        {getBreadcrumbNode(menuList)}

        <StyledContent>{props.children}</StyledContent>
      </Layout>
    </Layout>
  );
}

export default withRouter(TableComponent);
