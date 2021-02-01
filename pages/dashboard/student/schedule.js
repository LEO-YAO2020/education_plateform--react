import React, { useState, useEffect } from "react";
import Layout from "../../../components/layout/layout";
import { Col, Row, Typography, Calendar } from "antd";
import { getStudentCoursesSchedule } from "../../../api/response";

const studentCoursesSchedule = () => {
  const [schedule, setSchedule] = useState();
  function onPanelChange(value, mode) {
    console.log(value.format("YYYY-MM-DD"), mode);
  }
  useEffect(async () => {
    const userId = localStorage.getItem("userId");
    const res = getStudentCoursesSchedule({ userId });
    res.then((res) => {
      setSchedule(res.data.data);
    });
  }, []);
  console.log(schedule);
  return (
    <Layout>
      <Row>
        <Col span={8}>
          <Typography.Title level={2}>Courses Schedule</Typography.Title>
        </Col>
      </Row>
      <Calendar onPanelChange={onPanelChange} />
    </Layout>
  );
};

export default studentCoursesSchedule;
