import { createServer, Model, Response } from "miragejs";
import Student from "../data/student.json";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      student: Model,
    },

    seeds(server) {
      server.create("user", {
        type: "student",
        email: "295577311@qq.com",
        password: 123456,
      });
      server.create("user", {
        type: "teacher",
        email: "2955773111@qq.com",
        password: 1234567,
      });
      server.create("user", {
        type: "manager",
        email: "29557731111@qq.com",
        password: 12345678,
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

      this.post("/users", (schema, request) => {
        let type = JSON.parse(request.requestBody);
        //const user = schema.users.all();
        const user = schema.users.where({
          email: type.email,
          password: type.password,
          type: type.type,
        });

        if (user.length === 1) {
          const token = type.email;

          return new Response(200, {}, { token: token, loginType: type.type });
        } else {
          return new Response(
            400,
            {},
            { error: "check out your email or type" }
          );
        }
      });

      this.get("/students", (schema) => {
        return schema.students.all();
      });
    },
  });

  return server;
}
