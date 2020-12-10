export const basePath = {
  login: "login",
  logout: "logout",
  student: "students",
};

export const subPath = {
  add: "add",
  update: "update",
  delete: "delete",
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