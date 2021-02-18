import {
  Card,
  Row,
  Col,
  Avatar,
  Upload,
  Tooltip,
  Descriptions,
  Divider,
  Tag,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Cascader,
} from "antd";
import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import Layout from "../../../../components/layout/layout";
import ImgCrop from "antd-img-crop";
import {
  getStudentProfile,
  updateStudentDetail,
  getCountries,
  getDegrees,
  getInterestCourses,
} from "../../../../api/response";
import EditForm from "../../../../components/editTable";
import address from "../../../../data/address.json";

export default function studentProfile() {
  const [studentData, setStudentData] = useState();
  const [fileList, setFileList] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [countries, setCountries] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [interestCourses, setInterestCourses] = useState([]);

  const programLanguageColors = [
    "magenta",
    "volcano",
    "orange",
    "gold",
    "green",
    "cyan",
    "geekblue",
    "purple",
    "red",
    "lime",
  ];

  const onChange = async ({ fileList: newFileList, file }) => {
    if (file?.response) {
      const { url } = file.response;

      await updateStudentDetail({
        avatar: url,
      });
    }

    setFileList(newFileList);
  };

  const updateProfile = (value) => {
    updateStudentDetail({ id: studentData.id, ...value }).then((res) => {
      const { data } = res.data;

      if (!!data) {
        setStudentData(data);
      }
    });
  };

  function beforeUploadAvatar(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  useEffect(async () => {
    const userId = localStorage.getItem("userId");
    const res = await getStudentProfile(userId);
    getCountries().then((res) => {
      const { data } = res.data;
      setCountries(data);
    });
    getDegrees().then((res) => {
      const { data } = res.data;
      setDegrees(data);
    });
    getInterestCourses().then((res) => {
      const { data } = res.data;
      setInterestCourses(data);
    });
    const { data } = res.data;

    setStudentData(data);
    setAvatar(data.avatar);
    setFileList([
      { uid: "-1", name: "image.png", status: "done", url: data.avatar },
    ]);
  }, []);

  return (
    <Layout>
      <Card
        title="My Profile"
        extra={
          <Tooltip title="Double click content to edit" placement="left">
            <QuestionCircleOutlined />
          </Tooltip>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <ImgCrop rotate shape="round">
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUploadAvatar}
                onChange={onChange}
                onPreview={onPreview}
              >
                {!fileList.length && "+ Upload"}
              </Upload>
            </ImgCrop>
          </Col>
        </Row>
        <Divider />
        {!!studentData && (
          <>
            <Descriptions title="User Info">
              <Descriptions.Item label="Name">
                <EditForm
                  text={studentData.name}
                  allowEnterToSave
                  onSave={updateProfile}
                >
                  <Form.Item
                    initialValue={studentData.name}
                    rules={[{ required: true }]}
                    name="name"
                  >
                    <Input />
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Age">
                <EditForm text={studentData.age} onSave={updateProfile}>
                  <Form.Item initialValue={studentData.age} name="age">
                    <InputNumber min={0} max={100} />
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                <EditForm
                  text={studentData.gender === 2 ? "Female" : "Male"}
                  onSave={updateProfile}
                >
                  <Form.Item name="gender">
                    <Radio.Group defaultValue={studentData.gender}>
                      <Radio value={2}>Male</Radio>
                      <Radio value={1}>Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <EditForm
                  text={studentData.phone}
                  allowEnterToSave
                  onSave={updateProfile}
                >
                  <Form.Item
                    initialValue={studentData.phone}
                    rules={[{ required: true }]}
                    name="phone"
                  >
                    <Input />
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {studentData.email}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                <EditForm
                  text={studentData.country}
                  allowEnterToSave
                  onSave={updateProfile}
                >
                  <Form.Item
                    initialValue={studentData.country}
                    rules={[{ required: true }]}
                    name="country"
                  >
                    <Select>
                      {countries.map((item, index) => (
                        <Select.Option value={item.en} key={index}>
                          {item.en}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                <EditForm
                  text={studentData.address}
                  allowEnterToSave
                  onSave={updateProfile}
                >
                  <Form.Item rules={[{ required: true }]} name="address">
                    <Cascader
                      options={address}
                      placeholder="Please select"
                      fieldNames={{
                        label: "name",
                        value: "name",
                        children: "children",
                      }}
                    />
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions title="Member">
              <Descriptions.Item label="Duration">
                From:{studentData.memberStartAt} To:{studentData.memberEndAt}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions title="Other" column={2}>
              <Descriptions.Item label="Degree">
                <EditForm
                  text={studentData.education}
                  allowEnterToSave
                  onSave={updateProfile}
                >
                  <Form.Item
                    initialValue={studentData.education}
                    rules={[{ required: true }]}
                    name="education"
                  >
                    <Select>
                      {degrees.map((item, index) => (
                        <Select.Option value={item.short} key={index}>
                          {item.short}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Interest">
                <EditForm
                  text={studentData.interest.map((item, index) => {
                    return (
                      <Tag color={programLanguageColors[index]}>{item}</Tag>
                    );
                  })}
                  allowEnterToSave
                  onSave={updateProfile}
                >
                  <Form.Item
                    rules={[{ required: true }]}
                    name="interest"
                    initialValue={studentData.interest}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="select one interest language"
                      style={{ minWidth: "10em" }}
                    >
                      {interestCourses.map((item, index) => {
                        return (
                          <Select.Option key={index}>{item.name}</Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Intro">
                <EditForm
                  text={studentData.description}
                  allowEnterToSave
                  onSave={updateProfile}
                >
                  <Form.Item
                    rules={[{ required: true }]}
                    name="description"
                    initialValue={studentData.description}
                  >
                    <Input.TextArea style={{ minWidth: "50vw" }}>
                      {studentData.description}
                    </Input.TextArea>
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>
    </Layout>
  );
}
