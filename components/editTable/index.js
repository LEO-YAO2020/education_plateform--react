import React, { useState, useEffect } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Form, { useForm } from "antd/lib/form/Form";
import { Button } from "antd";

export default function editForm(props) {
  const [edit, setIsEdit] = useState(false);
  const isColumn = props.layout === "column";
  const [form] = useForm();

  return (
    <>
      {edit ? (
        <Form
          form={form}
          onFinish={(value) => {
            props.onSave(value);
            setIsEdit(false);
          }}
          onKeyDown={(event) => {
            if (props.allowEnterToSave && event.key === "Enter") {
              form.submit();
            }
          }}
          initialValues={props?.initialValues}
          style={{ width: "100%" }}
        >
          <div
            style={{
              display: isColumn ? "block" : "flex",
            }}
          >
            {props.children}
            {!props.hideControlBtn && (
              <div
                style={
                  isColumn ? { display: "flex", gap: 10, marginTop: 10 } : {}
                }
              >
                <Button
                  type={isColumn ? "default" : "link"}
                  danger={isColumn}
                  onClick={() => setIsEdit(false)}
                >
                  {isColumn ? (
                    "Cancel"
                  ) : (
                    <CloseOutlined style={{ color: "red" }} />
                  )}
                </Button>
                <Button htmlType="submit" type={isColumn ? "default" : "link"}>
                  {isColumn ? "Save" : <CheckOutlined />}
                </Button>
              </div>
            )}
          </div>
        </Form>
      ) : (
        <div
          onDoubleClick={() => setIsEdit(true)}
          style={props?.textContainerStyles}
        >
          {props.text}
        </div>
      )}
    </>
  );
}
