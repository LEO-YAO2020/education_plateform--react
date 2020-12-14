import React from "react";
import { Button, Input, message, Modal, Popconfirm, Space, Table } from "antd";
import Layout from "../../../../components/layout/layout";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { deleteItem, getStudents, search } from "../../../../api/response";
import _ from "lodash";
import EditForm from "../../../../components/Form/form";
import { formatDistanceToNow } from "date-fns";

const { Search } = Input;

class StudentList extends React.Component {
  state = {
    isModalVisible: false,
    index: 0,
    addStudent: false,
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
      title: "No.",
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
      title: "Area",
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
      title: "Selected Curriculum",
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
      title: "Student Type",
      dataIndex: "typeName",
      filters: [
        { text: "tester", value: "tester" },
        { text: "developer", value: "developer" },
      ],
      onFilter: (value, record) => {
        let type = record.typeName;

        return type.indexOf(value) === 0;
      },
    },
    {
      title: "Join Time",
      dataIndex: "ctime",
      render: (value) => {
        return formatDistanceToNow(new Date(value));
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_value, record, index) => (
        <Space size="middle">
          <a
            onClick={() =>
              this.setState({
                isModalVisible: true,
                index: index,
                addStudent: false,
              })
            }
          >
            Edit
          </a>
          <Popconfirm
            title="Are you sure？"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={async () => {
              const param = { id: record.id };
              const isDelete = await deleteItem(param);
              console.log(isDelete);

              if (isDelete.data.data) {
                let newData = [...this.state.data];
                newData.splice(index, 1);

                this.setState({
                  data: newData,
                });
                message.success(isDelete.data.msg);
              }
            }}
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
      limit: 10,
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

  formChangeHandler = () => {
    this.setState;
  };

  render() {
    return (
      <Layout>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ float: "left" }}
          onClick={this.handleAdd}
        >
          Add
        </Button>
        <Search
          placeholder="input search text"
          allowClear
          onChange={_.debounce(this.inputChangeHandler, 1000)}
          style={{
            width: "30%",
            marginBottom: "20px",
            display: "block",
            float: "right",
          }}
        />

        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
        <Modal
          title={
            this.state.addStudent === true ? "Add Student" : "Edit Student"
          }
          visible={this.state.isModalVisible}
          onCancel={this.handleCancel}
          footer={
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>
          }
        >
          <EditForm
            student={this.state.data[this.state.index]}
            isAdd={this.state.addStudent}
            addSuccess={(student) => {
              this.setState({
                data: [...this.state.data, student],
                isModalVisible: false,
              });
            }}
            editSuccess={(student) => {
              let data = [...this.state.data];
              data[this.state.index] = student;

              this.setState({
                data: [...data],
                isModalVisible: false,
              });
            }}
          />
        </Modal>
      </Layout>
    );
  }
}
export default StudentList;
