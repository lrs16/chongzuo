import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Radio, Spin } from 'antd';

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};

const SelectUser = props => {
  const { children, dispatch, handleSubmit, usermanage, userloading, changorder } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const users = usermanage.data.rows;

  const [value, setValue] = useState('');

  const handleChange = e => {
    setValue(e.target.value);
    sessionStorage.setItem('NextflowUserId', e.target.value);
  };

  useEffect(() => {
    sessionStorage.setItem('NextflowUserId', value);
  }, []);

  useEffect(() => {
    if (changorder !== undefined) {
      sessionStorage.setItem('Nextflowtype', '处理');
    }
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
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
  };

  const handleOk = () => {
    handleSubmit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const nextflowuser = changorder === '转单' ? '处理' : sessionStorage.getItem('Nextflowtype');

  return (
    <>
      {withClick(children, showModal)}
      <Modal
        title={`请选择${nextflowuser}人`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Spin tip="正在加载数据..." spinning={Boolean(userloading)}>
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

SelectUser.defaultProps = { pangekey: '0' };

export default connect(({ usermanage, loading }) => ({
  usermanage,
  userloading: loading.effects['usermanage/search'],
  loading: loading.models.demandregister,
}))(SelectUser);
