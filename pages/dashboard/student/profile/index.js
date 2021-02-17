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
} from "antd";
import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import Layout from "../../../../components/layout/layout";
import ImgCrop from "antd-img-crop";
import {
  getStudentProfile,
  updateStudentDetail,
} from "../../../../api/response";

export default function studentProfile() {
  const [studentData, setStudentData] = useState();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState("");

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

      const res = await updateStudentDetail({
        id: studentData.id,
        avatar: url,
      });
      console.log(res);
    }
    if (file.status === "uploading") {
      setUploading(true);
    }
    if (file.status === "done") {
      setUploading(false);
    }
    setFileList(newFileList);
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
    const { data } = res.data;
    console.log(data);
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
                {studentData.name}
              </Descriptions.Item>
              <Descriptions.Item label="Age">
                {studentData.age}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {studentData.gender === 1 ? "Female" : "Male"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {studentData.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {studentData.email}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {studentData.country}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {studentData.address}
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
                {studentData.education}
              </Descriptions.Item>
              <Descriptions.Item label="Interest">
                {studentData.interest.map((item, index) => {
                  return <Tag color={programLanguageColors[index]}>{item}</Tag>;
                })}
              </Descriptions.Item>
              <Descriptions.Item label="Intro">
                {studentData.description}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}

        <Divider />
      </Card>
    </Layout>
  );
}
