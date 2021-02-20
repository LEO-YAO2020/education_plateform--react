import React from "react";
import { Input, Modal, Table } from "antd";
import Layout from "../../../../components/layout/layout";

import { getStudents, search } from "../../../../api/response";
import _ from "lodash";

class StudentList extends React.Component {
  state = {
    isModalVisible: false,
    index: 0,
    addStudent: false,
    data: [],
    pagination: {
      current: 1,
      pageSize: 20,
      showSizeChanger: true,
    },
    loading: false,
  };
  columns = [
    {
      title: "N.O",
      key: "id",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      sortDirections: ["ascend", "descend"],
      sorter: (pre, next) => {
        const preName = pre.name.charCodeAt(0);
        const nextName = next.name.charCodeAt(0);

        return preName - nextName == 0 ? 0 : preName - nextName;
      },
    },
    {
      title: "Country",
      dataIndex: "area",
      key: "area",
      filters: [
        { text: "NewZealand", value: "NewZealand" },
        { text: "Canada", value: "Canada" },
        { text: "Australia", value: "Australia" },
        { text: "China", value: "China" },
      ],
      onFilter: (value, record) => record.area.indexOf(value) === 0,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "course",
      dataIndex: "courses",
      render: (_text, value) => {
        let names = [];
        if (!!value.courses) {
          value.courses.map((element) => {
            names.push(element.name);
          });
        }

        return names.join("/");
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_value, record, index) => (
        <a
          onClick={() => {
            let msg = "";

            Modal.info({
              title: `Notify ${record.name}`,
              content: (
                <Input
                  placeholder="Please input a message"
                  onChange={(event) => (msg = event.target.value)}
                />
              ),
              onOk: (close) => {
                // TODO: send notification to student;
                close();
              },
            });
          }}
        >
          Notify
        </a>
      ),
    },
  ];

  param = {
    page: 1,
    limit: 20,
    userId: 1,
  };
  value = "";

  async componentDidMount() {
    this.setState({ loading: true });

    const student = await getStudents(this.param);

    this.setState({
      data: student.data.data.students,

      loading: false,
      pagination: {
        pageSize: student.data.data.paginator.limit,
        total: student.data.data.total,
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

  inputChangeHandler = async (value) => {
    console.log(value.target.value);

    this.value = value.target.value;
    const params = {
      page: 1,
      limit: 20,
      query: value.target.value,
    };
    const res = await search(params);

    this.setState({
      data: res.data.data.students,
      loading: false,
      pagination: {
        pageSize: res.data.data.paginator.limit,
        total: res.data.data.total,
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
      data: res.data.data.students,
      loading: false,
      pagination: {
        pageSize: res.data.data.paginator.limit,
        total: res.data.data.total,
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
      data: student.data.data.students,
      loading: false,
      pagination: {
        pageSize: student.data.data.paginator.limit,
        total: student.data.data.total,
        showSizeChanger: true,
        onChange: this.pageChangeHandler,
      },
    });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false, index: 0 });
  };

  handleAdd = () => {
    this.setState({ addStudent: true, isModalVisible: true });
  };

  render() {
    return (
      <Layout>
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
