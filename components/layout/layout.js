import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Layout,
  Menu,
  message,
  Breadcrumb,
  Badge,
  Row,
  Dropdown,
  Tabs,
  Spin,
  List,
  Space,
  Col,
  Avatar,
  Button,
  notification,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Router, { withRouter } from "next/router";
import { logout } from "../../api/response";
import SubMenu from "antd/lib/menu/SubMenu";
import { routes } from "../../data/menuData/menuList";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatDistanceToNow } from "date-fns";
import {
  getMessage,
  isMessageRead,
  getMessageStatistic,
  messageEvent,
} from "../../api/response";
import { useMessageContext } from "../provider";

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

const Footer = styled(Row)`
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 4px 4px;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-right: none;
  background: #fff;
  z-index: 9;
  .ant-col {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      box-shadow: 1px 0 0 0 #f0f0f0;
    }
  }
  button {
    border: none;
  }
`;

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

const HeaderIcon = styled.span`
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
  }
`;

const MessageContainer = styled.div`
  height: 380px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const StyledLayoutHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const StyledContent = styled(Content)`
  margin: 16px;
  background-color: #fff;
  padding: 16px;
  min-height: auto;
`;

const TabNavContainer = styled.div`
  margin-bottom: 0;
  padding: 10px 20px 0 20px;
  .ant-tabs-nav-list {
    width: 100%;
    justify-content: space-around;
  }
