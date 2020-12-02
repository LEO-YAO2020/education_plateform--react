import React from "react";
import { Space, Table, Input, Popconfirm } from "antd";
import Layout from "../../components/layout/layoutComponent";
import { QuestionCircleOutlined } from "@ant-design/icons";
import axios from "axios";
const { Search } = Input;

class TableList extends React.Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
    },
    loading: false,
  };
  columns = [
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
          <Popconfirm
            title="Are you sure？"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  async componentDidMount() {
    this.setState({ loading: true });
    const student = await axios.get("/api/students").then((res) => res);

    this.setState({
      loading: false,
      data: student.data.students,
      pagination: {
        pageSize: 10,
        total: student.data.students.size,
        showSizeChanger: true,
      },
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    return {
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    };
  };

  onSearch = (value) => console.log(value);

  render() {
    return (
      <Layout>
        <Search
          placeholder="input search text"
          allowClear
          onSearch={this.onSearch}
          style={{ width: "300px", marginBottom: "20px", display: "block" }}
        />
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </Layout>
    );
  }
}
export default TableList;
