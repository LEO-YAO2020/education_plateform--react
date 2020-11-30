import React from "react";
import { Layout, Menu, Pagination, Input, Space, Table } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  SelectOutlined,
  RollbackOutlined,
} from "@ant-design/icons";

import Link from "next/link";
import Axios from "./axios";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

class TableList extends React.Component {
  state = {
    collapsed: false,
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
  };
  columnss = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Area",
      dataIndex: "address",
      key: "area",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "Selected Curriculum",
    },
    {
      title: "Student Type",
      dataIndex: "Student Type",
    },
    {
      title: "Join Time",
      dataIndex: "ctime",
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: () => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  async componentDidMount() {
    this.setState({ loading: true });
    const student = await Axios();
    console.log(student.data.students);

    this.setState({
      loading: false,
      data: student.data.students,
    });
  }

  onSearch = (value) => console.log();

  render() {
    return (
      <Layout className="layout">
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
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
            <Table
              columns={this.columnss}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default TableList;
