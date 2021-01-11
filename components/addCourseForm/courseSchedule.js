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

const { Option } = Select;

const courseScheduleForm = (props) => {
  const [form] = Form.useForm();
  const [selectedWeekDays, setSelectedWeekDays] = useState([]);
  const [index, setIndex] = useState(false);

  const onFinish = (value) => {
    console.log(value);
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

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: "20px" }}
        style={{ margin: "20px" }}
        onFinish={onFinish}
      >
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <h2>Chapters</h2>
            <Form.List name="users">
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
            <Form.List name="class">
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
