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
import Header from "../home/header";
import Link from "next/link";

const { Title } = Typography;

const StyledTitle = styled(Title)`
  text-align: center;
`;

const onFinish = async (values) => {};

const SignUp = function () {
  return (
    <>
      <Header />
      <Row justify="center" style={{ marginTop: "1%" }}>
        <Col span={8}>
          <Form
            layout="vertical"
            name="signUp"
            className="signUp-form"
            onFinish={onFinish}
            initialValues={{
              remember: true,
              loginType: "student",
            }}
          >
            <StyledTitle>Sign up your account</StyledTitle>
            <Form.Item
              name="loginType"
              label="Role"
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
              label="Email"
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
              label="Password"
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

            <Form.Item
              name="Confirm Password"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Please confirm your password!" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <div>
            Already have an account?
            <Link href="login"> Sign in</Link>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SignUp;
