import { belongsTo, createServer, hasMany, Model, Response } from "miragejs";
import { message } from "antd";
import { basePath, creatUrl, subPath } from "../api/urlService";
import students from "../data/student.json";
import users from "../data/user.json";
import courses from "../data/course.json";
import courseTypes from "../data/course_type.json";
import studentCourses from "../data/student_course.json";
import studentTypes from "../data/student_type.json";
import studentProfile from "../data/student-profile.json";
import teachers from "../data/teacher.json";
import teacherProfile from "../data/teacher_profile.json";
import sales from "../data/sales.json";
import schedules from "../data/schedule.json";
import { format, formatDistance, subMonths } from "date-fns";

import { countBy, groupBy, intersection, uniq } from "lodash";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      studentType: Model,

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

      student: Model.extend({
        studentCourses: hasMany(),
        type: belongsTo("studentType"),
        profile: belongsTo("studentProfile"),
      }),
    },

    seeds(server) {
      users.forEach((element) => {
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
      studentProfile.forEach((element) => {
        server.create("studentProfile", element);
      });
      students.forEach((element) => {
        server.create("student", element);
      });
    },

    routes() {
      this.passthrough((request) => {
        if (
          request.url === "/_next/static/development/_devPagesManifest.json" ||
          request.url.includes("www.mocky.io") ||
          request.url.includes("code.highcharts.com") ||
          request.url.includes("cms.chtoma.com")
        )
          return true;
      });
      this.namespace = "api";

      this.post(basePath.login, (schema, request) => {
        let type = JSON.parse(request.requestBody);

        const user = schema.users.where({
          email: type.email,
          password: "123456",
          type: type.type,
        });

        if (user.length === 1) {
          return new Response(
            200,
            {},
            {
              code: 0,
              data: {
                token:
                  Math.random().toString(32).split(".")[1] + "~" + type.type,
                loginType: type.type,
                userId: +user.models[0].id,
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
        const { query, userId } = request.queryParams;
        const permission = getPermission();
        const limit = +request.queryParams.limit;
        const page = +request.queryParams.page;
        const all = schema.students.all();
        const getResult = (students, total) => {
          students = students.slice(limit * (page - 1), limit * page);
          students = students.map((student) => {
            const studentCourses = student.studentCourses;
            let courses = [];

            if (studentCourses.length) {
              courses = studentCourses.models.map((model) => {
                const name = model.course.name;

                return { name, id: +model.id, courseId: model.course.id };
              });
            }

            student.attrs.courses = courses;
            student.attrs.typeName = student.type.name;
            return student;
          });

          return { total, paginator: { limit, page, total }, students };
        };
        let data = null;

        if (permission === 9) {
          let students = all.filter(
            (item) => !query || item.name.includes(query)
          ).models;
          const total = !query ? all.length : students.length;

          data = getResult(students, total);
        } else if (permission === 2) {
          const user = schema.users.find(userId);
          const teacher = schema.teachers.findBy({ email: user.attrs.email });

          const courses = schema.courses
            .all()
            .filter((item) => item.teacherId === +teacher.attrs.id).models;
          const courseIds = courses.map((item) => +item.id);
          console.log(all);
          const studentsBelongTeacher = all.models
            .map((item) => {
              const ids = intersection(
                item.studentCourses.models.map((item) => item.attrs.courseId),
                courseIds
              );

              // omit the courses does not belong to the teacher
              item.studentCourses = item.studentCourses.filter((item) =>
                ids.includes(+item.courseId)
              );

              return item.studentCourses.length ? item : null;
            })
            .filter((item) => !!item);
          const students = studentsBelongTeacher.filter(
            (item) => !query || item.name.includes(query)
          );
          const total = !query ? studentsBelongTeacher.length : students.length;

          data = getResult(students, total);
        } else if (permission === 1) {
          return new Response(
            403,
            {},
            { msg: "Permission denied", code: 403, data: null }
          );
        }

        return new Response(200, {}, { data, msg: "success", code: 200 });
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
        const permission = getPermission();
        const { limit, page, userId, ...others } = request.queryParams;

        const conditions = Object.entries(others).filter(
          ([key, value]) => !!value && key !== "own"
        );

        const filterData = (courses, sourceKey) => {
          if (page && limit) {
            courses = courses.slice((page - 1) * limit, page * limit);
          }
          if (conditions.length) {
            courses = courses.filter((item) =>
              conditions.every(([key, value]) => {
                item = sourceKey ? item[sourceKey] : item;
                if (key === "name") {
                  return item.name.includes(value);
                } else if (key === "type") {
                  return item.type.name === value;
                } else {
                  return item[key] === value;
                }
              })
            );
          }

          return courses;
        };
        const getAllCourses = () => {
          let courses = schema.courses.all().models;
          const total = courses.length;

          courses = filterData(courses);

          courses.forEach((item) => {
            item.attrs.teacher = item.teacher.name;
            item.attrs.type = item.type.name;
          });

          return { courses, total };
        };

        const getStudentOwnCourses = () => {
          const user = schema.users.find(userId);

          let courses = schema.students
            .findBy({ email: user.attrs.email })
            .studentCourses.models.map((item) => {
              item.attrs.course = item.course;
              item.attrs.course.attrs.type = item.course.type.name;

              return item;
            });

          return {
            total: courses.length,
            courses: filterData(courses, "course"),
          };
        };

        if (userId === 2) {
          courses = getStudentOwnCourses();
        }

        let data = null;

        if (permission === 1) {
          const { own } = request.queryParams;

          data = own ? getStudentOwnCourses() : getAllCourses();
        }

        if (permission === 2) {
          const user = schema.users.find(userId);
          const teacher = schema.teachers.findBy({ email: user.email });
          const courses = schema.courses.where({ teacherId: teacher.id })
            .models;

          courses.forEach((item) => {
            item.attrs.teacher = item.teacher.name;
            item.attrs.type = item.type.name;
          });

          data = { total: courses.length, courses: filterData(courses) };
        }

        if (permission === 9) {
          data = getAllCourses();
        }

        if (data) {
          return new Response(200, {}, { msg: "success", code: 200, data });
        } else {
          return new Response(500, {}, { msg: "server error", code: 500 });
        }
      });

      this.get(basePath.course, (schema, request) => {
        const { id } = request.queryParams;
        let course = schema.courses.findBy({ id });

        course.attrs.sales = course.sales.attrs;
        course.attrs.schedule = course.schedule.attrs;
        course.attrs.teacher = course.teacher.name;
        course.attrs.type = course.type.name;

        if (!!course) {
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
            400,
            {},
            {
              code: 400,
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

      this.delete(
        creatUrl([basePath.course, subPath.delete]),
        (schema, request) => {
          const courseDetail = request.queryParams.id;
          schema.courses.find(courseDetail).destroy();

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

      this.get("/class/schedule", (schema, request) => {
        const { userId } = request.queryParams;
        const data = schema.users.findBy({ id: userId });
        console.log(data);
        return new Response(
          200,
          {},
          {
            code: 0,
            msg: "success",
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

      this.get(
        creatUrl([basePath.statistics, subPath.overview]),
        (schema, req) => {
          const courses = schema.courses.all().models;
          const teachers = schema.teachers.all().models;
          const students = schema.students.all().models;

          const courseTotal = courses.length;
          const studentTotal = students.length;
          const teacherTotal = teachers.length;
          const lastMonthAddedCourses = courses.filter(
            (item) => new Date(item.attrs.ctime) >= subMonths(new Date(), 1)
          ).length;
          const lastMonthAddedStudents = students.filter(
            (item) => new Date(item.attrs.ctime) >= subMonths(new Date(), 1)
          ).length;
          const lastMonthAddedTeachers = teachers.filter(
            (item) => new Date(item.attrs.ctime) >= subMonths(new Date(), 1)
          ).length;
          const studentMaleAmount = genderAmount(students, "male");
          const studentFemaleAmount = genderAmount(students, "female");
          const studentUnknownAmount = genderAmount(students, "unknown");

          const teacherMaleAmount = genderAmount(teachers, "male");
          const teacherFemaleAmount = genderAmount(teachers, "female");
          const teacherUnknownAmount = genderAmount(teachers, "unknown");

          return new Response(
            200,
            {},
            {
              msg: "success",
              code: 200,
              data: {
                student: {
                  total: studentTotal,
                  lastMonthAdded: lastMonthAddedStudents,
                  gender: {
                    male: studentMaleAmount.length,
                    female: studentFemaleAmount.length,
                    unknown: studentUnknownAmount.length,
                  },
                },
                teacher: {
                  total: teacherTotal,
                  lastMonthAdded: lastMonthAddedTeachers,
                  gender: {
                    male: teacherMaleAmount.length,
                    female: teacherFemaleAmount.length,
                    unknown: teacherUnknownAmount.length,
                  },
                },
                course: {
                  total: courseTotal,
                  lastMonthAdded: lastMonthAddedCourses,
                },
              },
            }
          );
        }
      );

      this.get(
        creatUrl([basePath.statistics, subPath.student]),
        (schema, req) => {
          //const userId = req.queryParams;
          const students = schema.students.all().models;
          const data = [];
          const typeNameData = [];
          const courseData = [];
          const ctimeData = [];
          const interestData = [];
          const typeName = [];
          const country = [];
          const courses = [];
          const ctime = [];
          const interest = [];

          students.map((item) => {
            data.push(item.area);
            typeNameData.push(item.type.attrs.name);
            ctimeData.push(item.ctime.slice(0, 7));
            item.studentCourses.models.map((courseName) => {
              courseData.push(courseName.course.name);
            });
            item.profile.interest.map((item) => {
              interestData.push(item);
            });
          });

          data.sort();
          typeNameData.sort();
          courseData.sort();
          ctimeData.sort();
          interestData.sort();

          sortData(data, country);
          sortData(typeNameData, typeName);
          sortData(courseData, courses);
          sortData(ctimeData, ctime);
          sortData(interestData, interest);

          return new Response(
            200,
            {},
            {
              msg: "success",
              code: 200,
              data: {
                country,
                typeName,
                courses,
                ctime,
                interest,
              },
            }
          );
        }
      );

      this.get(
        creatUrl([basePath.statistics, subPath.teacher]),
        (schema, req) => {
          const teachers = schema.teachers.all().models;

          const countryData = [];
          const country = [];
          const skillsData = [];
          let skills = [];
          const ctime = [];
          const ctimeData = [];
          const workExperienceData = [];
          const workExperience = [];
          teachers.map((item) => {
            workExperienceData.push(item.profile.workExperience);

            countryData.push(item.country);
            ctimeData.push(item.ctime.slice(0, 7));
            item.skills.map((skill) => {
              skillsData.push(skill);
            });
          });

          countryData.sort();
          skillsData.sort(down);
          ctimeData.sort(down);

          sortData(countryData, country);
          sortJsonData(skillsData, skills);
          sortData(ctimeData, ctime);

          skills = skills.reduce((acc, cur) => {
            const { name, level } = cur;
            if (acc.hasOwnProperty(name)) {
              const target = acc[name].find((item) => item.level === level);

              if (target) {
                target.amount = target.amount + 1;
              } else {
                acc[name].push({ name: "level", level, amount: 1 });
              }
            } else {
              acc[name] = [{ name: "level", level, amount: 1 }];
            }
            return acc;
          }, {});

          workExperienceData.map((item) => {
            workExperience.push(getDuration(item));
          });

          return new Response(
            200,
            {},
            {
              msg: "success",
              code: 200,
              data: {
                country,
                skills,
                ctime,
                workExperience,
              },
            }
          );
        }
      );
      this.get(
        creatUrl([basePath.statistics, subPath.course]),
        (schema, req) => {
          const courses = schema.courses.all().models;

          const typeNameData = [];
          const typeName = [];
          const ctime = [];
          const ctimeData = [];
          courses.map((item) => {
            typeNameData.push(item.type.name);
            ctimeData.push(item.ctime.slice(0, 7));
          });
          const classTime = Object.entries(
            groupBy(
              courses.map((course) => {
                const classTime = course.schedule.classTime;
                const typeName = course.type.name;

                return { classTime, typeName, name: course.name };
              }),
              (item) => item.typeName
            )
          ).map(([key, value]) => ({
            name: key,
            amount: value.length,
            courses: value,
          }));
          typeNameData.sort();
          ctimeData.sort();

          sortData(typeNameData, typeName);
          sortData(ctimeData, ctime);

          return new Response(
            200,
            {},
            {
              msg: "success",
              code: 200,
              data: {
                typeName,
                ctime,
                classTime,
              },
            }
          );
        }
      );
    },
  });

  return server;

  function down(x, y) {
    return x.name < y.name ? 1 : -1;
  }

  function sortJsonData(data, arr) {
    let i = 0;
    while (i < data.length) {
      let count = 0;
      for (let j = i; j < data.length; j++) {
        if (data[i].name === data[j].name && data[i].level === data[j].level) {
          count++;
        }
      }

      arr.push({
        name: data[i].name,
        level: data[i].level,
        amount: count,
      });

      i += count;
    }
  }

  function sortData(data, arr) {
    let i = 0;
    while (i < data.length) {
      let count = 0;
      for (let j = i; j < data.length; j++) {
        if (data[i] === data[j]) {
          count++;
        }
      }
      arr.push({
        name: data[i],
        amount: count,
      });
      i += count;
    }
  }

  function getDuration(data, key = "startEnd") {
    const dates = data.map((item) => item[key].split(" ")).flat();
    const { max, min } = dates.reduce(
      (acc, cur) => {
        const date = new Date(cur).getTime();
        const { max, min } = acc;

        return { max: date > max ? date : max, min: date < min ? date : min };
      },
      { max: new Date().getTime(), min: new Date().getTime() }
    );

    return formatDistance(new Date(min), new Date(max));
  }

  function getPermission() {
    let permission = localStorage.getItem("loginType");
    permission = permission.substr(1, permission.length - 2);
    switch (permission) {
      case "student":
        return 1;
      case "teacher":
        return 2;
      case "manager":
        return 9;
      default:
        return 0;
    }
  }

  function genderAmount(data, gender) {
    if (gender === "male") {
      return data.filter((item) => item.profile.attrs.gender === 1);
    } else if (gender === "female") {
      return data.filter((item) => item.profile.attrs.gender === 2);
    } else {
      return data.filter(
        (item) =>
          item.profile.attrs.gender != 2 && item.profile.attrs.gender != 1
      );
    }
  }
}
