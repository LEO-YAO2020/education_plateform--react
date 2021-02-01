import {
  Row,
  Col,
  Radio,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  message,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Router from "next/router";
import styled from "styled-components";
import Role from "../../lib/role";
import { login } from "../../api/response";

const { Title } = Typography;

const StyledTitle = styled(Title)`
  text-align: center;
`;

const onFinish = async (values) => {
  const req = [values.loginType, values.email, values.password];
  const loginResponse = await login(...req);

  if (!!loginResponse) {
    localStorage.setItem(
      "token",
      JSON.stringify(loginResponse.data.data.token)
    );
    localStorage.setItem(
      "loginType",
      JSON.stringify(loginResponse.data.data.role)
    );
    localStorage.setItem(
      "userId",
      JSON.stringify(loginResponse.data.data.userId)
    );
    message.success(loginResponse.data.msg);
    Router.push("/dashboard");
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
            name="email"
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
