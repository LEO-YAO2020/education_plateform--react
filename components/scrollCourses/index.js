import React, { useEffect, useState } from "react";
import { getCourses } from "../../api/response";
import { List, Spin, Button } from "antd";
import CourseDetail from "../layout/listLayout";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import GoBack from "../goBack";
import styled from "styled-components";

const SpinStyle = styled.div`
  position: relative;
  left: 50%;
`;

const Courses = () => {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [pagination, setPagination] = useState({ limit: 20, page: 1 });

  useEffect(async () => {
    let userId = localStorage.getItem("userId");

    const AllCourses = await getCourses({ ...pagination, userId });

    const { courses, total } = AllCourses.data.data;
    const source = [...data, ...courses];

    if (source.length >= total) {
      setHasMore(false);
      setData(source);

      return;
    }
    setData(source);
  }, [pagination]);

  return (
    <>
      <InfiniteScroll
        next={() => setPagination({ ...pagination, page: pagination.page + 1 })}
        loader={
          <SpinStyle>
            <Spin size="large" />
          </SpinStyle>
        }
        hasMore={hasMore}
        dataLength={data.length}
        endMessage={<SpinStyle>No More Course!</SpinStyle>}
        scrollableTarget="contentLayout"
        className="container"
        style={{ overflow: "hidden" }}
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
            <List.Item key={item.id}>
              <CourseDetail data={item}>
                <Link href={`/dashboard/teacher/courses/${item.id}`} passHref>
                  <Button type="primary" style={{ marginTop: "10px" }}>
                    Read More
                  </Button>
                </Link>
              </CourseDetail>
            </List.Item>
          )}
          style={{ marginBottom: "20px" }}
        ></List>
      </InfiniteScroll>
      <GoBack />
    </>
  );
};

export default Courses;
