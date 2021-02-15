import { Space, Row, Col, Select, Input, Tag, Table } from "antd";
import React, { useState, useEffect } from "react";
import Layout from "../../../../components/layout/layout";
import _ from "lodash";
import { getCourses } from "../../../../api/response";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const { Search } = Input;

const coursesSchedule = () => {
  const [searchBy, setSearchBy] = useState("name");
  const [query, setQuery] = useState("");
  const [ownCourses, setOwnCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    showSizeChanger: true,
  });
  const statusColor = ["default", "green", "orange"];
  const statusText = ["finished", "processing", "pending"];
  const DurationUnit = ["year", "month", "day", "week", "hour"];

  function onSearch(value) {
    setQuery(value);
  }

  useEffect(async () => {
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const res = await getCourses({
      limit: pagination.pageSize,
      page: pagination.current,
      userId,
      [searchBy]: query,
      own: "true",
    });
    const { courses, total } = res.data.data;

    setOwnCourses([...courses]);
    setLoading(false);
  }, [pagination]);

  const columns = [
    {
      title: "No.",
      key: "id",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Course Name",
      dataIndex: ["course", "name"],
      sortDirections: ["ascend", "descend"],
      sorter: (pre, next) => {
        const preName = pre.course.name.charCodeAt(0);
        const nextName = next.course.name.charCodeAt(0);

        return preName - nextName == 0 ? 0 : preName - nextName;
      },
      render: (_text, record) => {
        return (
          <Link href={`/dashboard/student/courses/${record.id}`}>
            {record.course.name}
          </Link>
        );
      },
    },
    {
      title: "Status",
      dataIndex: ["course", "status"],
      key: "address",
      render: (text, _record) => (
        <Tag color={statusColor[text]}>{statusText[text]}</Tag>
      ),
    },
    {
      title: "Duration",
      dataIndex: ["course", "duration"],
      render: (text, record) => {
        const period =
          text > 1
            ? DurationUnit[record.course.durationUnit - 1] + "s"
            : DurationUnit[record.course.durationUnit - 1];
        return (
          <Space>
            {text}
            {period}
          </Space>
        );
      },
    },
    {
      title: "Course Start",
      dataIndex: ["course", "startTime"],
    },
    {
      title: "Category",
      dataIndex: ["course", "type"],
    },
    {
      title: "Join Time",
      dataIndex: "ctime",
      render: (text) => {
        return formatDistanceToNow(new Date(text), { addSuffix: true });
      },
    },
  ];

  return (
    <Layout>
      <Row gutter={[6, 16]}>
        <Col span={4}>
          <Input.Group
            style={{ display: "flex" }}
            onChange={_.debounce(onSearch, 1000)}
          >
            <Select
              defaultValue="name"
              onChange={(value) => setSearchBy(value)}
            >
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="type">Category</Select.Option>
            </Select>

            <Search placeholder={`Search by ${searchBy}`} />
          </Input.Group>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={ownCourses}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={({ current, pageSize }) => {
          setPagination({ ...pagination, current, pageSize });
        }}
      />
    </Layout>
  );
};

export default coursesSchedule;
