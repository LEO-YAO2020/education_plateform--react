import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { editItem, addItem } from "../../api/response";

const EditList = (props) => {
  const { student } = props;
  const [form] = Form.useForm();

  //   console.log(student.name);
  //   console.log(student.email);
  //   console.log(student.area);
  //   console.log(student.typeId);

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
    console.log("Success:", values);
    if (!props.isAdd) {
      const params = {
        name: values.name,
        email: values.email,
        area: values.area,
        typeId: values.typeid == "tester" ? 1 : 2,
        id: student.id,
      };
      const editStudent = await editItem(params);
      console.log(editStudent);

      if (editStudent.data.code == 0) {
        message.success(editStudent.data.msg);
        props.isRender();
      } else {
        message.error(editStudent.data.msg);
      }
    } else {
      const params = {
        name: values.name,
        email: values.email,
        area: values.area,
        typeId: values.typeid == "tester" ? 1 : 2,
      };
      const addStudent = await addItem(params);

      if (addStudent.data.code == 0) {
        message.success(addStudent.data.msg);
        props.isRender();
      } else {
        message.error(addStudent.data.msg);
      }
    }
  };

  const onAreaChange = (value) => {
    console.log(value);
  };
  console.log(props.isAdd);
  const initialValues = () => {
    if (!props.isAdd) {
      console.log(1111);
      const initialValues = {
        name: student.name,
        email: student.email,
        area: student.area,
        typeid: student.typeid,
      };
      return initialValues;
    } else {
      console.log(22222);
      const initialValues = {
        name: "",
        email: "",
      };
      return initialValues;
    }
  };

  return (
    <Form
      {...layout}
      form={form}
      name="basic"
      onFinish={onFinish}
      initialValues={initialValues()}
    >
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
          onChange={onAreaChange}
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
        name="typeid"
        rules={[
          {
            required: true,
            message: "Please choose your type !",
          },
        ]}
      >
        <Select
          placeholder="Select a option and change input text above"
          onChange={onAreaChange}
          allowClear
        >
          <Select.Option value="developer">Developer</Select.Option>
          <Select.Option value="tester">Tester</Select.Option>
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
