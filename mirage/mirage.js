import { belongsTo, createServer, hasMany, Model, Response } from "miragejs";
import { message } from "antd";
import { basePath, creatUrl, subPath } from "../api/urlService";
import Students from "../data/student.json";
import Users from "../data/user.json";
import courses from "../data/course.json";
import courseTypes from "../data/course_type.json";
import studentCourses from "../data/student_course.json";
import studentTypes from "../data/student_type.json";
import studentProfile from "../data/student_profile.json";
import teachers from "../data/teacher.json";
import teacherProfile from "../data/teacher_profile.json";
import sales from "../data/sales.json";
import schedules from "../data/schedule.json";
import { format, sub } from "date-fns";

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
      teacherProfile: Model,
      teacher: Model.extend({
        profile: belongsTo("teacherProfile"),
      }),
      courseType: Model,
      sale: Model,
      schedule: Model,
      course: Model.extend({
        type: belongsTo("courseType"),
        teacher: belongsTo("teacher"),
        sales: belongsTo("sale"),
        schedule: belongsTo("schedule"),
      }),
      studentCourse: Model.extend({
        course: belongsTo(),
      }),
      studentProfile: Model.extend({
        studentCourses: hasMany(),
        type: belongsTo("studentType"),
      }),
    },

    seeds(server) {
      Users.forEach((element) => {
        server.create("user", element);
      });
      teacherProfile.forEach((element) => {
        server.create("teacherProfile", element);
      });
      teachers.forEach((element) => {
        server.create("teacher", element);
      });
      courseTypes.forEach((element) => {
        server.create("courseType", element);
      });
      sales.forEach((element) => {
        server.create("sale", element);
      });
      schedules.forEach((element) => {
        server.create("schedule", element);
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
      studentProfile.forEach((element) => {
        server.create("studentProfile", element);
      });
    },

    routes() {
      this.passthrough((request) => {
        if (
          request.url === "/_next/static/development/_devPagesManifest.json" ||
          request.url.includes("www.mocky.io")
        )
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

      this.post(basePath.logout, () => {
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
              code: 200,
              msg: "success",
              data: true,
            }
          );
        }
      );

      this.get("/student", (schema, request) => {
        const id = request.queryParams.id;
        let student = schema.studentProfiles.findBy({ id: id });
        const studentCourses = student.studentCourses;

        let courses = [];

        if (studentCourses.length > 0) {
          studentCourses.models.map((model) => {
            const name = model.course.name;
            const typeName = model.course.type.name;
            const ctime = model.ctime;
            courses.push({ ctime, typeName, name, id: +model.id });
          });
        }

        student.attrs.courses = courses;
        student.attrs.typeName = student.type.name;

        if (student) {
          return new Response(
            200,
            {},
            {
              code: 200,
              data: student,
            }
          );
        } else {
          return new Response(
            400,
            {},
            {
              code: 400,
              msg: "Fail",
            }
          );
        }
      });

      this.get(basePath.courses, (schema, request) => {
        const { limit, page, name, code, type } = request.queryParams;
        let courses = schema.courses.all().models;

        if (!!name) {
          courses = courses.filter((item) =>
            item.name.toLowerCase().includes(name.toLowerCase())
          );
        }
        if (!!code) {
          courses = courses.filter((item) =>
            item.uid.toLowerCase().includes(code.toLowerCase())
          );
          console.log(courses);
        }

        if (!!type) {
          console.log(courses);
          courses = courses.filter((item) =>
            item.type.name.toLowerCase().includes(type.toLowerCase())
          );
        }

        courses.map((item) => {
          item.attrs.teacher = item.teacher.name;
          item.attrs.type = item.type.name;
        });

        const length = courses.length;

        if (limit && page) {
          courses = courses.slice(limit * (page - 1), page * limit);
        }

        if (courses) {
          return new Response(
            200,
            {},
            {
              code: 200,
              courses,
              length,
            }
          );
        } else {
          return new Response(
            500,
            {},
            {
              code: 500,
              msg: "Fail",
            }
          );
        }
      });

      this.get(basePath.course, (schema, request) => {
        const id = request.queryParams;
        let course = schema.courses.findBy(id);

        course.attrs.sales = course.sales.attrs;
        course.attrs.schedule = course.schedule.attrs;
        course.attrs.teacher = course.teacher.name;
        course.attrs.type = course.type.name;

        console.log(course);

        if (course) {
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: "success",
              course,
            }
          );
        } else {
          return new Response(
            500,
            {},
            {
              code: 500,
              msg: "Fail",
            }
          );
        }
      });

      this.get(creatUrl([basePath.course, subPath.code]), (schema, request) => {
        const data = Math.random().toString(32).split(".")[1];

        return new Response(
          200,
          {},
          {
            code: 0,
            msg: "success",
            data,
          }
        );
      });

      this.get(basePath.teachers, (schema, request) => {
        const teachers = schema.teachers.all();

        if (teachers) {
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: "success",
              teachers,
            }
          );
        } else {
          return new Response(
            500,
            {},
            {
              code: 500,
              msg: "Fail",
            }
          );
        }
      });

      this.get(creatUrl([basePath.course, subPath.type]), (schema, request) => {
        const { value } = request.queryParams;
        const courseType = schema.courseTypes.all();

        if (courseType) {
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: "success",
              courseType,
            }
          );
        } else {
          return new Response(
            500,
            {},
            {
              code: 500,
              msg: "Fail",
            }
          );
        }
      });

      this.get(basePath.teachers, (schema, request) => {
        const { value, id } = request.queryParams;
        let teachers;

        const all = schema.teachers.all().models;
        teachers = all.filter(
          (item) =>
            !value ||
            item.name.toLowerCase().includes(value.toLocaleLowerCase())
        );

        return new Response(
          200,
          {},
          {
            code: 0,
            msg: "success",
            teachers,
          }
        );

        //   const limit = request.queryParams.limit;
        //   const page = request.queryParams.page;
        //   let query = request.queryParams.query;
        //   const all = schema.students.all();
        //   let students = all.filter((item) => !query || item.name.includes(query))
        //     .models;
        //   const total = !query ? all.length : students.length;
        //   let data = { total, students };

        //   if (limit && page) {
        //     const start = limit * (page - 1);

        //     students = students.slice(start, start + limit);
        //     data = { ...data, paginator: { limit, page, total } };
        //   }

        //   students = students.map((student) => {
        //     const studentCourses = student.studentCourses;

        //     let courses = [];
        //     if (studentCourses.length > 0) {
        //       studentCourses.models.map((model) => {
        //         const name = model.course.name;
        //         courses.push({ name, id: +model.id });
        //       });
        //     }

        //     student.attrs.courses = courses;
        //     student.attrs.typeName = student.type.name;

        //     return student;
        //   });
        //   return new Response(
        //     200,
        //     {},
        //     { data: { ...data, students }, msg: "success", code: 200 }
        //   );
        // });
      });

      this.post(
        creatUrl([basePath.courses, subPath.add]),
        (schema, request) => {
          const body = JSON.parse(request.requestBody);
          const {
            name,
            uid,
            cover,
            detail,
            duration,
            maxStudents,
            price,
            startTime,
            typeId,
            durationUnit,
            teacherId,
          } = body;

          const schedule = schema.schedules.create({
            status: 0,
            current: 0,
            classTime: null,
            chapters: null,
          });

          const sales = schema.sales.create({
            batches: 0,
            price,
            earnings: 0,
            paidAmount: 0,
            studentAmount: 0,
            paidIds: [],
          });

          const data = schema.db.courses.insert({
            name,
            uid,
            detail,
            startTime,
            price,
            maxStudents,
            sales,
            schedule,
            star: 0,
            status: 0,
            duration,
            durationUnit,
            cover,
            teacherId,
            typeId,
            ctime: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
          });

          data.type = schema.courseTypes.findBy({ id: +typeId }).name;
          data.scheduleId = +schedule.id;

          if (data) {
            return new Response(
              200,
              {},
              {
                code: 0,
                msg: "success",
                data,
              }
            );
          } else {
            return new Response(
              404,
              {},
              {
                code: 404,
                msg: "fail",
              }
            );
          }
        }
      );

      this.post(creatUrl([basePath.courses, subPath.update]), (schema, req) => {
        const { id, ...others } = JSON.parse(req.requestBody);
        console.log(id);
        const target = schema.courses.findBy({ id });

        if (target) {
          const data = target.update({
            ...others,
          });

          data.attrs.typeName = data.type.name;

          return new Response(200, {}, { msg: "success", code: 200, data });
        } else {
          return new Response(
            400,
            {},
            { msg: `can\'t find course by id ${id} `, code: 400 }
          );
        }
      });

      this.post("/courses/schedule", (schema, req) => {
        const body = JSON.parse(req.requestBody);
        const { scheduleId, courseId } = body;
        let target;

        if (!!scheduleId || !!courseId) {
          if (scheduleId) {
            target = schema.schedules.findBy({ id: scheduleId });
          } else {
            target = schema.courses.findBy({ id: courseId }).schedule;
          }
          const { classTime, chapters } = body;

          target.update({
            current: 0,
            status: 0,
            chapters: chapters.map((item, index) => ({ ...item, id: index })),
            classTime,
          });

          return new Response(
            200,
            {},
            { msg: "success", code: 200, data: true }
          );
        } else {
          return new Response(
            400,
            {},
            {
              msg: `can\'t find process by course ${courseId} or processId ${processId} `,
              code: 400,
            }
          );
        }
      });
    },
  });

  return server;
}
