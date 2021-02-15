import { Card, Col, Progress, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  DesktopOutlined,
  BulbOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

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

const CardStyle = styled(Card)`
  border-radius: 10px;
`;

const overViewCard = (props) => {
  const { data } = props;
  const { studentOverView } = props;
  const { title } = props;
  const [pending, setPending] = useState();
  const [action, setAction] = useState();
  const [done, setDone] = useState();

  useEffect(() => {
    if (!studentOverView) {
      return;
    }
    const courses = data.courses;

    const pendingAmount = courses.filter((item) => item.course.status == 0);
    const actionAmount = courses.filter((item) => item.course.status == 1);
    const doneAmount = courses.filter((item) => item.course.status == 2);

    setPending(pendingAmount.length);
    setAction(actionAmount.length);
    setDone(doneAmount.length);
  }, []);

  return (
    <CardStyle style={{ backgroundColor: props.color }}>
      <Row>
        <TitleIconStyle span={6}>
          {studentOverView ? (
            title === "Pending" ? (
              <BulbOutlined />
            ) : title === "Active" ? (
              <DesktopOutlined />
            ) : (
              <SafetyOutlined />
            )
          ) : (
            <TeamOutlined />
          )}
        </TitleIconStyle>
        <Col span={18}>
          <RowStyle> {studentOverView ? title : "Total Students"}</RowStyle>
          <RowStyle style={{ fontSize: "30px" }}>
            {studentOverView
              ? title === "Pending"
                ? pending
                : title === "Active"
                ? action
                : done
              : "Total Students"}
            {data?.total}
          </RowStyle>
          <RowStyle>
            <Progress
              percent={
                studentOverView
                  ? title === "Pending"
                    ? (pending / data?.amount) * 100
                    : title === "Active"
                    ? (action / data?.amount) * 100
                    : (done / data?.amount) * 100
                  : (data?.lastMonthAdded / data?.total) * 100
              }
              strokeColor={studentOverView ? "green" : "blue"}
            />
          </RowStyle>
          <RowStyle style={{ fontWeight: "normal" }}>
            increase in 30 days
          </RowStyle>
        </Col>
      </Row>
    </CardStyle>
  );
};

export default overViewCard;
