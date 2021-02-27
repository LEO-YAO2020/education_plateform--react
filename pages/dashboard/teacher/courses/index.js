import React, { useEffect, useState } from "react";
import Layout from "../../../../components/layout/layout";
import {
  Input,
  Switch,
  Popconfirm,
  Table,
  Space,
  Rate,
  message,
  Tooltip,
  Row,
  Col,
} from "antd";
import { debounce } from "lodash";
import { getCourses, deleteCourse } from "../../../../api/response";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { QuestionCircleOutlined } from "@ant-design/icons";
import ScrollCourses from "../../../../components/scrollCourses";
import styled from "styled-components";

const { Search } = Input;

export default function teacherCourses() {
  const [pagination, setPagination] = useState({
    limit: 20,
    page: 1,
    showSizeChanger: true,
  });

  const [loading, setLoading] = useState(false);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [changeLayout, setChangeLayout] = useState(false);

  const status = ["Pending", "Processing", "Finished"];
  const duration = ["Year", "Month", "Day", "Week", "Hour"];
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
              pathname: "/dashboard/teacher/courses/[id]",
              query: { id: record.id },
            }}
          >
            {record.name}
          </Link>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "type",
      key: "area",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => {
        return status[text];
      },
    },
    {
      title: "Star",
      dataIndex: "star",
      render: (text) => {
        return <Rate disabled defaultValue={text} />;
      },
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (_text, value) => {
        const dur = value.duration;
        const durUnit = value.durationUnit;
        return dur > 1
          ? dur + " " + duration[durUnit - 1] + "s"
          : dur + " " + duration[durUnit - 1];
      },
    },
    {
      title: "Create Time",
      dataIndex: "ctime",
      render: (value) => {
        return formatDistanceToNow(new Date(value), { addSuffix: true });
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_value, record, index) => (
        <Space size="middle">
          <Link href="/dashboard/teacher/courses/edit-course">Edit</Link>
          <Popconfirm
            title="Are you sure？"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={async () => {
              const param = { id: record.id };
              const isDelete = await deleteCourse(param);

              if (isDelete.data.data) {
                const index = teacherCourses.findIndex(
                  (item) => item.id === record.id
                );
                let newData = [...teacherCourses];

                newData.splice(index, 1);
                setTeacherCourses(newData);
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

  const handleTableChange = (pagination) => {
    let userId = localStorage.getItem("userId");

    getCourses({ limit: pagination.limit, page: pagination.page, userId }).then(
      (res) => {
        const { courses } = res.data.data;

        setLoading(false);
        setTeacherCourses(courses);
        setTotal(res.data.data.total);
        setPagination({ ...pagination, total: res.data.data.total });
      }
    );
  };

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    setLoading(true);
    getCourses({ limit: pagination.limit, page: pagination.page, userId }).then(
      (res) => {
        const { courses } = res.data.data;
        setLoading(false);
        setTeacherCourses(courses);
        setPagination({ ...pagination, total: res.data.data.total });
      }
    );
  }, []);

  const inputChangeHandler = (value) => {
    const query = value.target.value;
    let userId = localStorage.getItem("userId");
    setLoading(true);
    getCourses({
      limit: pagination.limit,
      page: pagination.page,
      userId,
      name: query,
    }).then((res) => {
      const { courses } = res.data.data;
      setLoading(false);
      setTeacherCourses(courses);
      setPagination({ ...pagination, total: res.data.data.total });
    });
  };
  const switchChangeHandler = (checked, e) => {
    console.log(checked);
    setChangeLayout(checked);
  };

  return (
    <>
      <Layout>
        <Row justify="space-between">
          <Col span={4}>
            {!changeLayout && (
              <Search
                placeholder="Search By Name"
                allowClear
                onChange={debounce(inputChangeHandler, 1000)}
              />
            )}
          </Col>
          <Col>
            <Tooltip title="switch to grid mode">
              <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                onChange={switchChangeHandler}
              />
            </Tooltip>
          </Col>
        </Row>

        {changeLayout ? (
          <>
            <ScrollCourses />
          </>
        ) : (
          <>
            <Table
              columns={columns}
              rowKey="id"
              dataSource={teacherCourses}
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </>
        )}
      </Layout>
    </>
  );
}
