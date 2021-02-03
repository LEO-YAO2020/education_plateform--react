import React, { useState, useEffect } from "react";
import Layout from "../../../../components/layout/layout";
import {
  Col,
  List,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  Avatar,
  Card,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  getMessage,
  isMessageRead,
  getMessageStatistic,
} from "../../../../api/response";
import {
  AlertOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";

const studentMessage = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({ limit: 20, page: 1 });
  const [type, setType] = useState(null);
  let timeArr = [];
  let source = [];
  const { dispatch } = useMessageContext();

  useEffect(async () => {
    const userId = localStorage.getItem("userId");

    const res =
      type === null
        ? await getMessage({ ...pagination, userId })
        : await getMessage({ ...pagination, userId, type });
    const { messages } = res.data.data;

    setHasMore(true);

    if (type === "notification") {
      setNotificationData([...notificationData, ...messages]);
      source = [...notificationData, ...messages];
    } else if (type === "message") {
      setMessageData([...messageData, ...messages]);
      source = [...messageData, ...messages];
    } else {
      setAllData([...allData, ...messages]);
      source = [...allData, ...messages];
    }

    if (source.length >= res.data.data.total) {
      setHasMore(false);
      setData(source);

      return;
    }

    const res = await getMessageStatistic({ userId });
    const {
      receive: { message, notification },
    } = res.data.data;

    dispatch({
      type: "increment",
      payload: { type: "message", count: message.unread },
    });
    dispatch({
      type: "increment",
      payload: { type: "notification", count: notification.unread },
    });

    setData(source);
  }, [pagination, type]);

  return (
    <Layout>
      <Row>
        <Col span={8}>
          <Typography.Title level={2}>Recent Message</Typography.Title>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: "right" }}>
          <Select
            defaultValue={null}
            onSelect={(value) => {
              setType(value);
              setPagination({ ...pagination, page: 1 });
            }}
            style={{ minWidth: 100 }}
          >
            <Select.Option value={null}>All</Select.Option>
            <Select.Option value="notification">Notification</Select.Option>
            <Select.Option value="message">Message</Select.Option>
          </Select>
        </Col>
      </Row>
      <div
        id="msg-container"
        style={{ padding: "0 20px", overflowY: "scroll", maxHeight: "75vh" }}
      >
        <InfiniteScroll
          next={() =>
            setPagination({ ...pagination, page: pagination.page + 1 })
          }
          loader={
            <div style={{ textAlign: "center" }}>
              <Spin />
            </div>
          }
          hasMore={hasMore}
          dataLength={data.length}
          endMessage={<div style={{ textAlign: "center" }}>No more</div>}
          scrollableTarget="msg-container"
        >
          <List
            dataSource={data}
            renderItem={(item) => {
              timeArr.push(item.createdAt.split(" ")[0]);

              return (
                <>
                  <List.Item
                    key={item.id}
                    style={{ opacity: item.status ? 0.4 : 1 }}
                    extra={
                      <Space>
                        {item.type === "notification" ? (
                          <AlertOutlined />
                        ) : (
                          <MessageOutlined />
                        )}
                      </Space>
                    }
                    onClick={async () => {
                      if (item.status === 1) {
                        return;
                      }
                      const ids = item.id;
                      const res = await isMessageRead({
                        ids: [ids],
                        status: 1,
                      });
                      if (res.data.data) {
                        const target = data.find(
                          (element) => element.id === item.id
                        );
                        target.status = 1;
                      }

                      setData([...data]);

                      dispatch({
                        type: "decrement",
                        payload: { type, count: 1 },
                      });
                    }}
                  >
                    <Row>
                      <Col>
                        {timeArr.filter(
                          (time) => time === item.createdAt.split(" ")[0]
                        ).length >= 2 ? null : (
                          <Typography.Title level={4}>
                            {item.createdAt.split(" ")[0]}
                          </Typography.Title>
                        )}
                        <Row style={{ marginTop: "15px" }} gutter={[16, 16]}>
                          <Col>
                            <Avatar icon={<UserOutlined />} />
                          </Col>
                          <Col>
                            <Row style={{ fontWeight: "700" }}>
                              {item.from.nickname}
                            </Row>
                            <Row style={{ marginTop: "15px" }}>
                              {item.content}
                            </Row>
                          </Col>
                        </Row>
                        {item.createdAt}
                      </Col>
                    </Row>
                  </List.Item>
                </>
              );
            }}
          ></List>
        </InfiniteScroll>
      </div>
    </Layout>
  );
};

export default studentMessage;
