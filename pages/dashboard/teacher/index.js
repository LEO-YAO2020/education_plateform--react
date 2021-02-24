import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout/layout";
import OverviewCard from "../../../components/managerOverView/overviewCard";
import {
  getStatisticTeacher,
  getStudentStatistic,
} from "../../../api/response";
import { Col, Row } from "antd";

const teacherDashboard = () => {
  const [pending, setPending] = useState();
  const [student, setStudent] = useState();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    getStudentStatistic({ userId }).then((res) => {
      const { data } = res.data;
      console.log(data);
      setStudent(data);
    });
    getStatisticTeacher({ userId }).then((res) => {
      const { data } = res.data;
      setPending(data);
    });
  }, []);
  return (
    <Layout>
      {!!pending && !!student && (
        <>
          <Row gutter={[6, 16]}>
            <Col span={6}>
              <OverviewCard
                teacherOverview={true}
                teacherData={pending}
                title="Pending"
                data={pending}
                color="#1890ff"
              />
            </Col>
            <Col span={6}>
              <OverviewCard
                teacherOverview={true}
                teacherData={pending}
                title="Active"
                data={pending}
                color="#673bb7"
              />
            </Col>
            <Col span={6}>
              <OverviewCard
                teacherOverview={true}
                teacherData={pending}
                title="Done"
                data={pending}
                color="#ffaa16"
              />
            </Col>
            <Col span={6}>
              <OverviewCard
                teacherOverview={true}
                teacherData={pending}
                title="Students"
                color="green"
                data={pending}
                studentData={student}
              />
            </Col>
          </Row>
        </>
      )}
      <div></div>
    </Layout>
  );
};

export default teacherDashboard;
