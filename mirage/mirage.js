import { createServer, Model, Response } from "miragejs";
import { message } from "antd";
import { basePath } from "../api/urlService";
import Student from "../data/student.json";
import User from "../data/user.json";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      student: Model,
    },

    seeds(server) {
      User.forEach((element) => {
        server.create("user", element);
      });

      Student.forEach((element) => {
        server.create("student", element);
      });
    },

    routes() {
      this.passthrough((request) => {
        if (request.url === "/_next/static/development/_devPagesManifest.json")
          return true;
      });
      this.namespace = "api";

      this.post(basePath.login, (schema, request) => {
        let type = JSON.parse(request.requestBody);

        const user = schema.users.where({
          email: type.email,
          password: type.password,
          type: type.type,
        });

        if (user.length === 1) {
          const token = type.email;

          return new Response(
            200,
            {},
            {
              data: { token: token, loginType: type.type },
              msg: "login successful",
            }
          );
        } else {
          return new Response(
            400,
            {},
            message.error("Login failed! Please check you email and password!")
          );
        }
      });

      this.post(basePath.logout, (schema, request) => {
        const token = JSON.parse(request.requestBody);

        const user = schema.users.where({
          email: token.type,
        });

        if (user.length === 1) {
          return new Response(
            200,
            {},
            { code: 200, msg: "Successful Logout ", data: true }
          );
        } else {
          return new Response(
            400,
            {},
            { code: 400, msg: "Fail Logout", data: false }
          );
        }
      });

      this.get(basePath.student, (schema, request) => {
        if (Object.keys(request.queryParams).length != 0) {
          console.log(Object.keys(request.queryParams).length);
        } else {
          return schema.students.all();
        }
        return schema.students.all();
      });
    },
  });

  return server;
}
