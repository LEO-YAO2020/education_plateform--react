import React, { useEffect, useState } from "react";
import Layout from "../../../../components/layout/layout";
import { getCourses } from "../../../../api/response";
import { Card, List, Spin, Button } from "antd";
import CourseDetail from "../../../../components/layout/listLayout";
import InfiniteScroll from "react-infinite-scroller";
import Link from "next/link";
import GoBack from "../../../../components/goBack";
import styled from "styled-components";

const SpinStyle = styled.div`
  position: relative;
  left: 50%;
`;

const Courses = () => {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({ limit: 20, page: 1 });

  const getMore = async () => {
    const AllCourses = await getCourses(pagination);
    const { courses, length } = AllCourses.data;
    const source = [...data, ...courses];

    if (source.length >= length) {
      setHasMore(false);
      setData(source);

      let listTable = document.querySelector(".container");
      let div = document.createElement("div");

      div.style.textAlign = "center";
      div.innerHTML = "<span>No More Courses!!!</span>";
      listTable.appendChild(div);

      return;
    }

    setData(source);
    setPagination({ ...pagination, page: pagination.page + 1 });
  };

  return (
    <Layout>
      <InfiniteScroll
        loader={
          <SpinStyle key={Math.random(32)}>
            <Spin size="large" />
          </SpinStyle>
        }
        hasMore={hasMore}
        loadMore={getMore}
        className="container"
      >
        <List
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Card cover={<img src={item.cover} />}>
                <CourseDetail data={item}>
                  <Link href="#">
                    <Button type="primary" style={{ marginTop: "10px" }}>
                      Read More
                    </Button>
                  </Link>
                </CourseDetail>
              </Card>
            </List.Item>
          )}
        ></List>
      </InfiniteScroll>

      <GoBack />
    </Layout>
  );
};

export default Courses;
