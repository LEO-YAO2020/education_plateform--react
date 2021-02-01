export const basePath = {
  login: "login",
  logout: "logout",
  student: "students",
  course: "course",
  courses: "courses",
  teachers: "teachers",
  statistics: "statistics",
};

export const subPath = {
  add: "add",
  update: "update",
  delete: "delete",
  code: "code",
  type: "type",
  overview: "overview",
  student: "student",
  teacher: "teacher",
  course: "course",
};

export const creatUrl = (path, params) => {
  const paths = typeof path == "string" ? path : path.join("/");
  let name = "";
  if (!!params) {
    name = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return `${paths}?${name}`;
  }
  return `${paths}`;
};
