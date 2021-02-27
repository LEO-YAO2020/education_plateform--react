import {
  Card,
  Row,
  Col,
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
  Rate,
  Button,
  message,
} from "antd";
import {
  MinusCircleOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import Layout from "../../../components/layout/layout";
import ImgCrop from "antd-img-crop";
import {
  getProfile,
  updateTeacherDetail,
  getCountries,
} from "../../../api/response";
import EditForm from "../../../components/editTable";
import address from "../../../data/address.json";

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

export default function studentProfile() {
  const [teacherData, setTeacherData] = useState();
  const [fileList, setFileList] = useState([]);
  const [countries, setCountries] = useState([]);
  const SkillDes = ["Know", "Practiced", "Comprehend", "Expert", "Master"];
  const skillDes = new Array(5).fill(0).map((_, index) => SkillDes[index + 1]);

  const onChange = async ({ fileList: newFileList, file }) => {
    if (file?.response) {
      const { url } = file.response;

      await updateTeacherDetail({
        avatar: url,
      });
    }

    setFileList(newFileList);
  };

  const updateProfile = (value) => {
    updateTeacherDetail({ id: teacherData.id, ...value }).then((res) => {
      const { data } = res.data;

      if (!!data) {
        setTeacherData(data);
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
    const res = await getProfile(userId);
    getCountries().then((res) => {
      const { data } = res.data;
      setCountries(data);
    });

    const { data } = res.data;

    setTeacherData(data);

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
        {!!teacherData && (
          <>
            <Descriptions title="User Info">
              <Descriptions.Item label="Name">
                <EditForm
                  text={teacherData.name}
                  allowEnterToSave
                  onSave={updateProfile}
                >
                  <Form.Item
                    initialValue={teacherData.name}
                    rules={[{ required: true }]}
                    name="name"
                  >
                    <Input />
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Age">
                <EditForm text={teacherData.age} onSave={updateProfile}>
                  <Form.Item initialValue={teacherData.age} name="age">
                    <InputNumber min={0} max={100} />
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                <EditForm
                  text={teacherData.gender === 2 ? "Female" : "Male"}
                  onSave={updateProfile}
                >
                  <Form.Item name="gender">
                    <Radio.Group defaultValue={teacherData.gender}>
                      <Radio value={2}>Male</Radio>
                      <Radio value={1}>Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <EditForm
                  text={teacherData.phone}
                  allowEnterToSave
                  onSave={updateProfile}
                >
                  <Form.Item
                    initialValue={teacherData.phone}
                    rules={[{ required: true }]}
                    name="phone"
                  >
                    <Input />
                  </Form.Item>
                </EditForm>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {teacherData.email}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                <EditForm
                  text={teacherData.country}
                  allowEnterToSave
                  onSave={updateProfile}
                >
                  <Form.Item
                    initialValue={teacherData.country}
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
                  text={teacherData.address}
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

            <Descriptions title="Other" column={6}>
              <Descriptions.Item label="Skills" span={3}>
                <EditForm
                  textContainerStyles={{ width: "100%" }}
                  text={teacherData?.skills.map((item, index) => (
                    <Row gutter={[6, 16]}>
                      <Col span={4}>
                        <Tag
                          color={programLanguageColors[index]}
                          key={item.name}
                          style={{ padding: "5px 10px" }}
                        >
                          {item.name}
                        </Tag>
                      </Col>
                      <Col offset={1}>
                        <Rate
                          value={item.level}
                          tooltips={skillDes}
                          count={5}
                          disabled
                        />
                      </Col>
                    </Row>
                  ))}
                  onSave={updateProfile}
                  initialValues={{ skills: teacherData?.skills }}
                  layout="column"
                >
                  <Form.List name="skills">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Row gutter={[20, 20]} key={field.key}>
                            <Col span={10}>
                              <Form.Item
                                {...field}
                                name={[field.name, "name"]}
                                fieldKey={[field.fieldKey, "name"]}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="Skill Name" />
                              </Form.Item>
                            </Col>

                            <Col span={10}>
                              <Form.Item
                                {...field}
                                name={[field.name, "level"]}
                                fieldKey={[field.fieldKey, "level"]}
                                rules={[{ required: true }]}
                              >
                                <Rate tooltips={skillDes} count={5} />
                              </Form.Item>
                            </Col>

                            <Col span={2}>
                              <Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => {
                                    if (fields.length > 1) {
                                      remove(field.name);
                                    } else {
                                      message.warn(
                                        "You must set at least one skill."
                                      );
                                    }
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        ))}

                        <Row>
                          <Col span={20}>
                            <Form.Item>
                              <Button
                                type="dashed"
                                size="large"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Skill
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Form.List>
                </EditForm>
              </Descriptions.Item>

              <Descriptions.Item label="Intro" span={3}>
                <EditForm
                  text={teacherData.description}
                  allowEnterToSave
                  onSave={updateProfile}
                  layout="column"
                >
                  <Form.Item
                    rules={[{ required: true }]}
                    name="description"
                    initialValue={teacherData.description}
                  >
                    <Input.TextArea />
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
