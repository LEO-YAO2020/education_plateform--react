import { Card, Col, Progress, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { TeamOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
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

const overViewCard = (props) => {
  const { data } = props;

  return (
    <Card style={{ backgroundColor: props.color }}>
      <Row>
        <TitleIconStyle span={6}>
          <TeamOutlined />
        </TitleIconStyle>
        <Col span={18}>
          <RowStyle>Total Students</RowStyle>
          <RowStyle style={{ fontSize: "30px" }}>{data.total}</RowStyle>
          <RowStyle>
            <Progress percent={(data.lastMonthAdded / data.total) * 100} />
          </RowStyle>
          <RowStyle style={{ fontWeight: "normal" }}>
            increase in 30 days
          </RowStyle>
        </Col>
      </Row>
    </Card>
  );
};

export default overViewCard;
