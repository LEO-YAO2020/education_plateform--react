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
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getCourseCode,
  getCourseType,
  getTeachers,
  addCourse,
  updateCourse,
} from "../../api/response";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import styled from "styled-components";
import { getTime, format } from "date-fns";
import moment from "moment";
//import DatePicker from "../datePicker/index";

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
  .ant-upload-list-picture-card-container img {
    object-fit: cover;
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
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const courseDetailForm = (props) => {
  const [form] = Form.useForm();
  const course = props.courseFromEdit;
  const edit = props.edit;
  const [type, setType] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [teacherSearch, setTeacherSearch] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState();
  const [initialValues, setInitialValues] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isAdd, setIsAdd] = useState(true);
  const [courseId, setCourseId] = useState();

  useEffect(async () => {
    if (!edit) {
      const courseCode = await getCourseCode();
      const courseTypes = await getCourseType();
      const { data } = courseCode.data;
      const { courseType } = courseTypes.data;

      if (!!props.edit) {
        setIsAdd(false);
      }

      form.setFieldsValue({ uid: data });
      setType([...courseType.models]);
    }
  }, []);

  useEffect(() => {
    if (!!course) {
      const values = {
        ...course,
        typeId: course.typeId + "",
        teacherId: course.teacher,
        startTime: moment(course.startTime),
        number: course.duration,
        period: course.durationUnit,
      };

      form.setFieldsValue(values);

      setFileList([{ name: "Cover Image", url: course.cover }]);
    }
  }, [course]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreview({
      previewImage: file.url || file.preview,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const onFinish = async (values) => {
    const req = {
      ...values,
      duration: +values.number,
      typeId: +values.typeId,
      // !! FIX: HOW TO ADD CUSTOM DATAPICKER.JS
      startTime: 11,
      teacherId: +values.teacherId || +course.teacherId,
      durationUnit: +values.period,
    };

    const response = isAdd
      ? await addCourse(req)
      : await updateCourse({ ...req, id: courseId });

    const { data } = response.data;
    if (data) {
      setIsAdd(false);
      setCourseId(data.id);
      props.onSuccess(data);
    }

    message.success("success");
  };

  const onChange = ({ file, fileList: newFileList }) => {
    setIsUploading(file.status === "uploading");
    setFileList(newFileList);

    if (file.status === "done") {
      form.setFieldsValue({ cover: file.response.url });
    }
  };

  function disabledDate(current) {
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
      >
        <Row gutter={[10, 30]}>
          <Col span={8}>
            <Form.Item
              label="Course Name"
              name="name"
              rules={[
                { required: true },
                {
                  max: 100,
                  min: 3,
                  message: "Course name length must between 3-100 characters",
                },
              ]}
            >
              <Input type="text" placeholder="course name" />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label="Teacher"
              name="teacherId"
              rules={[{ required: true }]}
              style={{ marginLeft: 5 }}
            >
              <Select
                placeholder="Select teacher"
                allowClear
                filterOption="false"
                notFoundContent={teacherSearch ? <Spin size="small" /> : null}
                showSearch
                onSearch={async (value) => {
                  setTeacherSearch(true);
                  const teachers = await getTeachers({ value });
                  console.log(teachers);
                  setTeacher(teachers.data.teachers);
                  setTeacherSearch(false);
                }}
              >
                {/**
                 * !! FixMe:After search, there is no teacher name in Option when use id as value,
                 */}

                {teacher.map(({ id, name }) => {
                  return (
                    <Option value={id} key={id}>
                      {name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label="Type"
              required
              name="typeId"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select Type" allowClear>
                {type.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Course Code"
              rules={[{ required: true }]}
              name="uid"
            >
              <Input type="text" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 30]}>
          <Col span={8}>
            <Form.Item
              name="startTime"
              label="Start Date"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select date"
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              required
              rules={[{ required: true }]}
            >
              <InputNumber
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="maxStudents"
              label="Student Limit"
              required
              rules={[{ required: true }]}
            >
              <InputNumber
                placeholder="Select date"
                min={0}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Duration" required rules={[{ required: true }]}>
              <Input.Group compact="true" style={{ display: "flex" }}>
                <Form.Item name="number" style={{ flex: 1 }}>
                  <InputNumber
                    placeholder="Select date"
                    rules={[{ min: 1 }]}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  name="period"
                  initialValue="2"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="2">Month</Option>
                    <Option value="1">Year</Option>
                    <Option value="3">Day</Option>
                    <Option value="4">Week</Option>
                    <Option value="5">Hour</Option>
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
                {isAdd ? "Create Course" : "Update Course"}
              </Button>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="detail"
              label="Description"
              rules={[{ required: true }, { min: 1, max: 1000 }]}
              required
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
                      onPreview={handlePreview}
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

      <Modal
        visible={!!preview}
        title={preview?.previewTitle}
        footer={null}
        onCancel={() => setPreview(null)}
      >
        <img
          alt="example"
          style={{ width: "100%" }}
          src={preview?.previewImage}
        />
      </Modal>
    </>
  );
};

export default courseDetailForm;
