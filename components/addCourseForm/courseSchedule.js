import { Form, Row, Col, Input, Button, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { getTime, format } from "date-fns";
import {
  addCourseSchedule,
  getCourseDetail,
  updateCourseSchedule,
} from "../../api/response";

import TimePicker from "../timePicker/index";

const { Option } = Select;

const courseScheduleForm = (props) => {
  const id = props.courseId;
  const edit = props.edit;
  const [form] = Form.useForm();
  const [selectedWeekDays, setSelectedWeekDays] = useState([]);

  const onFinish = (values) => {
    let { chapters, classTimes } = values;
    classTimes = classTimes.map(
      ({ weekDay, time }) => `${weekDay} ${format(time, "hh:mm:ss")}`
    );

    const scheduleId = props.scheduleId;
    const courseId = props.courseId;

    if (edit && !!id) {
      const response = updateCourseSchedule({
        chapters,
        classTimes,
        scheduleId,
        courseId,
      });

      if (response) {
        message.success("Success");
      }
    } else {
      const response = addCourseSchedule({
        chapters,
        classTimes,
        scheduleId,
        courseId,
      });
      if (response) {
        props.onSuccess();
      }
    }
  };
  const weekDay = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  let selectWeekday = [];

  const updateDate = (value) => {
    console.log(value);
    console.log(form.getFieldValue("classTimes"));
    form.getFieldValue("classTimes").forEach((element) => {
      if (typeof element != "undefined") {
        selectWeekday.push(element.weekDay);
      }
    });

    setSelectedWeekDays([...selectWeekday]);
  };

  const initialValues = {
    chapters: [{ name: "", content: "" }],
    classTimes: [{ weekDay: "", time: "" }],
  };

  useEffect(async () => {
    if (edit && !!id) {
      const detail = await getCourseDetail({ id });
      const { schedule } = detail.data.course;
      console.log(schedule);

      let classTimes = schedule.classTime.map((item) => {
        // let time = moment(item.split(" ")[1]);
        let time = item.split(" ")[1];
        console.log(time);
        time = new Date(`2020-11-11 ${time}`);
        let weekDay = item.split(" ")[0];

        return { weekDay, time };
      });

      form.setFieldsValue({
        chapters: schedule.chapters,
        classTimes: classTimes,
      });
    }
  }, [id]);

  return (
    <>
      <Form
        form={form}
        name="schedule"
        layout="vertical"
        style={{ marginTop: "20px" }}
        style={{ margin: "20px" }}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <h2>Chapters</h2>
            <Form.List name="chapters">
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field) => (
                      <Row key={field.key} gutter={20}>
                        <Col span={8}>
                          <Form.Item
                            {...field}
                            name={[field.name, "name"]}
                            fieldKey={[field.fieldKey, "name"]}
                            rules={[{ required: true }]}
                          >
                            <Input size="large" placeholder="Chapter Name" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, "content"]}
                            fieldKey={[field.fieldKey, "content"]}
                            rules={[{ required: true }]}
                          >
                            <Input size="large" placeholder="Content" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <MinusCircleOutlined
                            style={{ marginTop: "12px" }}
                            onClick={() => {
                              if (fields.length > 1) {
                                remove(field.name);
                              } else {
                                message.warn(
                                  "You must set at least one chapter"
                                );
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Row>
                      <Col span={20}>
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add field
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                );
              }}
            </Form.List>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ width: "100px" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Col>

          <Col span={12}>
            <h2>Class Times</h2>
            <Form.List name="classTimes">
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field) => (
                      <Row key={field.key} gutter={20}>
                        <Col span={8}>
                          <Form.Item
                            {...field}
                            name={[field.name, "weekDay"]}
                            fieldKey={[field.fieldKey, "weekDay"]}
                            rules={[{ required: true }]}
                          >
                            <Select style={{ width: "100%" }} size="large">
                              {weekDay.map((item, index) => {
                                return (
                                  <Option
                                    disabled={selectedWeekDays.includes(item)}
                                    value={item}
                                    key={index}
                                    onChange={(value) => {
                                      setSelectedWeekDays([
                                        ...selectedWeekDays,
                                        value,
                                      ]);
                                    }}
                                  >
                                    {item}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, "time"]}
                            fieldKey={[field.fieldKey, "time"]}
                            rules={[{ required: true }]}
                          >
                            <TimePicker
                              size="large"
                              style={{ width: "100%" }}
                              onChange={(value) => console.log(value)}
                              placeholder="Select time"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <MinusCircleOutlined
                            style={{ marginTop: "12px" }}
                            onClick={() => {
                              if (fields.length > 1) {
                                //deleteDate(fields.name);
                                selectWeekday.splice(fields.name, 1);
                                const index = fields.name;

                                // setSelectedWeekDays([...selected]);
                                console.log(field.name);
                                remove(field.name);
                                updateDate(index);
                              } else {
                                message.warn(
                                  "You must set at least one chapter"
                                );
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Row>
                      <Col span={20}>
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => {
                              updateDate();
                              add();
                            }}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add field
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                );
              }}
            </Form.List>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default courseScheduleForm;
