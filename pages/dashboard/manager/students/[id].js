import React, { useState, useEffect } from "react";
import Layout from "../../../../components/layout/layout";
import { getStudentById } from "../../../../api/response";
import { useRouter } from "next/router";
import { Card, Col, Row, Tabs, Table, Tag } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import styled from "styled-components";
import Link from "next/link";

const H3 = styled.h3`
  display: inline-block;
  color: pink;
  font-size: 30px;
`;

export async function getServerSideProps(context) {
  const { id } = context.params;
  return {
    props: { id },
  };
}

const studentDetail = (props) => {
  const { TabPane } = Tabs;
  const router = useRouter();
  const [info, setInfo] = useState([]);
  const [data, setData] = useState({});
  const [about, setAbout] = useState([]);
  const [interest, setInterest] = useState([]);
  const [courses, setCourses] = useState([]);
  const tagColor = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "greekblue",
    "purple",
  ];
  const columns = [
    {
      title: "No.",

      key: "No.",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_value, record) => {
        return (
          <Link
            href={{
              pathname: "#",
              // query: { id: record.id },
            }}
          >
            {record.name}
          </Link>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "typeName",
      key: "Type",
    },
    {
      title: "Join Time",
      dataIndex: "ctime",
      key: "address",
    },
  ];

  useEffect(async () => {
    const param = { id: router.query.id || props.id };
    const response = await getStudentById(param);
    const studentInfo = response.data.data;
    const info = [
      { label: "Name", data: studentInfo.name },
      { label: "Age", data: studentInfo.age },
      { label: "Email", data: studentInfo.email },
      { label: "Phone", data: studentInfo.phone },
    ];
    const about = [
      { label: "Education", data: studentInfo.education },
      { label: "Area", data: studentInfo.area },
      { label: "Gender", data: studentInfo.gender === 1 ? "Male" : "Female" },
      {
        label: "Member Period",
        data: `${studentInfo.memberStartAt} - ${studentInfo.memberEndAt}`,
      },
      { label: "Type", data: studentInfo.typeName },
      { label: "Create Time", data: studentInfo.ctime },
      { label: "Update Time", data: studentInfo.updateAt },
    ];

    setInfo(info);
    setData(studentInfo);
    setInterest(studentInfo.interest);
    setAbout(about);
    setCourses(studentInfo.courses);
  }, []);

  return (
    <Layout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                src={data?.avatar}
                style={{
                  width: 100,
                  height: 100,
                  display: "block",
                  margin: "auto",
                }}
              />
            }
          >
            <Row gutter={[6, 16]}>
              {info.map((item) => {
                return (
                  <Col
                    span={12}
                    key={item.label}
                    style={{ textAlign: "center" }}
                  >
                    <b>{item.label}</b>
                    <p>{item.data}</p>
                  </Col>
                );
              })}
            </Row>
            <Row gutter={[6, 16]}>
              <Col span={24} style={{ textAlign: "center" }}>
                <b>Address</b>
                <p>{data?.address}</p>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="About" key="1">
                <H3>Information</H3>
                <Row gutter={[6, 16]}>
                  {about.map((item) => {
                    return (
                      <Col span={24} key={item.label}>
                        <b
                          style={{
                            marginRight: 10,
                            display: "inline-block",
                            minWidth: 150,
                          }}
                        >
                          {item.label}
                        </b>
                        <span>{item.data}</span>
                      </Col>
                    );
                  })}
                </Row>

                <H3>Interesting</H3>
                <Row gutter={[6, 16]}>
                  <Col>
                    {interest.map((item, index) => {
                      return (
                        <Tag
                          key={item}
                          color={tagColor[index]}
                          style={{ padding: "5px 10px" }}
                        >
                          {item}
                        </Tag>
                      );
                    })}
                  </Col>
                </Row>

                <Row gutter={[6, 16]}>
                  <Col>
                    <H3>Description</H3>
                    <p>{data?.description}</p>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Courses" key="2">
                <Table rowKey="id" columns={columns} dataSource={courses} />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default studentDetail;
