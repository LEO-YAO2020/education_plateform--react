import axios from "axios";
import { basePath, subPath, creatUrl } from "./urlService";

export const login = async (loginType, email, password) => {
  const loginResponse = await axios
    .post("api/" + basePath.login, {
      email: email,
      password: password,
      type: loginType,
    })
    .then((res) => res)
    .catch((err) => console.log(err));

  return loginResponse;
};

export const getStudents = async (param) => {
  const getStudentResponse = await axios
    .get("api/" + creatUrl(basePath.student, param))
    .then((res) => res)
    .catch((err) => console.log(err));
  return getStudentResponse;
};

export const logout = async (type) => {
  const logoutResponse = await axios
    .post("api/" + creatUrl(basePath.logout), { type: type })
    .then((res) => res)
    .catch((err) => console.log(err));

  return logoutResponse;
};

export const search = async (param) => {
  const searchResponse = await axios
    .get("api/" + creatUrl(basePath.student, param))
    .then((res) => res)
    .catch((err) => console.log(err));
  return searchResponse;
};
