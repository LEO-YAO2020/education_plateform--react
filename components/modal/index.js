import { Modal, Form } from "antd";
import React, { useState } from "react";

const SetEditStudent = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const handleOk = () => {
    setModalVisible(false);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };
  return (
    <Modal
      title="Edit Student"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form></Form>
    </Modal>
  );
};
