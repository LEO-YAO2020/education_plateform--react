import React, { useState, useEffect } from "react";
import CourseDetail from "../../../../components/layout/listLayout";
import Layout from "../../../../components/layout/layout";
import { getCourseDetail } from "../../../../api/response";
import { Badge, Card, Col, Collapse, Row, Steps, Table, Tag } from "antd";
import styled from "styled-components";

const { Step } = Steps;
const { Panel } = Collapse;
const StyledCol = styled(Col)`
  text-align: center;
  border: 1px solid #ccc;

  :nth-child(n) {
    border-right: none;
    border-bottom: none;
  }
  :first-child {
    border-left: 0;
  }
`;

const H1 = styled.h1`
  display: inline-block;
  color: pink;
  font-size: 30px;
`;
const H3 = styled.h3`
  display: inline-block;
  color: pink;
  font-size: 20px;
`;

export async function getServerSideProps(context) {
  const { id } = context.params;
  return {
    props: { id },
  };
}

const courseDetail = (props) => {
  const [courseDetails, setCourseDetails] = useState({});
  const [sales, setSales] = useState([]);
  const [process, setProcess] = useState();
  const [chapters, setChapters] = useState([]);
  const [classTime, setClassTime] = useState([]);
  const [status, setStatus] = useState([
    "success",
    "processing",
    "default",
    "error",
    "warning",
  ]);
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const columns = weekDays.map((weekDay) => {
    return {
      title: weekDay,
      dataIndex: weekDay,
      key: weekDay,
      render: () => {
        //const classTime = courseDetails.schedule.classTime;
        const target = classTime.find((item) => item.includes(weekDay));

        if (target) {
          return target.split(" ")[1];
        }
        return null;
      },
    };
  });

  useEffect(async () => {
    const param = { id: props.id };
    const courseDetail = await getCourseDetail(param);
    const { course } = courseDetail.data;
    const courseSale = course.sales;
    const sale = [
      {
        label: "Price",
        data: courseSale.price,
      },
      {
        label: "Batches",
        data: courseSale.batches,
      },
      {
        label: "Students",
        data: courseSale.studentAmount,
      },
      {
        label: "Earning",
        data: courseSale.earnings,
      },
    ];

    const id = course.schedule.chapters.findIndex((value) => {
      return value.id === course.schedule.current;
    });

    setClassTime(course.schedule.classTime);
    setCourseDetails(course);
    setSales(sale);
    setProcess(id);
    setChapters(course.schedule.chapters);
  }, []);

  return (
    <Layout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <CourseDetail
            data={courseDetails}
            cardStyle={{
              bodyStyle: { paddingBottom: 0 },
            }}
          >
            <Row
              align="center"
              justify="space-between"
              style={{ margin: "0 -24px" }}
            >
              {sales.map((item, index) => {
                return (
                  <StyledCol span="6" key={index}>
                    <H1>{item.data}</H1>
                    <p>{item.label}</p>
                  </StyledCol>
                );
              })}
            </Row>
          </CourseDetail>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <H3>CourseDetail</H3>
            <h3>Create Time</h3>
            <Row style={{ margin: "20px 0" }}>{courseDetails.ctime}</Row>
            <h3>Start Time</h3>
            <Row style={{ margin: "20px 0" }}>{courseDetails.startTime}</Row>
            <Badge status={status[courseDetails.status - 1]} offset={[10, 10]}>
              <h3>Status</h3>
            </Badge>
            <Steps
              size="small"
              current={process}
              offset={[5, 24]}
              style={{ margin: "20px 0" }}
            >
              {chapters.map((item) => {
                return <Step title={item.name} key={item.id} />;
              })}
            </Steps>
            <h3>Course Code</h3>
            <Row style={{ margin: "20px 0" }}>{courseDetails.uid}</Row>
            <h3>Class Time</h3>
            <Row style={{ margin: "20px 0" }}>
              <Table
                rowKey="id"
                size="small"
                columns={columns}
                dataSource={new Array(1).fill({ id: 0 })}
                pagination={false}
                bordered
                onRow={() => ({
                  onMouseEnter: (event) => {
                    const parent = event.target.parentNode;

                    Array.prototype.forEach.call(parent.childNodes, (item) => {
                      item.style.background = "transparent";
                    });
                    parent.style.background = "transparent";
                  },
                })}
              />
            </Row>

            <h3>Category</h3>

            <Row style={{ margin: "20px 0" }}>
              <Tag color="geekblue">{courseDetails.type}</Tag>
            </Row>

            <h3>Description</h3>

            <Row style={{ margin: "20px 0" }}>
              {courseDetails.profile.attrs.description}
            </Row>

            <h3>Chapter</h3>
            {process && (
              <Collapse defaultActiveKey={[process]}>
                {chapters.map((item, index) => {
                  return (
                    <Panel
                      header={item.name}
                      key={index}
                      extra={
                        <Tag
                          color={
                            index === process
                              ? "success"
                              : index < process
                              ? "default"
                              : "warning"
                          }
                        >
                          {index === process
                            ? "Processing"
                            : index < process
                            ? "Finished"
                            : "Not Started"}
                        </Tag>
                      }
                    >
                      <p>{item.content}</p>
                    </Panel>
                  );
                })}
              </Collapse>
            )}
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default courseDetail;
