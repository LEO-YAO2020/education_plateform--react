import React from "react";
import { Radio, Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Router from "next/router";
import axios from "axios";

let onFinish = async (values) => {
  const res = await axios.get("/api/users/" + values.type);
  console.log("远程数据结果：", res.data);
  const value = {
    token: { email: values.Email, password: values.password },
    LoginType: values.type,
  };
  if (
    values.type == "student" ||
    values.type == "manager" ||
    values.type == "teacher"
  ) {
    if (
      values.Email == res.data.user.email &&
      values.password == res.data.user.password
    ) {
      let { token, LoginType } = value;
      localStorage.setItem("token", token);
      localStorage.setItem("LoginType", LoginType);
      Router.push("/dashboard");
    } else {
      alert("Please Enter Correct Email or Password");
    }
  } else {
    alert("Please Choose your type");
  }
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login = function () {
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 8,
    },
  };
  const tailLayout2 = {
    wrapperCol: {
      offset: 8,
      span: 3,
    },
  };

  return (
    <div className="main">
      <h2>Course Assistant</h2>

      <br />
      <br />

      <Form
        {...layout}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item className="ratio" label="Type" name="type">
          <Radio.Group initialValues="Student">
            <Radio.Button value="student">Student</Radio.Button>
            <Radio.Button value="teacher">Teacher</Radio.Button>
            <Radio.Button value="manager">Manager</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Email"
          name="Email"
          rules={[
            {
              required: true,
              pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
              message: "Please input Correct Email!",
            },
          ]}
        >
          <Input
            className="email"
            placeholder="Please enter your Email"
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="password"
          name="password"
          rules={[
            {
              required: true,
              min: 4,
              max: 16,
              message:
                "Password length cannot be less than 4 or greater than 16 digits!",
            },
          ]}
        >
          <Input.Password
            placeholder="Please enter your Password"
            prefix={<LockOutlined />}
          />
        </Form.Item>

        <Form.Item {...tailLayout2} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
