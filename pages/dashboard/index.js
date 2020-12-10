import React from "react";
import { Space, Table, Input, Popconfirm, Button, message, Modal } from "antd";
import Layout from "../../components/layout/layout";
import { QuestionCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { getStudents, search, deleteItem } from "../../api/response";
import _ from "lodash";
import EditForm from "../../components/Form/form";
import { da } from "date-fns/locale";

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
      dataIndex: "Selected Curriculum",
    },
    {
      title: "Student Type",
      key: "typeId",
      filters: [
        { text: "tester", value: "tester" },
        { text: "developer", value: "developer" },
      ],
      onFilter: (value, record) => {
        let typeid = record.typeId;
        let type = typeid == 1 ? "tester" : "developer";
        return type.indexOf(value) === 0;
      },
      render: (_value, record) => {
        const typeid = record.typeId;
        return typeid == 1 ? "tester" : "developer";
      },
    },
    {
      title: "Join Time",
      key: "ctime",
      render: (_value, record) => {
        let ctime = parseInt(record.ctime.substr(5, 2));
        let updateAt = parseInt(record.updateAt.substr(5, 2));
        let time = updateAt - ctime;
        let a = time == 0 ? "Within a month" : `${time} months ago`;
        return a;
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
              console.log(record.id);
              const param = { id: record.id };
              const isDelete = await deleteItem(param);
              console.log(isDelete);
              if (isDelete.data.data) {
                let newData = [...this.state.data];
                console.log(newData);
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

  async componentDidMount() {
    this.setState({ loading: true });
    const student = await getStudents(this.param);
    console.log(student);
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
    this.pageChangeHandler;
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
          title={this.state.addStudent == true ? "Add Student" : "Edit Student"}
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
            isRender={this.formChangeHandler.bind(this)}
          />
        </Modal>
      </Layout>
    );
  }
}
export default StudentList;
