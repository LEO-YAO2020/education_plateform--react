import {
  Col,
  Form,
  Row,
  Input,
  Select,
  Button,
  Upload,
  Spin,
  InputNumber,
  message,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getCourseCode,
  getCourseType,
  getTeachers,
  addCourse,
} from "../../api/response";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import styled from "styled-components";
import { getTime } from "date-fns";

const { Option } = Select;
const UploadStyle = styled.div`
  .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    margin: 0;
    height: 289px;
  }
  .ant-upload.ant-upload-select-picture-card > .ant-upload > span {
    width: 100%;
    height: 100%;
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
    height: 290px;
  }
`;

const UploadInner = styled.div`
  .ant-upload.ant-upload-drag .ant-upload-drag-container {
    display: table-cell;
    vertical-align: middle;
  }
`;

let DeleteIcon = styled(DeleteOutlined)`
  position: absolute;
  top: 306px;
  right: 15px;
  display: block;
`;

const courseDetailForm = (props) => {
  const [form] = Form.useForm();
  const [code, setCode] = useState(0);
  const [type, setType] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [teacherSearch, setTeacherSearch] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState();
  const [initialValues, setInitialValues] = useState({});

  useEffect(async () => {
    const courseCode = await getCourseCode();
    const courseTypes = await getCourseType();
    const teacherName = await getTeachers();
    const { data } = courseCode.data;
    const { courseType } = courseTypes.data;
    const { teachers } = teacherName.data;
    console.log(teachers);
    setCode(data);
    setType([...courseType.models]);
  }, []);

  const onFinish = (value) => {
    console.log(value);
    const {
      courseName,
      cover,
      description,
      number,
      period,
      price,
      startDate,
      studentLimit,
    } = value;

    const params = {
      courseName,
      cover,
      description,
      number,
      period,
      price,
      startDate,
      studentLimit,
      teacher,
      type,
    };

    //const courseDetail = addCourse(params);
    props.onSuccess();
    message.success("success");
  };

  const onChange = ({ file, fileList: newFileList }) => {
    console.log(file.status);
    setIsUploading(file.status === "uploading");
    setFileList(newFileList);
  };

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

  function disabledDate(current) {
    // Can not select days before today and today
    const today = getTime(new Date());

    return current.valueOf() < today;
  }

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: "20px" }}
        style={{ margin: "20px" }}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Row gutter={[10, 30]}>
          <Col span={8}>
            <Form.Item
              label="Course Name"
              name="courseName"
              rules={[{ required: true, max: 100, min: 3 }]}
            >
              <Input placeholder="course name" />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Teacher" required name="teacher">
              <Select
                placeholder="Select teacher"
                allowClear
                required
                notFoundContent={teacherSearch ? <Spin size="small" /> : null}
                showSearch
                onSearch={async (value) => {
                  setTeacherSearch(true);
                  const teachers = await getTeachers({ value });
                  setTeacher([...teachers.data.teachers]);
                }}
              >
                {teacher.map((item) => {
                  return (
                    <Option value={item.name} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Type" required name="type">
              <Select placeholder="Select Type" allowClear>
                {type.map((item) => {
                  return (
                    <Option value={item.name} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Course Code" rules={[{ required: true }]}>
              <Input value={code} disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 30]}>
          <Col span={8}>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select date"
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item name="price" label="Price" required>
              <InputNumber
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/$s?|(,*)/g, "")}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item name="studentLimit" label="Student Limit" required>
              <InputNumber
                placeholder="Select date"
                min={0}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Duration" required>
              <Input.Group compact="true">
                <Form.Item name="number">
                  <InputNumber
                    placeholder="Select date"
                    rules={[{ min: 1 }]}
                    style={{ width: "485px" }}
                  />
                </Form.Item>
                <Form.Item name="period" initialValue="month">
                  <Select>
                    <Option value="month">Month</Option>
                    <Option value="year">Year</Option>
                    <Option value="day">Day</Option>
                    <Option value="week">Week</Option>
                    <Option value="hour">Hour</Option>
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ width: "150px" }}
              >
                Create Course
              </Button>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ min: 100, max: 1000 }]}
            >
              <Input.TextArea rows={13} placeholder="Course description" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Cover">
              <UploadStyle>
                <Form.Item
                  name="cover"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <ImgCrop rotate aspect={16 / 9}>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      height="291px"
                      style={{ width: "100%" }}
                      name="files"
                    >
                      {fileList.length >= 1 ? null : (
                        <UploadInner>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined
                              style={{ color: "#40a9ff", fontSize: "48px" }}
                            />
                          </p>
                          <p style={{ fontSize: "24px" }}>
                            Click or drag file to this area to upload
                          </p>
                        </UploadInner>
                      )}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </UploadStyle>
            </Form.Item>
            {isUploading && (
              <DeleteIcon
                onClick={() => {
                  setIsUploading(false);
                  setFileList([]);
                }}
              />
            )}
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default courseDetailForm;
