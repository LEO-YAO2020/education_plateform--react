import React, { useEffect, useState, useReducer } from "react";
import Layout from "../../../components/layout/layout";
import OverviewCard from "../../../components/managerOverView/overviewCard";
import {
  Row,
  Col,
  Card,
  List,
  Avatar,
  Space,
  Statistic,
  Spin,
  message,
} from "antd";
import { getStudentStatistic, getCourses } from "../../../api/response";
import {
  ReloadOutlined,
  TeamOutlined,
  CalendarFilled,
  HeartFilled,
} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

const { Countdown } = Statistic;
const RowStyle = styled(Row)`
  position: relative;
  top: 45px;
  right: 77%;
`;
const Div = styled(Space)`
  .ant-statistic-title {
    float: left;
  }
`;
const initialState = { page: 1, max: 0, recommend: [] };
const limit = 5;

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, page: state.page + 1 };
    case "reset":
      return { ...state, page: 1 };
    case "setMax":
      return { ...state, max: action.payload };
    case "setRecommend":
      return { ...state, recommend: action.payload };
    default:
      throw new Error();
  }
}
const studentDashboard = () => {
  const [courses, setCourses] = useState();
  const [recommend, setRecommend] = useState();
  const [state, dispatch] = useReducer(reducer, initialState);

  const reload = async () => {
    try {
      const { page } = state;
      const current = page * limit > state.max ? 1 : page;
      const coursesRes = await getCourses({ page: current, limit });
      console.log(coursesRes);
      const {
        data: { courses, total },
      } = coursesRes;

      dispatch({ type: page * limit > total ? "reset" : "increment" });

      if (total !== state.max) {
        dispatch({ type: "setMax", payload: total });
      }

      dispatch({ type: "setRecommend", payload: courses });
    } catch (err) {
      message.error("Server is busy, please try again later!");
    }
  };

  useEffect(async () => {
    const userId = localStorage.getItem("userId");
    const res = await getStudentStatistic({ userId });
    const { data } = res.data;

    setCourses(data.own);
    setRecommend(data.recommend);
    dispatch({ type: "setRecommend", payload: data.recommend.courses });
    console.log(state);
  }, []);

  return (
    <Layout>
      {!!courses && (
        <>
          <Row gutter={[6, 16]}>
            <Col span={8}>
              <OverviewCard
                color="#1890ff"
                data={courses}
                studentOverView={true}
                title="Pending"
              />
            </Col>
            <Col span={8}>
              <OverviewCard
                color="#673bb7"
                data={courses}
                studentOverView={true}
                title="Active"
              />
            </Col>
            <Col span={8}>
              <OverviewCard
                color="#ffaa16"
                data={courses}
                studentOverView={true}
                title="Done"
              />
            </Col>
          </Row>
        </>
      )}
      {!!recommend && (
        <>
          <Card
            title="Courses you might be interested in"
            extra={
              <ReloadOutlined
                style={{ color: "blue", cursor: "pointer" }}
                onClick={reload}
              />
            }
          >
            <List
              itemLayout="horizontal"
              size="large"
              dataSource={state.recommend}
              renderItem={(item) => {
                return (
                  <>
                    <List.Item
                      key={item.id}
                      actions={[
                        <Div>
                          <Countdown
                            title="In Processing"
                            value={new Date(item.startTime).getTime()}
                            format="D day H : mm : ss "
                          ></Countdown>
                        </Div>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.cover} />}
                        title={item.name}
                        description={item.detail}
                      />
                      <RowStyle gutter={[16, 16]}>
                        <Col span={8}>
                          <Space>
                            <TeamOutlined />
                            {item.maxStudents}
                          </Space>
                        </Col>
                        <Col span={8}>
                          <Space>
                            <HeartFilled />
                            {item.star}
                          </Space>
                        </Col>
                        <Col span={8}>
                          <Space>
                            <CalendarFilled />
                            {item.durationUnit}
                          </Space>
                        </Col>
                      </RowStyle>
                    </List.Item>
                  </>
                );
              }}
            />
          </Card>
        </>
      )}
    </Layout>
  );
};

export default studentDashboard;
