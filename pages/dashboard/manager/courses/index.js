import React, { useEffect, useState } from "react";
import Layout from "../../../../components/layout/layout";
import { getCourses } from "../../../../api/response";
import { Card, Col, Row } from "antd";

const { Meta } = Card;

const Courses = () => {
  const [data, setData] = useState([]);

  useEffect(async () => {
    const courses = await getCourses();
    const { models } = courses.data.courses;
    console.log("courses", models);
    setData(models);
  }, []);

  return (
    <Layout>
      <Row gutter={[6, 16]}>
        {data.map((item) => {
          return (
            <Col span={6}>
              <Card cover={<img src={item.cover} />}></Card>
            </Col>
          );
        })}
      </Row>
    </Layout>
  );
};

export default Courses;
