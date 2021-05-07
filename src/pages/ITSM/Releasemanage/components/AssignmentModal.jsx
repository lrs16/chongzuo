import React from 'react';
import { Modal, Button } from 'antd';

function AssignmentModal(props) {
  const { visible, handleChange } = props;

  const handleOk = () => {
    handleChange(false)
  }

  return (
    <Modal
      title="分派"
      visible={visible}
      onOk={handleOk}
      onCancel={() => handleChange(false)}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}

export default AssignmentModal;