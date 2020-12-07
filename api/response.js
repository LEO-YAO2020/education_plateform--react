import axios from "axios";
import { basePath, subPath, creatUrl } from "./urlService";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:3000/api",
  responseType: "json",
});

export const login = async (loginType, email, password, remember) => {
  const loginResponse = await axiosInstance
    .post(creatUrl(basePath.login), {
      email: email,
      password: password,
      type: loginType,
      remember: remember,
    })
    .then((res) => res)
    .catch((err) => console.log(err));

  return loginResponse;
};

export const getStudents = async (param) => {
  const getStudentResponse = await axiosInstance
    .get(creatUrl(basePath.student, param))
    .then((res) => res)
    .catch((err) => console.log(err));
  return getStudentResponse;
};

export const logout = async (type) => {
  const logoutResponse = await axiosInstance
    .post(creatUrl(basePath.logout), { type: type })
    .then((res) => res)
    .catch((err) => console.log(err));

  return logoutResponse;
};

export const search = async (param) => {
  const searchResponse = await axiosInstance
    .get(creatUrl(basePath.student, param))
    .then((res) => res)
    .catch((err) => console.log(err));
  return searchResponse;
};
