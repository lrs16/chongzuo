import React, { useState, useEffect } from 'react';
import { Modal, Radio } from 'antd';

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};

function index(props) {
  const { children, handleSubmit } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [value, setValue] = useState('1');

  const handleChange = e => {
    setValue(e.target.value);
    sessionStorage.setItem('NextflowUserId', e.target.value);
  };

  useEffect(() => {
    sessionStorage.setItem('NextflowUserId', value);
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleSubmit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {withClick(children, showModal)}
      <Modal
        title="请选择下一节点处理人"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Radio.Group onChange={handleChange} value={value}>
          <Radio value="1">管理员</Radio>
          <Radio value="1311225321495728129">user</Radio>
          <Radio value="1310135708685438978">elin</Radio>
        </Radio.Group>
      </Modal>
    </>
  );
}

export default index;
