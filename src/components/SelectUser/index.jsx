import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Radio, Spin } from 'antd';

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};

const SelectUser = props => {
  const { children, dispatch, handleSubmit, usermanage, userloading } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const users = usermanage.data.rows;

  const [value, setValue] = useState('1');

  const handleChange = e => {
    setValue(e.target.value);
    sessionStorage.setItem('NextflowUserId', e.target.value);
  };

  useEffect(() => {
    sessionStorage.setItem('NextflowUserId', value);
  }, []);

  useEffect(() => {
    dispatch({
      type: 'usermanage/search',
      payload: {
        payload: {
          page: 1,
          limit: 20,
          queKey: '',
        },
      },
    });
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
        <Spin tip="正在提交数据..." spinning={Boolean(userloading)}>
          {userloading === false && (
            <Radio.Group onChange={handleChange} value={value}>
              {users.map(({ id, userName }) => [
                <Radio key={id} value={id}>
                  {userName}
                </Radio>,
              ])}
            </Radio.Group>
          )}
        </Spin>
      </Modal>
    </>
  );
};

export default connect(({ usermanage, loading }) => ({
  usermanage,
  userloading: loading.effects['usermanage/search'],
  loading: loading.models.demandregister,
}))(SelectUser);
