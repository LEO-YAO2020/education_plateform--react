import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout/layout";
import OverviewCard from "../../../components/managerOverView/overviewCard";
import { Row, Col, Card, List } from "antd";
import { getStudentStatistic } from "../../../api/response";
import { ReloadOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";

const studentDashboard = () => {
  const [courses, setCourses] = useState();
  useEffect(async () => {
    const userId = localStorage.getItem("userId");
    const res = await getStudentStatistic({ userId });
    const { data } = res.data;
    setCourses(data.own);
    console.log(res);
  }, []);
  return (
    <Layout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          {!!courses && (
            <OverviewCard
              color="#1890ff"
              data={courses}
              studentOverView={true}
              title="Pending"
            />
          )}
        </Col>
        <Col span={8}>
          {!!courses && (
            <OverviewCard
              color="#673bb7"
              data={courses}
              studentOverView={true}
              title="Active"
            />
          )}
        </Col>
        <Col span={8}>
          {!!courses && (
            <OverviewCard
              color="#ffaa16"
              data={courses}
              studentOverView={true}
              title="Done"
            />
          )}
        </Col>
      </Row>
      <Card
        title="Courses you might be interested in"
        extra={<ReloadOutlined style={{ color: "blue", cursor: "pointer" }} />}
      ></Card>
    </Layout>
  );
};

export default studentDashboard;
