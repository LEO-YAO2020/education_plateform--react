import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Slider, message } from "antd";
import React from "react";
import styled from "styled-components";
import { validateMessages } from "../../lib/constant/config";
import { updateTeacher, addTeacher } from "../../api/response";

const ModalFormSubmit = styled(Form.Item)`
  position: absolute;
  bottom: 0;
  right: 8em;
  margin-bottom: 10px;
`;

const prefixSelector = (
  <Form.Item name="prefix" initialValue="86" noStyle>
    <Select style={{ width: 70 }}>
      <Select.Option value="86">+86</Select.Option>
      <Select.Option value="87">+87</Select.Option>
    </Select>
  </Form.Item>
);

export default function AddTeacherForm(props) {
  const [form] = Form.useForm();
  const { teacher } = props;
  const businessAreas = ["China", "New Zealand", "Canada", "Australia"];
  const phone = /^1[3-9]\d{9}$/;
  const SkillDes = ["Know", "Practiced", "Comprehend", "Expert", "Master"];
  console.log(teacher);
  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ offset: 1 }}
      form={form}
      validateMessages={validateMessages}
      onFinish={async (values) => {
        if (!props.isAdd) {
          const params = {
            name: values.name,
            email: values.email,
            country: values.country,
            phone: values.phone,
            prefix: values.prefix,
            skills: values.skills,
            id: props.teacherID,
          };
          const response = await updateTeacher(params);

          if (response.data.code === 200) {
            message.success(response.data.msg);
            props.editSuccess(response.data.data);
          } else {
            message.error(response.data.msg);
          }
        } else {
          const params = {
            name: values.name,
            email: values.email,
            country: values.country,
            phone: values.phone,
            prefix: values.prefix,
            skills: values.skills,
          };
          const response = await addTeacher(params);

          if (response.data.code === 201) {
            props.addSuccess(response.data.data);
            message.success(response.data.msg);
          } else {
            message.error(response.data.msg);
          }
        }
      }}
      initialValues={{
        name: teacher?.name,
        email: teacher?.email,
        country: teacher?.country,
        phone: teacher?.phone,
        skills: teacher?.skills || [{ name: "", level: 2 }],
      }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input type="text" placeholder="teacher name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: "email" }, { required: true }]}
      >
        <Input type="email" placeholder="email" />
      </Form.Item>

      <Form.Item label="Country" name="country" rules={[{ required: true }]}>
        <Select>
          {businessAreas.map((item, index) => (
            <Select.Option value={item} key={index}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true }, { pattern: phone }]}
      >
        <Input addonBefore={prefixSelector} placeholder="mobile phone" />
      </Form.Item>

      <Form.Item label={<b>Skills</b>}> </Form.Item>

      <Form.List name="skills">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Row align="middle" justify="space-between" key={field.name}>
                <Col span={7}>
                  <Form.Item
                    {...field}
                    name={[field.name, "name"]}
                    fieldKey={[field.fieldKey, "name"]}
                    rules={[{ required: true }]}
                  >
                    <Input style={{ textAlign: "right" }} />
                  </Form.Item>
                </Col>

                <Col span={13}>
                  <Form.Item
                    {...field}
                    name={[field.name, "level"]}
                    fieldKey={[field.fieldKey, "level"]}
                  >
                    <Slider
                      step={1}
                      min={1}
                      max={5}
                      tipFormatter={(value) => SkillDes[value]}
                    />
                  </Form.Item>
                </Col>

                <Col style={{ alignSelf: "stretch" }}>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      style={{ margin: "10px 0 0 10px", color: "red" }}
                    />
                  )}
                </Col>
              </Row>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Skill
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <ModalFormSubmit shouldUpdate={true}>
        <Button type="primary" htmlType="submit">
          {props.isAdd ? "Add" : "Update"}
        </Button>
      </ModalFormSubmit>
    </Form>
  );
}
