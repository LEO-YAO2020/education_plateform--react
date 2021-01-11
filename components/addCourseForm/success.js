import React from "react";
import { Result, Button } from "antd";
import router from "next/router";

const success = () => {
  return (
    <>
      <Result
        status="success"
        title="Successfully Create Course"
        extra={[
          <Button type="primary" key="detail" onClick={() => router.push()}>
            Go Course
          </Button>,
          <Button key="again" onClick={() => router.reload()}>
            Create Again
          </Button>,
        ]}
      />
    </>
  );
};

export default success;
