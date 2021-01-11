import React, { useState } from "react";
import Layout from "../../../../components/layout/layout";
import { Steps, Button, message, Row, Col } from "antd";
import CourseDetailForm from "../../../../components/addCourseForm/courseDetail";
import CourseScheduleForm from "../../../../components/addCourseForm/courseSchedule";
import Success from "../../../../components/addCourseForm/success";

const { Step } = Steps;
const status = ["process", "finish", "wait"];
const title = ["Course Detail", "Course Schedule", "Success"];

const addCourse = () => {
  const [current, setCurrent] = useState(0);
  const [avaNavigate, setAvaNavigate] = useState([0, 1, 2]);

  const onChangeStep = () => {
    console.log(1111);
    setCurrent(current + 1);
    setAvaNavigate([...avaNavigate, current + 1]);
  };

  const content = [
    { content: <CourseDetailForm onSuccess={onChangeStep} /> },
    { content: <CourseScheduleForm onSuccess={onChangeStep} /> },
    { content: <Success /> },
  ];

  const onChange = (current) => {
    console.log("onChange:", current);
    if (avaNavigate.includes(current)) {
      setCurrent(current);
    }
  };
  return (
    <Layout>
      <Steps
        type="navigation"
        current={current}
        onChange={onChange}
        style={{ margin: "20px" }}
      >
        {status.map((item, index) => {
          return <Step key={item} title={title[index]} />;
        })}
      </Steps>

      <div>{content[current].content}</div>
    </Layout>
  );
};

export default addCourse;
