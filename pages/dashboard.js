import React from "react";
import { Layout, Menu, Pagination, Input } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  SelectOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import student from "../data/student.json";
import Link from "next/link";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

class DashBoard extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onSearch = (value) => console.log(value);

  render() {
    return (
      <Layout className="layout">
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo"> CMS </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              学员对象
            </Menu.Item>
            <Menu.Item key="2" icon={<SelectOutlined />}>
              选择学员
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(
              this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: this.toggle,
              }
            )}
            <Link href="/login">
              <a>
                <RollbackOutlined className="back" />
              </a>
            </Link>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            <Search
              placeholder="input search text"
              allowClear
              onSearch={this.onSearch}
              style={{ width: "300px", marginBottom: "20px" }}
            />
            <table style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Name</td>
                  <td>Area</td>
                  <td>Email</td>
                  <td>Selected Curriculum</td>
                  <td>Student Type</td>
                  <td>Join Time</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {student.map((value, index) => {
                  return (
                    <>
                      <tr key={index + value}>
                        <td>{value.id}</td>
                        <td>{value.name}</td>
                        <td>{value.address}</td>
                        <td>{value.email}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <a href="#">Edit&nbsp;&nbsp;&nbsp;</a>
                          <a href="#">Delete</a>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              className="page"
              defaultCurrent={1}
              total={20}
              showSizeChanger
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default DashBoard;
