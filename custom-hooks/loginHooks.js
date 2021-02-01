import Router from "next/router";
import { useEffect } from "react";

export const useLoginType = () => {
  useEffect(() => {
    if (!!localStorage.getItem("loginType")) {
      let type = localStorage.getItem("loginType");
      // /^\"$/
      type = type.substr(1, type.length - 2);
      Router.push(`/dashboard/${type}`, undefined, { shallow: true });
    }
    if (!localStorage.getItem("token")) {
      Router.push("/login", undefined, { shallow: true });
    }
  }, []);
};
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbmFnZXJAYWRtaW4uY29tIiwicm9sZSI6Im1hbmFnZXIiLCJpZCI6MywiaWF0IjoxNjExODIxMjU0LCJleHAiOjE2MTk1OTcyNTR9.zntOZaqlm6f95TppNOT0yFByGQiU_VFbOh5DAQVvDBg
