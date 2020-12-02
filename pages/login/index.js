import {
  Row,
  Col,
  Radio,
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Typography,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Router from "next/router";
import axios from "axios";
import styled from "styled-components";
import Role from "../../lib/role";

const { Title } = Typography;

const StyledTitle = styled(Title)`
  text-align: center;
`;

let onFinish = async (values) => {
  const loginResponse = await axios
    .post("/api/users", {
      email: values.Email,
      password: values.password,
      type: values.loginType,
    })
    .then((res) => {
      return res;
    });

  if (loginResponse.status === 200) {
    localStorage.setItem("token", JSON.stringify(loginResponse.data.token));
    localStorage.setItem(
      "loginType",
      JSON.stringify(loginResponse.data.loginType)
    );
    Router.push("/dashboard");
  } else {
    message.error("Login failed! Please check you email and password!");
  }
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login = function () {
  return (
    <Row justify="center" style={{ marginTop: "5%" }}>
      <Col span={8}>
        <Form
          name="basic"
          className="login-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            remember: true,
            loginType: "student",
          }}
        >
          <StyledTitle>Course Assistant</StyledTitle>
          <Form.Item
            name="loginType"
            rules={[
              {
                required: true,
                message: "Please choose a login type",
              },
            ]}
          >
            <Radio.Group name="loginType" initialValue="student">
              <Radio.Button value={Role.student}>Student</Radio.Button>
              <Radio.Button value={Role.teacher}>Teacher</Radio.Button>
              <Radio.Button value={Role.manager}>Manager</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
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

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
