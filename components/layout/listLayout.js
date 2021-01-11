import { Row, Col, Card } from "antd";
import { UserOutlined, HeartFilled } from "@ant-design/icons";
import styled from "styled-components";

const ListStyle = styled(Row)`
  position: relative;

  :after {
    content: "";
    position: absolute;
    bottom: 0;
    background: #ccc;
    width: 100%;
    height: 1px;
  }
  justify-content: space-between;
`;

const tableList = (props) => {
  const DurationUnit = ["year", "month", "day", "week", "hour"];
  const data = props.data;
  const period =
    data.duration > 1
      ? DurationUnit[data.durationUnit - 1] + "s"
      : DurationUnit[data.durationUnit - 1];
  const gutter = [6, 16];

  return (
    <>
      <Card cover={<img src={data.cover} />} {...props.cardStyle}>
        <Row gutter={gutter}>
          {" "}
          <b>{data.name}</b>
        </Row>

        <ListStyle align="middle" gutter={gutter}>
          <Col>{data.startTime}</Col>
          <Col>
            <HeartFilled style={{ color: "red", marginRight: "5px" }} />
            {data.star}
          </Col>
        </ListStyle>

        <ListStyle gutter={gutter}>
          <Col>Duration</Col>
          <Col>
            <b>
              {data.duration} {period}
            </b>
          </Col>
        </ListStyle>

        <ListStyle gutter={gutter}>
          <Col>Teacher</Col>
          <Col>
            <b>{data.teacher}</b>
          </Col>
        </ListStyle>

        <Row gutter={gutter}>
          <Col>
            <UserOutlined style={{ color: "blue" }} />
            &nbsp;Student Limit
          </Col>
          <Col>
            <b>{data.maxStudents}</b>
          </Col>
        </Row>

        {props.children}
      </Card>
    </>
  );
};

export default tableList;
