import Router from "next/router";
import { useEffect } from "react";

export const useLoginType = () => {
  let type = localStorage.getItem("loginType");
  const token = localStorage.getItem("token");
  type = type.substr(1, type.length - 2);
  console.log(type);
  useEffect(() => {
    if (!!type) {
      Router.push(`/dashboard/${type}`);
    }
    if (!token) {
      Router.push("/login");
    }
  }, []);
};
