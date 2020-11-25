import { Server, Model } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    // 环境变量
    environment,
    // 数据模型，描述数据结构，用于 Mirage 的 ORM
    // models: {
    //   todo: Model,
    // },
    // // 数据生成器
    // seeds(server) {
    //   server.create("Email", { content: "295577311@qq.com" });
    //   server.create("Password", { content: "123456" });
    // },
    // 路由处理
    routes() {
      this.namespace = "api";

      this.get("/login", (schema) => {
        return {
          login: [
            {
              Email: "295577311@qq.com",
              Password: "123456",
            },
          ],
        };
      });
      // 如果执行这个方法，其他没有匹配的请求路径不会拦截。适合只模拟部分接口的情况
      this.passthrough();
    },
  });

  return server;
}
