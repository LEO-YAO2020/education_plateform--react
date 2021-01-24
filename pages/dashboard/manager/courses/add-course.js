import React, { useState } from "react";
import Layout from "../../../../components/layout/layout";
import { Steps } from "antd";
import CourseDetailForm from "../../../../components/addCourseForm/courseDetail";
import CourseScheduleForm from "../../../../components/addCourseForm/courseSchedule";
import Success from "../../../../components/addCourseForm/success";

const { Step } = Steps;
const status = ["process", "finish", "wait"];
const title = ["Course Detail", "Course Schedule", "Success"];

const addCourse = () => {
  const [current, setCurrent] = useState(0);
  const [avaNavigate, setAvaNavigate] = useState([0]);
  const [courseId, setCourseId] = useState();
  const [scheduleId, setScheduleId] = useState();
  const [course, setCourse] = useState(null);

  const onChangeStep = () => {
    console.log(1111);
    setCurrent(current + 1);
    setAvaNavigate([...avaNavigate, current + 1]);
  };

  const content = [
    <CourseDetailForm
      onSuccess={(course) => {
        setCourse(course);
        setCourseId(course.id);
        setScheduleId(course.scheduleId);
        onChangeStep();
      }}
      course={course}
    />,

    <CourseScheduleForm
      courseId={courseId}
      scheduleId={scheduleId}
      onSuccess={onChangeStep}
    />,
    <Success />,
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
      {content.map((content, index) => (
        <div
          key={index}
          style={{ display: index === current ? "block" : "none" }}
        >
          {content}
        </div>
      ))}
    </Layout>
  );
};

export default addCourse;
