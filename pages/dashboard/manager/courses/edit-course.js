import React, { useState } from "react";
import Layout from "../../../../components/layout/layout";
import CourseDetailForm from "../../../../components/addCourseForm/courseDetail";
import CourseScheduleForm from "../../../../components/addCourseForm/courseSchedule";
import { Input, Select, Spin, Row, Col, Tabs } from "antd";
import { getCourses } from "../../../../api/response";
import _ from "lodash";
import styled from "styled-components";

// const BorderStyled = styled.div`
//   .ant-select-selector {
//     border-right: none !important;
//   }
// `;

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

const editCourse = () => {
  const [searchBy, setSearchBy] = useState("name");
  const [getCourseBySearch, setGetCourseBySearch] = useState([]);
  const [courseDetail, setCourseDetail] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [courseId, setCourseId] = useState();

  async function onSearch(value) {
    setIsUploading(true);
    const course = await getCourses({ [searchBy]: value });
    const { courses } = course.data;
    setGetCourseBySearch(courses);

    console.log(courses);
  }

  return (
    <Layout>
      <Row gutter={[6, 16]}>
        <Col span={12}>
          <Input.Group style={{ display: "flex" }}>
            <Select
              defaultValue="name"
              onChange={(value) => setSearchBy(value)}
            >
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="code">Code</Select.Option>
              <Select.Option value="type">Category</Select.Option>
            </Select>

            <Select
              placeholder={`Search course by ${searchBy}`}
              allowClear
              filterOption={false}
              notFoundContent={isUploading ? <Spin size="small" /> : null}
              showSearch
              onSearch={_.debounce(onSearch, 1000)}
              onSelect={(_value, id) => {
                const courseChoose = getCourseBySearch.find((item) => {
                  return item.id == id.key;
                });

                setCourseDetail(courseChoose);
                setCourseId(+courseChoose.id);
              }}
              style={{ flex: 1 }}
            >
              {getCourseBySearch.map((item, index) => {
                return (
                  <Select.Option value={item.name} key={item.id}>
                    {`${item.name} - ${item.teacher} - ${item.type}`}
                  </Select.Option>
                );
              })}
            </Select>
          </Input.Group>
        </Col>
      </Row>
      <Tabs onChange={callback} type="card">
        <TabPane tab="Course Schedule" key="1">
          <CourseDetailForm edit={true} courseFromEdit={courseDetail} />
        </TabPane>
        <TabPane tab="Course Detail" key="2">
          <CourseScheduleForm courseId={courseId} edit={true} />
        </TabPane>
      </Tabs>
    </Layout>
  );
};

export default editCourse;
