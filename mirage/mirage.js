import { createServer, Model, Response } from "miragejs";
import { message } from "antd";
import { basePath, creatUrl, subPath } from "../api/urlService";
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
              code: 0,
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
        const limit = request.queryParams.limit;
        const page = request.queryParams.page;
        let query = request.queryParams.query;

        let ids = [];
        if (typeof query == "undefined" || query == "") {
          if (limit <= Student.length) {
            ids.splice(0, ids.length);

            for (let i = 0; i < limit; i++) {
              ids.push(Student[i].id);
            }

            if (page != 1) {
              const size = Student.length - limit;

              if (size <= Student.length) {
                ids.splice(0, ids.length);

                for (let i = 0; i < size; i++) {
                  ids.push(Student[i].id);
                }
              } else {
                ids.splice(0, ids.length);

                for (let i = 0; i < limit; i++) {
                  ids.push(Student[i].id);
                }
              }
            }
          } else {
            ids.splice(0, ids.length);

            for (let i = 0; i < Student.length; i++) {
              ids.push(Student[i].id);
            }
          }

          return new Response(
            200,
            {},
            {
              code: 0,
              msg: "Success",
              data: schema.students.find(ids).models,
              paginator: {
                page: request.queryParams.page,
                limit: request.queryParams.limit,
                total: Student.length,
              },
            }
          );
        } else {
          if (query != "") {
            ids.splice(0, ids.length);
            query = query.toLowerCase();

            for (let i = 0; i < Student.length; i++) {
              if (Student[i].name.indexOf(query) >= 0) {
                ids.push(Student[i].id);
              }
            }
            // } else {
            //   if (limit <= Student.length) {
            //     ids.splice(0, ids.length);

            //     for (let i = 0; i < limit; i++) {
            //       ids.push(Student[i].id);
            //     }

            //     if (page != 1) {
            //       const size = Student.length - limit;

            //       if (size <= Student.length) {
            //         ids.splice(0, ids.length);

            //         for (let i = 0; i < size; i++) {
            //           ids.push(Student[i].id);
            //         }
            //       } else {
            //         ids.splice(0, ids.length);

            //         for (let i = 0; i < limit; i++) {
            //           ids.push(Student[i].id);
            //         }
            //       }
            //     }
            //   } else {
            //     ids.splice(0, ids.length);

            //     for (let i = 0; i < Student.length; i++) {
            //       ids.push(Student[i].id);
            //     }
            //   }
            // }
            return new Response(
              200,
              {},
              {
                code: 0,
                msg: "Success",
                data: schema.students.find(ids).models,
                paginator: {
                  page: request.queryParams.page,
                  limit: request.queryParams.limit,
                  total: schema.students.find(ids).models.length,
                },
              }
            );
          }
        }
      });

      this.post(
        creatUrl([basePath.student, subPath.add]),
        (schema, request) => {
          const studentDetail = JSON.parse(request.requestBody);
          console.log(studentDetail);
          schema.students.insert();
        }
      );

      this.post(
        creatUrl(basePath.student, subPath.update),
        (schema, request) => {
          const studentDetail = JSON.parse(request.requestBody);
          console.log(studentDetail);
          schema.students.update();
        }
      );

      this.delete(
        creatUrl(basePath.student, subPath.delete),
        (schema, request) => {
          const studentDetail = JSON.parse(request.requestBody);
          console.log(studentDetail);
          schema.students.remove();
        }
      );
    },
  });

  return server;
}
