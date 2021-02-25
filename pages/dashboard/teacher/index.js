import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout/layout";
import OverviewCard from "../../../components/managerOverView/overviewCard";
import {
  getStatisticTeacher,
  getStudentStatistic,
} from "../../../api/response";

import { Card, Col, Row } from "antd";
import PieChart from "../../../components/managerOverView/pieChart";
import LineChart from "../../../components/managerOverView/lineChart";
import dynamic from "next/dynamic";

const HeatMapWithNoSSR = dynamic(
  () => import("../../../components/managerOverView/heatMap"),
  {
    ssr: false,
  }
);

const teacherDashboard = () => {
  const [overview, setOverview] = useState();
  const [student, setStudent] = useState();
  const [category, setCategory] = useState();
  const [courses, setCourses] = useState();
  const [coursesSchedule, setCoursesSchedule] = useState();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    getStudentStatistic({ userId }).then((res) => {
      const { data } = res.data;
      setStudent(data);
    });
    getStatisticTeacher({ userId }).then((res) => {
      const { data } = res.data;

      setOverview(data);
      setCategory(data.type);
      setCourses(data.createdAt);
      setCoursesSchedule(data.classTime);
    });
  }, []);
  return (
    <Layout>
      {!!overview && !!student && (
        <>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <OverviewCard
                teacherOverview={true}
                teacherData={overview}
                title="Pending"
                data={overview}
                color="#1890ff"
              />
            </Col>
            <Col span={6}>
              <OverviewCard
                teacherOverview={true}
                teacherData={overview}
                title="Active"
                data={overview}
                color="#673bb7"
              />
            </Col>
            <Col span={6}>
              <OverviewCard
                teacherOverview={true}
                teacherData={overview}
                title="Done"
                data={overview}
                color="#ffaa16"
              />
            </Col>
            <Col span={6}>
              <OverviewCard
                teacherOverview={true}
                teacherData={overview}
                title="Students"
                color="green"
                data={overview}
                studentData={student}
              />
            </Col>
          </Row>
        </>
      )}

      <Row gutter={[6, 16]}>
        <Col span={12}>
          {!!category && (
            <Card title="Course Category">
              <PieChart data={category} />
            </Card>
          )}
        </Col>
        <Col span={12}>
          {!!courses && (
            <Card title="Course Increment">
              <LineChart data={courses} />
            </Card>
          )}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {!!coursesSchedule && (
            <HeatMapWithNoSSR
              data={coursesSchedule}
              title="Course schedule per weekday"
            />
          )}
        </Col>
      </Row>
    </Layout>
  );
};

export default teacherDashboard;
