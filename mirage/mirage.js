import { belongsTo, createServer, hasMany, Model, Response } from "miragejs";
import { message } from "antd";
import { basePath, creatUrl, subPath } from "../api/urlService";
import Students from "../data/student.json";
import Users from "../data/user.json";
import courses from "../data/course.json";
import courseTypes from "../data/course_type.json";
import studentCourses from "../data/student_course.json";
import studentTypes from "../data/student_type.json";
import { format } from "date-fns";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      studentType: Model,
      student: Model.extend({
        studentCourses: hasMany(),
        type: belongsTo("studentType"),
      }),
      courseType: Model,
      course: Model,
      studentCourse: Model.extend({
        course: belongsTo(),
      }),
    },

    seeds(server) {
      Users.forEach((element) => {
        server.create("user", element);
      });
      courseTypes.forEach((element) => {
        server.create("courseType", element);
      });
      courses.forEach((element) => {
        server.create("course", element);
      });
      studentCourses.forEach((element) => {
        server.create("studentCourse", element);
      });
      studentTypes.forEach((element) => {
        server.create("studentType", element);
      });
      Students.forEach((element) => {
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
              data: {
                token:
                  Math.random().toString(32).split(".")[1] + "-" + type.type,
                loginType: type.type,
              },
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
        return new Response(
          200,
          {},
          { code: 200, msg: "Successful Logout ", data: true }
        );
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
          data = { ...data, paginator: { limit, page, total } };
        }

        students = students.map((student) => {
          const studentCourses = student.studentCourses;

          let courses = [];
          if (studentCourses.length > 0) {
            studentCourses.models.map((model) => {
              const name = model.course.name;
              // return { name, id: +model.id };
              courses.push({ name, id: +model.id });
            });
          }
          student.attrs.courses = courses;
          student.attrs.typeName = student.type.name;

          return student;
        });
        return new Response(
          200,
          {},
          { data: { ...data, students }, msg: "success", code: 200 }
        );
      });

      this.post(
        creatUrl([basePath.student, subPath.add]),
        (schema, request) => {
          const studentDetail = JSON.parse(request.requestBody);
          const { area, email, name, typeId } = studentDetail;
          const data = schema.students.create({
            area,
            email,
            name,
            typeId: typeId,
            ctime: format(new Date(), "yyyy/MM/dd hh:mm:ss"),
          });

          data.attrs.typeName = data.type.name;

          return new Response(
            200,
            {},
            {
              code: 200,
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
          const { name, email, area, type, id } = studentDetail;
          const res = schema.students.findBy({ id });

          if (res) {
            const data = res.update({
              name,
              email,
              area,
              typeId: type,
              updateAt: format(new Date(), "yyyy/MM/dd hh:mm:ss"),
            });

            data.attrs.typeName = data.type.name;

            return new Response(
              200,
              {},
              {
                code: 200,
                msg: "success",
                data,
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
