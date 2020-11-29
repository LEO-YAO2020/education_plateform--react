import React from "react";
import { Radio, Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Router from "next/router";
import axios from "axios";

let onFinish = async (values) => {
  const loginResponse = await axios
    .post("/api/users", {
      email: values.Email,
      password: values.password,
      type: values.type,
    })
    .then((res) => {
      // console.log("回执====>" + res);

      return res;
    });
  console.log(loginResponse);
  if (loginResponse.status === 200) {
    localStorage.setItem("user", JSON.stringify(loginResponse.data));
    Router.push("/dashboard");
  } else {
    message.error("Login failed! Please check you email and password!");
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

      <Form
        {...layout}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item label="Type" name="type">
          <Radio.Group initialValues="student">
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
              message: "....",
            },
            {
              min: 4,
              max: 16,
              message: "Password length cannot be greater than 16 digits!",
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
