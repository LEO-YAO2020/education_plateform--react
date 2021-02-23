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
import { round } from "lodash";

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
  const { data, studentData, studentOverView, teacherOverview, title } = props;
  const [pending, setPending] = useState(0);
  const [tPending, setTpending] = useState(0);
  const [action, setAction] = useState(0);
  const [tAction, setTaction] = useState(0);
  const [done, setDone] = useState(0);
  const [tDone, seTdone] = useState(0);

  useEffect(() => {
    if (!studentOverView && !teacherOverview) {
      return;
    }

    const courses = data.courses || data.status;
    const pendingAmount = courses.filter((item) => +item.course?.status === 0);
    const actionAmount = courses.filter((item) => +item.course?.status === 1);
    const doneAmount = courses.filter((item) => +item.course?.status === 2);
    courses.map((item) => {
      if (+item.name === 0) {
        setTpending(item.amount);
      } else if (+item.name === 1) {
        setTaction(item.amount);
      } else if (+item.name === 0) {
        seTdone(item.amount);
      }
    });
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
          ) : title === "TOTAL STUDENTS" ? (
            <TeamOutlined />
          ) : title === "TOTAL TEACHERS" ? (
            <UserOutlined />
          ) : teacherOverview ? (
            title === "Pending" ? (
              <BulbOutlined />
            ) : title === "Active" ? (
              <DesktopOutlined />
            ) : title === "Done" ? (
              <SafetyOutlined />
            ) : (
              <TeamOutlined />
            )
          ) : (
            <BookOutlined />
          )}
        </TitleIconStyle>
        <Col span={18}>
          <RowStyle> {title}</RowStyle>
          <RowStyle style={{ fontSize: "30px" }}>
            {studentOverView
              ? title === "Pending"
                ? pending
                : title === "Active"
                ? action
                : done
              : teacherOverview
              ? title === "Pending"
                ? tPending
                : title === "Active"
                ? tAction
                : title === "Done"
                ? tDone
                : studentData.total
              : null}
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
                  : round((data?.lastMonthAdded / data?.total) * 100, 1)
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
