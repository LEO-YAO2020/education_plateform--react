import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { editItem, addItem } from "../../api/response";

const EditList = (props) => {
  console.log("props :>> ", props.studentDetail);
  console.log("props :>> ", props.isAdd);
  const { student, studentDetail } = props;
  const [form] = Form.useForm();
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      offset: 1,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  const onFinish = async (values) => {
    if (!props.isAdd) {
      const params = {
        name: values.name,
        email: values.email,
        area: values.area,
        type: values.type,
        id: student,
      };
      const response = await editItem(params);

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
        area: values.area,
        typeId: values.type,
      };
      const response = await addItem(params);

      if (response.data.code === 200) {
        props.addSuccess(response.data.data);
      } else {
        message.error(response.data.msg);
      }
    }
  };

  const initialValues = () => {
    if (!props.isAdd) {
      const initialValues = {
        name: studentDetail.name,
        email: studentDetail.email,
        area: studentDetail.area,
      };
      return initialValues;
    } else {
      const initialValues = {
        name: "",
        email: "",
      };

      return initialValues;
    }
  };

  return (
    <Form {...layout} form={form} name="basic" onFinish={onFinish}>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your name !",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            type: "email",
            message: "Please input your email !",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Area"
        name="area"
        rules={[
          {
            required: true,
            message: "Please choose your area !",
          },
        ]}
      >
        <Select
          placeholder="Select a option and change input text above"
          allowClear
        >
          <Select.Option value="China">China</Select.Option>
          <Select.Option value="Canada">Canada</Select.Option>
          <Select.Option value="Australia">Australia</Select.Option>
          <Select.Option value="NewZealand">NewZealand</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Student Type"
        name="type"
        rules={[
          {
            required: true,
            message: "Please choose your type !",
          },
        ]}
      >
        <Select
          placeholder="Select a option and change input text above"
          allowClear
        >
          <Select.Option value={2}>Developer</Select.Option>
          <Select.Option value={1}>Tester</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout} style={{ position: "relative" }}>
        <Button
          type="primary"
          htmlType="submit"
          style={{ position: "absolute", top: "91px", left: "141px" }}
        >
          {props.isAdd ? "Add" : "Update"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditList;
