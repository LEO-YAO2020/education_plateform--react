import { createServer, Model } from "miragejs";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
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
    },

    routes() {
      this.namespace = "api";

      this.get("/users/:type", (schema, request) => {
        let type = request.params.type;
        switch (type) {
          case "student":
            return schema.users.find(1);
          case "teacher":
            return schema.users.find(2);
          case "manager":
            return schema.users.find(3);
        }
      });

      this.passthrough((request) => {
        if (request.url === "/_next/static/development/_devPagesManifest.json")
          return true;
      });
    },
  });

  return server;
}
