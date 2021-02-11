import { Card, Col, Progress, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { TeamOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import styled from "styled-components";
import {
  getTotalDataOverview,
  getStudentOverviewData,
  getTeacherOverviewData,
  getCoursesOverviewData,
} from "../../api/response";
import Role from "../../lib/role";
import dynamic from "next/dynamic";
import PieChart from "./pieChart";
import LineChart from "./lineChart";
import Histogram from "./histogram";
import OverviewCard from "./overviewCard";

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
const HeatMapWithNoSSR = dynamic(() => import("./heatMap"), {
  ssr: false,
});

const { Option } = Select;

const overViewCard = () => {
  const [courseOverview, setCourseOverview] = useState();
  const [studentOverview, setStudentOverview] = useState();
  const [teacherOverview, setTeacherOverview] = useState();
  const [studentData, setStudentData] = useState();
  const [teacherData, setTeacherData] = useState();
  const [coursesData, setCoursesData] = useState();
  const [selectType, setSelectType] = useState("studentType");
  const [distributionRole, setDistributionRole] = useState(Role.student);

  useEffect(async () => {
    const totalDataResponse = await getTotalDataOverview();
    const studentResponse = await getStudentOverviewData();
    const teacherResponse = await getTeacherOverviewData();
    const coursesResponse = await getCoursesOverviewData();

    const totalDataResponseData = totalDataResponse.data.data;
    const studentResponseData = studentResponse.data.data;
    const teacherResponseData = teacherResponse.data.data;
    const { student, course, teacher } = totalDataResponseData;
    const courseResponseData = coursesResponse.data.data;

    setCoursesData(courseResponseData);
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
          {!!studentOverview && (
            <OverviewCard
              color="#1890ff"
              data={studentOverview}
              title="Student OverView"
            />
          )}
        </Col>
        <Col span={8}>
          {!!teacherOverview && (
            <OverviewCard color="#673bb7" data={teacherOverview} />
          )}
        </Col>
        <Col span={8}>
          {!!courseOverview && (
            <OverviewCard color="#ffaa16" data={courseOverview} />
          )}
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
                <PieChart
                  data={studentData.typeName}
                  type={selectType}
                  title={selectType}
                />
              ) : selectType === "courseType" ? (
                <PieChart
                  data={coursesData.typeName}
                  type={selectType}
                  title={selectType}
                />
              ) : (
                <Row>
                  <Col span={12}>
                    <PieChart
                      data={Object.entries(studentOverview.gender).map(
                        ([name, amount]) => ({
                          name,
                          amount,
                        })
                      )}
                      title="student gender"
                      type={selectType}
                    />
                  </Col>
                  <Col span={12}>
                    <PieChart
                      data={Object.entries(teacherOverview.gender).map(
                        ([name, amount]) => ({
                          name,
                          amount,
                        })
                      )}
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
            {!!studentData && !!teacherData && !!coursesData && (
              <LineChart data={{ studentData, teacherData, coursesData }} />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="Language">
            {!!studentData && <Histogram data={{ studentData, teacherData }} />}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {!!coursesData && (
            <HeatMapWithNoSSR
              data={coursesData.classTime}
              title="Course schedule per weekday"
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default overViewCard;
