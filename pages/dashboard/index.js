import React from "react";
import { Space, Table, Input, Popconfirm } from "antd";
import Layout from "../../components/layout/layout";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { getStudents, search } from "../../api/response";
import _ from "lodash";

const { Search } = Input;

class StudentList extends React.Component {
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

  param = {
    page: 1,
    limit: 10,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const student = await getStudents(this.param);

    this.setState({
      data: student.data.data,
      loading: false,
      pagination: {
        pageSize: student.data.paginator.limit,
        total: student.data.paginator.total,
        showSizeChanger: true,
        onChange: this.pageChangeHandler,
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

  value = "";
  inputChangeHandler = async (value) => {
    console.log(value.target.value);
    this.value = value.target.value;
    const params = {
      page: 1,
      limit: 10,
      query: value.target.value,
    };
    const res = await search(params);
    console.log(res.data);
    this.setState({
      data: res.data.data,
      loading: false,
      pagination: {
        pageSize: res.data.paginator.limit,
        total: res.data.paginator.total,
        showSizeChanger: true,
        onChange: this.searchPageChangeHandler,
      },
    });
  };

  searchPageChangeHandler = async (page, pageSize) => {
    const params = {
      page: page,
      limit: pageSize,
      query: this.value,
    };
    const res = await search(params);

    this.setState({
      data: res.data.data,
      loading: false,
      pagination: {
        pageSize: res.data.paginator.limit,
        total: res.data.paginator.total,
        showSizeChanger: true,
        onChange: this.searchPageChangeHandler,
      },
    });
  };

  pageChangeHandler = async (page, pageSize) => {
    const param = {
      page: page,
      limit: pageSize,
    };
    const student = await getStudents(param);

    this.setState({
      data: student.data.data,
      loading: false,
      pagination: {
        pageSize: student.data.paginator.limit,
        total: student.data.paginator.total,
        showSizeChanger: true,
        onChange: this.pageChangeHandler,
      },
    });
  };

  render() {
    return (
      <Layout>
        <Search
          placeholder="input search text"
          allowClear
          onChange={_.debounce(this.inputChangeHandler, 1000)}
          style={{ width: "30%", marginBottom: "20px", display: "block" }}
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
export default StudentList;
