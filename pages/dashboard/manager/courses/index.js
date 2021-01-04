import React, { useEffect, useState } from "react";
import Layout from "../../../../components/layout/layout";
import { getCourses } from "../../../../api/response";
import { Card, List, Spin, Button } from "antd";
import CourseDetail from "../../../../components/layout/listLayout";
import InfiniteScroll from "react-infinite-scroll-component";
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

  useEffect(async () => {
    const AllCourses = await getCourses(pagination);
    const { courses, length } = AllCourses.data;
    const source = [...data, ...courses];

    if (source.length >= length) {
      setHasMore(false);
      setData(source);

      return;
    }
    setData(source);
    console.log(data);
  }, [pagination]);

  return (
    <Layout>
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
            <List.Item>
              <CourseDetail data={item}>
                <Link
                  href={{
                    pathname: "/dashboard/manager/courses/[id]",
                    query: { id: item.id },
                  }}
                >
                  <Button type="primary" style={{ marginTop: "10px" }}>
                    Read More
                  </Button>
                </Link>
              </CourseDetail>
            </List.Item>
          )}
        ></List>
      </InfiniteScroll>

      <GoBack />
    </Layout>
  );
};

export default Courses;
