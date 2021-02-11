import axios from "axios";
import { basePath, subPath, creatUrl } from "./urlService";
import { message } from "antd";
import { AES } from "crypto-js";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:3000/api",
  responseType: "json",
});

axiosInstance.interceptors.request.use((config) => {
  if (config.url.includes("login")) {
    return {
      ...config,
      baseURL: "https://cms.chtoma.com/api",
      headers: {
        ...config.headers,
      },
    };
  } else if (config.url.includes("schedule")) {
    return {
      ...config,
      baseURL: "https://cms.chtoma.com/api",
      headers: {
        ...config.headers,
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      },
    };
  } else if (config.url.includes("message")) {
    return {
      ...config,
      baseURL: "https://cms.chtoma.com/api",
      headers: {
        ...config.headers,
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      },
    };
  } else if (config.url.includes("statistics")) {
    return {
      ...config,
      baseURL: "https://cms.chtoma.com/api",
      headers: {
        ...config.headers,
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      },
    };
  }

  return config;
});

async function apiGetResponse(url, param = null) {
  const aipResponse = await axiosInstance
    .get(creatUrl(url, param))
    .then((res) => res)
    .catch((err) => message.error(err));
  return aipResponse;
}
async function apiPostResponse(url, param) {
  const aipResponse = await axiosInstance
    .post(creatUrl(url), param)
    .then((res) => res)
    .catch((err) => message.error(err));
  return aipResponse;
}

async function apiPutResponse(url, param) {
  const aipResponse = await axiosInstance
    .put(creatUrl(url), param)
    .then((res) => res)
    .catch((err) => message.error(err));
  return aipResponse;
}

export const login = async (loginType, email, password, remember) => {
  return await apiPostResponse(basePath.login, {
    email: email,
    password: AES.encrypt(password, "cms").toString(),
    role: loginType,
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

export const getCourseCode = async (param) => {
  return await apiGetResponse([basePath.course, subPath.code], param);
};

export const getCourseType = async (param) => {
  return await apiGetResponse([basePath.course, subPath.type], param);
};

export const getTeachers = async (param) => {
  return await apiGetResponse(basePath.teachers, param);
};

export const addCourse = async (param) => {
  return await apiPostResponse([basePath.courses, subPath.add], param);
};

export const updateCourse = async (param) => {
  return await apiPostResponse([basePath.courses, subPath.update], param);
};

export const addCourseSchedule = async (param) => {
  return await apiPostResponse("/courses/schedule", param);
};

export const updateCourseSchedule = async (param) => {
  return await apiPostResponse("/courses/schedule", param);
};

export const getTotalDataOverview = async (param) => {
  return await apiGetResponse([basePath.statistics, subPath.overview], param);
};

export const getStudentOverviewData = async (param) => {
  return await apiGetResponse([basePath.statistics, subPath.student], param);
};

export const getTeacherOverviewData = async (param) => {
  return await apiGetResponse([basePath.statistics, subPath.teacher], param);
};

export const getCoursesOverviewData = async (param) => {
  return await apiGetResponse([basePath.statistics, subPath.course], param);
};

export const getStudentCoursesSchedule = async (param) => {
  return await apiGetResponse("/class/schedule", param);
};

export const getMessage = async (param) => {
  return await apiGetResponse("/message", param);
};

export const isMessageRead = async (param) => {
  return await apiPutResponse("/message", param);
};

export const getMessageStatistic = async (param) => {
  return await apiGetResponse("/message/statistics", param);
};

export const getStudentStatistic = async (param) => {
  return await apiGetResponse("/statistics/student", param);
};

export const messageEvent = (userId) => {
  return new EventSource(
    `https://cms.chtoma.com/api/message/subscribe?userId=${userId}`,
    {
      withCredentials: true,
    }
  );
};

export const getWorld = async () => {
  return await axios.get(
    "https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json"
  );
};
