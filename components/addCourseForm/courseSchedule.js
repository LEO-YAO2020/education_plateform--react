import {
  Form,
  Row,
  Col,
  Input,
  Button,
  message,
  Select,
  TimePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { getTime, format } from "date-fns";
import { addCourseSchedule, getCourseDetail } from "../../api/response";
import moment from "moment";

const { Option } = Select;

const courseScheduleForm = (props) => {
  const id = props.courseId;
  const edit = props.edit;
  const [form] = Form.useForm();
  const [selectedWeekDays, setSelectedWeekDays] = useState([]);
  const [index, setIndex] = useState(false);

  const onFinish = (values) => {
    console.log(values);
    let { chapters, classTimes } = values;
    classTimes = classTimes.map(({ weekDay, time }) => `${weekDay} 2020-2-2`);

    const scheduleId = props.scheduleId;
    const courseId = props.courseId;

    const response = addCourseSchedule({
      chapters,
      classTimes,
      scheduleId,
      courseId,
    });
    // const { class: origin, chapters } = values;
    // const class = origin.map(
    //   ({ weekday, time }) => `${weekday} ${format(time, "hh:mm:ss")}`
    // );
    // const req: ProcessRequest = { chapters, classTime, processId, courseId };
    props.onSuccess();
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

  let callBack = null;
  let callBack2 = null;
  let selectWeekday = [];

  const updateDate = (value) => {
    console.log(value);
    console.log(form.getFieldValue("class"));
    form.getFieldValue("class").forEach((element) => {
      if (typeof element != "undefined") {
        selectWeekday.push(element.weekDay);
      }
    });

    setSelectedWeekDays([...selectWeekday]);
  };

  // const deleteDate = (index) => {
  //   console.log(form.getFieldValue());
  //   console.log(index);
  //   setSelectedWeekDays([selectedWeekDays.splice(index, 1)]);
  // };

  useEffect(() => {
    callBack();
    callBack2();
  }, []);

  useEffect(async () => {
    if (edit) {
      const detail = await getCourseDetail({ id });
      const { schedule } = detail.data.course;
      console.log(schedule);

      let classTimes = schedule.classTime.map((item) => {
        let time = moment(item.split(" ")[1]);
        // time = { time: moment(item) };
        let weekDay = item.split(" ")[0];

        return { weekDay, time };
      });

      // let time = schedule.classTime.map((item) => {
      //   return item.split(" ")[1];
      // });
      // let weekday = schedule.classTime.map((item) => {
      //   return item.split(" ")[0];
      // });
      // time = time.map((item) => {
      //   return { time: moment(item) };
      // });
      // weekday = weekday.map((item) => {
      //   return { weekday: item };
      // });
      // console.log(time);
      // console.log(weekday);
      // let classTimes = [time, weekday];
      // classTimes = classTimes.reduce((acc, cur) => [...acc, ...cur], []);
      console.log(classTimes);
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
      >
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <h2>Chapters</h2>
            <Form.List name="chapters">
              {(fields, { add, remove }) => {
                callBack = add;
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
                callBack2 = add;

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
