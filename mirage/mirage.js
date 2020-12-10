import { belongsTo, createServer, hasMany, Model, Response } from "miragejs";
import { message } from "antd";
import { basePath, creatUrl, subPath } from "../api/urlService";
import Student from "../data/student.json";
import User from "../data/user.json";
import course from "../data/course.json";
import courseType from "../data/course_type.json";
import studentCourse from "../data/student_course.json";
import studentType from "../data/student_type.json";
import { format } from "date-fns";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      student: Model.extend({
        studentType: hasMany(),
        typeid: belongsTo(),
      }),
      course: Model,
      courseType: Model,
      studentCourse: Model.extend({
        course: belongsTo(),
      }),
      studentType: Model,
    },

    seeds(server) {
      User.forEach((element) => {
        server.create("user", element);
      });

      Student.forEach((element) => {
        server.create("student", element);
      });
      course.forEach((element) => {
        server.create("course", element);
      });
      courseType.forEach((element) => {
        server.create("courseType", element);
      });
      studentCourse.forEach((element) => {
        server.create("studentCourse", element);
      });
      studentType.forEach((element) => {
        server.create("studentType", element);
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
        const all = schema.students.all();
        let students = all.filter((item) => !query || item.name.includes(query))
          .models;

        const total = !query ? all.length : students.length;

        let data = { total, students };

        if (limit && page) {
          const start = limit * (page - 1);

          students = students.slice(start, start + limit);
          data = { ...data, paginator: { limit, page, total }, students };
        }
        return new Response(200, {}, { data, msg: "success", code: 200 });
      });

      this.post(
        creatUrl([basePath.student, subPath.add]),
        (schema, request) => {
          const studentDetail = JSON.parse(request.requestBody);

          const { area, email, name, typeId } = studentDetail;
          console.log(studentDetail);
          const data = schema.students.create({
            area,
            email,
            name,
            typeId,
            ctime: format(new Date(), "yyyy/MM/dd hh:mm:ss"),
            updateAt: format(new Date(), "yyyy/MM/dd hh:mm:ss"),
          });
          console.log(schema.students.all());
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: "success",
              data: data,
            }
          );
        }
      );

      this.post(
        creatUrl([basePath.student, subPath.update]),
        (schema, request) => {
          const studentDetail = JSON.parse(request.requestBody);
          console.log(studentDetail);
          const { name, email, area, typeId, id } = studentDetail;
          console.log(id);
          const res = schema.students.findBy({ id });
          console.log(res);
          if (res) {
            const data = res.update({
              name,
              email,
              area,
              typeId,
              updateAt: format(new Date(), "yyyy/MM/dd hh:mm:ss"),
            });
            return new Response(
              200,
              {},
              {
                code: 0,
                msg: "success",
                data: data,
              }
            );
          } else {
            return new Response(
              400,
              {},
              {
                code: 400,
                msg: "Fail can not find this element",
              }
            );
          }
        }
      );

      this.delete(
        creatUrl([basePath.student, subPath.delete]),
        (schema, request) => {
          const studentDetail = request.queryParams.id;
          console.log(studentDetail);
          schema.students.find(studentDetail).destroy();
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: "success",
              data: true,
            }
          );
        }
      );
    },
  });

  return server;
}