`;
const ListItemStyle = styled.div`
  .ant-spin-container {
    padding: 0 20px;
  }
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
      } else if (item.key === pathnameNode[pathnameNode.length - 2]) {
        return item.children.map((subList) => {
          if (subList.path === path) {
            return (
              <>
                <Breadcrumb.Item key={path}>{item.title}</Breadcrumb.Item>

                {pathnameNode[pathnameNode.length - 2] === item.key ? (
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
    } else {
      if (
        item.title.toLowerCase() === pathnameNode[pathnameNode.length - 1] ||
        item.title.slice(7).toLowerCase() ===
          pathnameNode[pathnameNode.length - 1]
      ) {
        return <Breadcrumb.Item key={path}>{item.title}</Breadcrumb.Item>;
      }
    }
  });
};

function Messages(props) {
  const { type } = props;
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({ limit: 20, page: 1 });

  useEffect(async () => {
    const userId = localStorage.getItem("userId");
    const res = await getMessage({ ...pagination, userId, type: props.type });
    const { messages } = res.data.data;

    setHasMore(true);
    let source = [];
    if (type === "notification") {
      setNotificationData([...notificationData, ...messages]);
      source = [...notificationData, ...messages];
    } else if (type === "message") {
      setMessageData([...messageData, ...messages]);
      source = [...messageData, ...messages];
    } else {
      setAllData([...allData, ...messages]);
      source = [...allData, ...messages];
    }

    if (source.length >= res.data.data.total) {
      setHasMore(false);
      setData(source);

      return;
    }

    setData(source);
  }, [pagination, props.type]);

  useEffect(async () => {
    if (props.clearAll && data && data.length) {
      let ids = data
        .filter((item) => {
          return item.status === 0;
        })
        .map((item) => item.id);
      if (ids.length) {
        const res = await isMessageRead({
          ids,
          status: 1,
        });

        if (res.data.data) {
          setData(data.map((item) => ({ ...item, status: 1 })));
        }
        if (props.onRead) {
          props.onRead(ids.length);
        }
      } else {
        message.error(`All of these ${type}s has been marked as read!`);
      }

      console.log(ids);
    }
  }, [props.clearAll]);

  return (
    <ListItemStyle>
      <InfiniteScroll
        next={() => setPagination({ ...pagination, page: pagination.page + 1 })}
        loader={
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        }
        hasMore={hasMore}
        dataLength={data.length}
        endMessage={<div style={{ textAlign: "center" }}>No more</div>}
        scrollableTarget={props.scrollTarget}
      >
        <List
          itemLayout="vertical"
          dataSource={data}
          renderItem={(item) => {
            return (
              <>
                <List.Item
                  key={item.id}
                  style={{ opacity: item.status ? 0.4 : 1 }}
                  actions={[
                    <Space>
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </Space>,
                  ]}
                  onClick={async () => {
                    if (item.status === 1) {
                      return;
                    }
                    const ids = item.id;
                    const res = await isMessageRead({
                      ids: [ids],
                      status: 1,
                    });
                    if (res.data.data) {
                      const target = data.find(
                        (element) => element.id === item.id
                      );

                      target.status = 1;
                    }

                    setData([...data]);

                    if (props.onRead) {
                      props.onRead(1);
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.from.nickname}
                    description={item.content}
                  />
                </List.Item>
              </>
            );
          }}
        ></List>
      </InfiniteScroll>
    </ListItemStyle>
  );
}

export function MessagePanel() {
  const [activeType, setActiveType] = useState("notification");
  const types = ["notification", "message"];
  const { storeState, dispatch } = useMessageContext();
  const [clean, setClean] = useState({
    notification: 0,
    message: 0,
  });

  let role;
  useEffect(async () => {
    role = localStorage.getItem("loginType");
    const userId = localStorage.getItem("userId");
    const res = await getMessageStatistic({ userId });

    if (!!res) {
      const {
        receive: { message, notification },
      } = res.data.data;

      dispatch({
        type: "increment",
        payload: { type: "message", count: message.unread },
      });
      dispatch({
        type: "increment",
        payload: { type: "notification", count: notification.unread },
      });
    }

    const sse = messageEvent(userId);

    sse.onmessage = (e) => {
      let data = e.data;
      data = JSON.parse(data || {});

      if (data.type != "heartbeat") {
        const content = data.content;

        if (content.type === "message") {
          notification.info({
            message: `You have a message from ${content.from.nickname}`,
            description: content.content,
          });
        }

        dispatch({
          type: "increment",
          payload: { type: content.type, count: 1 },
        });
      }
    };

    return () => {
      sse.close();
      dispatch({ type: "reset" });
    };
  }, []);

  return (
    <Badge count={storeState.total} size="small" offset={[-18, 0]}>
      <HeaderIcon>
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          overlayStyle={{
            background: "#fff",
            borderRadius: 4,
            width: 400,
            height: 500,
            overflow: "hidden",
          }}
          overlay={
            <>
              <Tabs
                onChange={(key) => {
                  if (key !== activeType) {
                    setActiveType(key);
                  }
                }}
                renderTabBar={(props, DefaultTabBar) => (
                  <TabNavContainer>
                    <DefaultTabBar {...props} />
                  </TabNavContainer>
                )}
              >
                {types.map((type) => (
                  <TabPane key={type} tab={`${type}`}>
                    <MessageContainer id={type}>
                      <Messages
                        type={type}
                        scrollTarget={type}
                        clearAll={clean[activeType]}
                        onRead={(count) => {
                          dispatch({
                            type: "decrement",
                            payload: { type, count },
                          });
                        }}
                      />
                    </MessageContainer>
                  </TabPane>
                ))}
              </Tabs>

              <Footer justify="space-between" align="middle">
                <Col span={12}>
                  <Button
                    onClick={() => {
                      setClean({ ...clean, [activeType]: ++clean[activeType] });
                    }}
                  >
                    Mark all as read
                  </Button>
                </Col>
                <Col span={12}>
                  <Button>
                    <Link href={`/dashboard/${role}/message`}>
                      View history
                    </Link>
                  </Button>
                </Col>
              </Footer>
            </>
          }
        >
          <BellOutlined
            style={{ fontSize: 24, marginTop: 5, marginRight: 25 }}
          />
        </Dropdown>
      </HeaderIcon>
    </Badge>
  );
}

function TableComponent(props) {
  let pathname = props.router.pathname;
  let defaultSelectedKeys = pathname;
  let subMenu = pathname.split("/");

  if (subMenu.length > 4) {
    subMenu = subMenu.slice(0, -1);
  }
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

    const logoutMsg = await logout(token);

    if (logoutMsg.data.data) {
      localStorage.removeItem("token");
      localStorage.removeItem("loginType");
      localStorage.removeItem("userId");
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
        <Breadcrumb.Item>Overview</Breadcrumb.Item>
        {getSubBreadcrumbNode(menuList, pathnameNode, subPath)}
      </Breadcrumb>
    );
  };

  subMenu = subMenu.slice(-1);

  return (
    <Layout style={{ height: "100vh" }}>
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
      <Layout id="contentLayout">
        <StyledLayoutHeader>
          <HeaderIcon onClick={() => toggle(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </HeaderIcon>
          <Row align="middle">
            <MessagePanel />
            <HeaderIcon>
              <LogoutOutlined onClick={logoutHandler} />
            </HeaderIcon>
          </Row>
        </StyledLayoutHeader>

        {getBreadcrumbNode(menuList)}

        <StyledContent>{props.children}</StyledContent>
      </Layout>
    </Layout>
  );
}

export default withRouter(TableComponent);
