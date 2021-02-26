import React, { useState, useEffect } from "react";
import { Col, Row, Typography, Calendar, Badge, Descriptions } from "antd";
import { getStudentCoursesSchedule } from "../../api/response";
import { ClockCircleOutlined, NotificationFilled } from "@ant-design/icons";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  getDay,
  getMonth,
  getYear,
  isSameDay,
} from "date-fns";
import { cloneDeep, omit, orderBy } from "lodash";
import Modal from "antd/lib/modal/Modal";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const generateClassCalendar = (course) => {
  const {
    startTime,
    durationUnit,
    duration,
    schedule: { classTime, chapters },
  } = course;

  if (!classTime) {
    return [];
  }

  function sortWeekdaysBy(weekDays, start) {
    const startWeekDay = getDay(start);

    weekDays = orderBy(weekDays, ["weekday", "time"], ["asc", "asc"]);

    const firstIndex = weekDays.findIndex(
      (item) => item.weekday === startWeekDay
    );
    const head = weekDays.slice(firstIndex);
    const rest = weekDays.slice(0, firstIndex);

    return [...head, ...rest];
  }

  const chaptersCopy = cloneDeep(chapters);
  const start = new Date(startTime);
  const addFns = [addYears, addMonths, addDays, addWeeks];
  const end = addFns[durationUnit - 1](start, duration);
  const days = differenceInCalendarDays(end, start);

  const transformWeekday = (day) => weekDays.findIndex((item) => item === day);
  const classTimes = classTime.map((item) => {
    const [day, time] = item.split(" ");
    const weekday = transformWeekday(day);

    return { weekday, time };
  });
  const sortedClassTimes = sortWeekdaysBy(classTimes, start);

  const getClassInfo = (day) =>
    sortedClassTimes.find((item) => item.weekday === day);
  const result = [
    {
      date: start,
      chapter: chaptersCopy.shift(),
      weekday: getDay(start),
      time: "",
    },
  ];

  for (let i = 1; i < days; i++) {
    const date = addDays(start, i);
    const day = getDay(date);
    const classInfo = getClassInfo(day);

    if (classInfo) {
      const chapter = chaptersCopy.shift();

      result.push({ date, chapter, ...classInfo });
    }
  }

  return result;
};
const coursesSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(null);

  const dateCellRender = (value) => {
    const listData = schedule
      .map((course) => {
        const { calendar } = course;
        const target = calendar.find((item) =>
          isSameDay(new Date(value), item.date)
        );

        return !!target ? { class: target, ...omit(course, "calendar") } : null;
      })
      .filter((item) => !!item);

    return (
      <>
        {listData.map((item, index) => (
          <Row
            gutter={[6, 16]}
            key={index}
            onClick={() => setIsModalVisible(item)}
          >
            <Col span={12}>
              <Row>
                <Col span={4}>
                  <ClockCircleOutlined />
                </Col>
                <Col span={8}> {item.class.time}</Col>
              </Row>
            </Col>
            <Col span={12}>{item.name}</Col>
          </Row>
        ))}
      </>
    );
  };

  function monthCellRender(value) {
    const month = getMonth(new Date(value));
    const year = getYear(new Date(value));
    const result = schedule
      .map((course) => {
        const result = course.calendar.filter((item) => {
          const classMonth = getMonth(item.date);
          const classYear = getYear(item.date);

          return classYear === year && classMonth === month;
        });
        const total = result.length;

        return !!total ? { ...course, statistics: { total } } : null;
      })
      .filter((item) => !!item);

    return result.length ? (
      <>
        {result.map((course) => (
          <Row gutter={[6, 6]} key={course.id}>
            <Col>
              <b>{course.name}</b>
            </Col>
            <Col offset={1}>{course.statistics.total} lessons</Col>
          </Row>
        ))}
      </>
    ) : null;
  }

  useEffect(async () => {
    const userId = localStorage.getItem("userId");
    const res = await getStudentCoursesSchedule({ userId });

    const { data } = res.data;
    const result = data.map((course) => ({
      ...course,
      calendar: generateClassCalendar(course),
    }));

    setSchedule(result);
  }, []);

  return (
    <>
      <Row>
        <Col span={8}>
          <Typography.Title level={2}>Courses Schedule</Typography.Title>
        </Col>
      </Row>
      <Calendar
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
      />
      <Modal
        title="Class Info"
        visible={true}
        footer={null}
        visible={!!isModalVisible}
        onCancel={() => setIsModalVisible(null)}
      >
        <Descriptions>
          <Descriptions.Item label="Course Name" span={8}>
            {isModalVisible?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Chapter N.O" span={8}>
            {isModalVisible?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Course Type" span={8}>
            {isModalVisible?.type[0]?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Class Time" span={7}>
            {isModalVisible?.class.time}
            <span>
              <NotificationFilled
                onClick={() => {
                  setIsModalVisible(null);
                }}
              />
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Teacher Name" span={8}>
            {isModalVisible?.teacherName}
          </Descriptions.Item>
          <Descriptions.Item label="Chapter Name" span={8}>
            {isModalVisible?.class.chapter?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Chapter Content" span={8}>
            {isModalVisible?.class.chapter?.content}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default coursesSchedule;
