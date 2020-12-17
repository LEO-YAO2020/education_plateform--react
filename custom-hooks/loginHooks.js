import Router from "next/router";
import { useEffect } from "react";

export const useLoginType = () => {
  useEffect(() => {
    if (!!localStorage.getItem("loginType")) {
      let type = localStorage.getItem("loginType");

      type = type.substr(1, type.length - 2);
      Router.push(`/dashboard/${type}`, undefined, { shallow: true });
    }
    if (!localStorage.getItem("token")) {
      Router.push("/login", undefined, { shallow: true });
    }
  }, []);
};
