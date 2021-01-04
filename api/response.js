import axios from "axios";
import { basePath, subPath, creatUrl } from "./urlService";
import { message } from "antd";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:3000/api",
  responseType: "json",
});

async function apiGetResponse(url, param = null) {
  const aipResponse = await axiosInstance
    .get(creatUrl(url, param))
    .then((res) => res)
    .catch((err) => message.error(err));
  return aipResponse;
}
async function apiPostResponse(url, param = null) {
  const aipResponse = await axiosInstance
    .post(creatUrl(url), param)
    .then((res) => res)
    .catch((err) => message.error(err));
  return aipResponse;
}

export const login = async (loginType, email, password, remember) => {
  return await apiPostResponse(basePath.login, {
    email: email,
    password: password,
    type: loginType,
    remember: remember,
  });
};

export const getStudents = async (param) => {
  return await apiGetResponse(basePath.student, param);
};

export const logout = async (type) => {
  return await apiPostResponse(basePath.logout, { type: type });
};

export const search = async (param) => {
  return await apiGetResponse(basePath.student, param);
};

export const deleteItem = async (param) => {
  const deleteResponse = await axiosInstance
    .delete(creatUrl([basePath.student, subPath.delete], param))
    .then((res) => res)
    .catch((err) => message.error(err));

  return deleteResponse;
};

export const editItem = async (param) => {
  return await apiPostResponse([basePath.student, subPath.update], param);
};

export const addItem = async (param) => {
  return await apiPostResponse([basePath.student, subPath.add], param);
};

export const getStudentById = async (param) => {
  return await apiGetResponse("/student", param);
};

export const getCourses = async (param) => {
  return await apiGetResponse(basePath.courses, param);
};

export const getCourseDetail = async (param) => {
  return await apiGetResponse(basePath.course, param);
};
