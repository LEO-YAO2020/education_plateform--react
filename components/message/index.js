import React, { useState, useEffect, useCallback } from "react";
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
import { isMessageRead } from "../../api/response";
import {
  AlertOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMessageContext } from "../provider";

const message = (props) => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({ limit: 20, page: 1 });
  let timeArr = [];
  let source = [];
  let allLen = 0;
  let notificationLen = 0;
  let messageLen = 0;

  const { dispatch } = useMessageContext();

  useEffect(async () => {
    const { messages } = props;

    setHasMore(true);

    if (props.type === "notification") {
      setNotificationData([...notificationData, ...messages]);

      source = [...notificationData, ...messages];
    } else if (props.type === "message") {
      setMessageData([...messageData, ...messages]);

      source = [...messageData, ...messages];
    } else {
      setAllData([...allData, ...messages]);
      source = [...allData, ...messages];
    }

    if (source.length >= props.total) {
      setHasMore(false);
      setData(source);

      return;
    }

    setData(source);
  }, [pagination, props.type]);

  return (
    <>
      <div
        id="msg-container"
        style={{ padding: "0 20px", overflowY: "scroll", maxHeight: "75vh" }}
      >
        <InfiniteScroll
          next={() => {
            setPagination({ ...pagination, page: pagination.page + 1 });
          }}
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
    </>
  );
};

export default message;
