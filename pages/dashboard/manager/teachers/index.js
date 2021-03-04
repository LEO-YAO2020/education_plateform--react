import {
  Button,
  Col,
  Row,
  Input,
  Table,
  message,
  Modal,
  Popconfirm,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../../../../components/layout/layout";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { getTeachers, deleteTeacher } from "../../../../api/response";
import { debounce } from "lodash";
import Link from "next/link";
import EditForm from "../../../../components/addTeacherForm";

const { Search } = Input;
const Teacher = () => {
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
  });
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [total, setTotal] = useState(0);
  const [addStudent, setAddStudent] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [id, setId] = useState(0);
  const [index, setIndex] = useState(null);

  const columns = [
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
      render: (_value, record) => {
        return (
          <Link
            href={{
              pathname: "/dashboard/manager/students/[id]",
              query: { id: record.id },
            }}
          >
            {record.name}
          </Link>
        );
      },
    },
    {
      title: "Country",
      dataIndex: "country",
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
      title: "Skills",
      dataIndex: "skills",
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
      title: "Course Amount",
      dataIndex: "courseAmount",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_value, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setIsModalVisible(true);
              setId(record.id);
              setAddStudent(false);
              setIndex(record);
            }}
          >
            Edit
          </a>

          <Popconfirm
            title="Are you sure？"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={async () => {
              const param = { id: record.id };
              const isDelete = await deleteTeacher(param);

              if (isDelete.data.data) {
                const index = teachers.findIndex(
                  (item) => item.id === record.id
                );
                let newData = [...teachers];

                newData.splice(index, 1);
                setTeachers(newData);
                setTotal(total - 1);
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

  const inputChangeHandler = (value) => {
    const query = value.target.value;
    let userId = localStorage.getItem("userId");

    setLoading(true);
    getTeachers({
      limit: pagination.pageSize,
      page: pagination.current,
      userId,
      name: query,
    }).then((res) => {
      const { teachers } = res.data.data;

      setLoading(false);
      setTeachers(teachers);
      setTotal(res.data.data.total);
      setPagination({ ...pagination, total: res.data.data.total });
    });
  };

  const handleTableChange = (pagination) => {
    let userId = localStorage.getItem("userId");

    getTeachers({
      limit: pagination.pageSize,
      page: pagination.current,
      userId,
    }).then((res) => {
      const { teachers } = res.data.data;

      setLoading(false);
      setTeachers(teachers);
      setTotal(res.data.data.total);
      setPagination({ ...pagination, total: res.data.data.total });
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIndex(null);
    setId(0);
  };

  const handleAdd = () => {
    setAddStudent(true);
    setIndex(null);
    setIsModalVisible(true);
  };

  useEffect(() => {
    let userId = localStorage.getItem("userId");

    setLoading(true);
    getTeachers({
      limit: pagination.pageSize,
      page: pagination.current,
      userId,
    }).then((res) => {
      const { teachers } = res.data.data;

      setLoading(false);
      setTeachers(teachers);
      setTotal(res.data.data.total);
      setPagination({ ...pagination, total: res.data.data.total });
    });
  }, []);

  return (
    <Layout>
      <Row justify="space-between">
        <Col span={4}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add
          </Button>
        </Col>
        <Col span={8}>
          <Search
            placeholder="input search text"
            onChange={debounce(inputChangeHandler, 1000)}
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        rowKey="id"
        dataSource={teachers}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        style={{ marginTop: "10px" }}
      />
      <Modal
        title={addStudent === true ? "Add Student" : "Edit Student"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>
        }
        destroyOnClose
      >
        <EditForm
          teacher={index}
          teacherID={id}
          isAdd={addStudent}
          addSuccess={(teacher) => {
            setTeachers([...teachers, teacher]);
            setIsModalVisible(false);
          }}
          editSuccess={(teacher) => {
            let data = [...teachers];
            const index = data.findIndex((item) => item.id === teacher.id);

            data[index] = teacher;
            setTeachers([...data]);
            setIsModalVisible(false);
          }}
        />
      </Modal>
    </Layout>
  );
};

export default Teacher;
