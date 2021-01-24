import { Card, Col, Progress, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { TeamOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import styled from "styled-components";
import {
  getTotalDataOverview,
  getStudentOverviewData,
  getTeacherOverviewData,
} from "../../api/response";
import Role from "../../lib/role";
import dynamic from "next/dynamic";
import PieChart from "./pieChart";
import LineChart from "./lineChart";
import Histogram from "./histogram";

const TitleIconStyle = styled(Col)`
  display: flex;
  font-size: 38px;
  justify-content: center;
  align-items: center;

  span {
    border-radius: 50%;
    background-color: white;
    padding: 15px;
  }
`;
const RowStyle = styled(Row)`
  font-weight: 700;
  color: white;
`;
const DistributionWithNoSSR = dynamic(() => import("./mapChart"), {
  ssr: false,
});
const { Option } = Select;

const overViewCard = () => {
  const [courseOverview, setCourseOverview] = useState({});
  const [studentOverview, setStudentOverview] = useState({});
  const [teacherOverview, setTeacherOverview] = useState({});
  const [studentData, setStudentData] = useState();
  const [teacherData, setTeacherData] = useState();
  const [selectType, setSelectType] = useState("studentType");
  const [distributionRole, setDistributionRole] = useState(Role.student);

  useEffect(async () => {
    const totalDataResponse = await getTotalDataOverview();
    const studentResponse = await getStudentOverviewData();
    const teacherResponse = await getTeacherOverviewData();

    const totalDataResponseData = totalDataResponse.data.data;
    const studentResponseData = studentResponse.data.data;
    const teacherResponseData = teacherResponse.data.data;
    const { student, course, teacher } = totalDataResponseData;

    setTeacherData(teacherResponseData);
    setStudentData(studentResponseData);
    setCourseOverview(course);
    setStudentOverview(student);
    setTeacherOverview(teacher);
  }, []);

  return (
    <>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Card style={{ backgroundColor: "#1890ff" }}>
            <Row>
              <TitleIconStyle span={6}>
                <TeamOutlined />
              </TitleIconStyle>
              <Col span={18}>
                <RowStyle>Total Students</RowStyle>
                <RowStyle style={{ fontSize: "30px" }}>
                  {studentOverview.total}
                </RowStyle>
                <RowStyle>
                  <Progress
                    percent={
                      (studentOverview.lastMonthAdded / studentOverview.total) *
                      100
                    }
                  />
                </RowStyle>
                <RowStyle style={{ fontWeight: "normal" }}>
                  increase in 30 days
                </RowStyle>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ backgroundColor: "#673bb7" }}>
            <Row>
              <TitleIconStyle span={6}>
                <UserOutlined />
              </TitleIconStyle>
              <Col span={18}>
                <RowStyle>Total Teachers</RowStyle>
                <RowStyle style={{ fontSize: "30px" }}>
                  {teacherOverview.total}
                </RowStyle>
                <RowStyle>
                  <Progress
                    percent={
                      (teacherOverview.lastMonthAdded / teacherOverview.total) *
                      100
                    }
                  />
                </RowStyle>
                <RowStyle style={{ fontWeight: "normal" }}>
                  increase in 30 days
                </RowStyle>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ backgroundColor: "#ffaa16" }}>
            <Row>
              <TitleIconStyle span={6}>
                <BookOutlined />
              </TitleIconStyle>
              <Col span={18}>
                <RowStyle>Total Courses</RowStyle>
                <RowStyle style={{ fontSize: "30px" }}>
                  {courseOverview.total}
                </RowStyle>
                <RowStyle>
                  <Progress
                    percent={Math.round(
                      (courseOverview.lastMonthAdded / courseOverview.total) *
                        100
                    )}
                  />
                </RowStyle>
                <RowStyle style={{ fontWeight: "normal" }}>
                  increase in 30 days
                </RowStyle>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={[6, 16]}>
        <Col span={12}>
          <Card
            size="small"
            title="Distribution"
            extra={
              <Select
                defaultValue={Role.student}
                bordered={false}
                onSelect={setDistributionRole}
              >
                <Option value={Role.student}>Student</Option>
                <Option value={Role.teacher}>Teacher</Option>
              </Select>
            }
          >
            {!!studentData && (
              <DistributionWithNoSSR
                data={
                  distributionRole === Role.student ? studentData : teacherData
                }
                title={distributionRole}
              />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            size="small"
            title="Distribution"
            extra={
              <Select
                defaultValue={selectType}
                bordered={false}
                onSelect={setSelectType}
              >
                <Option value="studentType">Student Type</Option>
                <Option value="courseType">Course Type</Option>
                <Option value="gender">Gender</Option>
              </Select>
            }
          >
            {!!studentData &&
              (selectType === "studentType" ? (
                <PieChart data={studentData.typeName} type={selectType} />
              ) : (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <PieChart
                      data={studentOverview}
                      title="student gender"
                      type={selectType}
                    />
                  </Col>
                  <Col span={12}>
                    <PieChart
                      data={teacherOverview}
                      title="teacher gender"
                      type={selectType}
                    />
                  </Col>
                </Row>
              ))}
          </Card>
        </Col>
      </Row>
      <Row gutter={[6, 16]}>
        <Col span={12}>
          <Card size="small" title="Student Increment">
            {!!studentData && !!teacherData && (
              <LineChart data={{ studentData, teacherData }} />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="Language">
            {!!studentData && <Histogram data={{ studentData, teacherData }} />}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default overViewCard;
