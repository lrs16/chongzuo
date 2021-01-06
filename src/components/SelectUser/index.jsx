import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Radio, Spin, Checkbox } from 'antd';

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};

const SelectUser = props => {
  const { children, dispatch, handleSubmit, userlist, loading, changorder, taskId } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const type = sessionStorage.getItem('Processtype');

  const dataArr = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.label = datas[i].userName;
      vote.value = datas[i].userId;
      newArr.push(vote);
    }

    return newArr;
  };

  const [value, setValue] = useState('');

  // 单选下一环节人员
  // const handleChange = e => {
  //   setValue(e.target.value);
  //   sessionStorage.setItem('NextflowUserId', e.target.value);
  // };
  // 多选下一环节人员
  const handleChange = checkedValues => {
    setValue(checkedValues);
    sessionStorage.setItem('NextflowUserId', checkedValues.join(','));
  };

  useEffect(() => {
    sessionStorage.setItem('NextflowUserId', value);
  }, []);

  useEffect(() => {
    if (changorder !== undefined) {
      sessionStorage.setItem('Nextflowmane', '处理');
    }
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
    switch (type) {
      case 'event':
      case 'demand':
        dispatch({
          type: 'itsmuser/eventuserlist',
          payload: {
            taskId,
            type: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      case 'problem':
        dispatch({
          type: 'itsmuser/problemuserlist',
          payload: {
            taskId,
            type: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      case 'troub':
        dispatch({
          type: 'itsmuser/troubleuserlist',
          payload: {
            taskId,
            type: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      default:
        break;
    }
  };

  const handleOk = () => {
    handleSubmit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const nextflowuser = changorder === '转单' ? '处理' : sessionStorage.getItem('Nextflowmane');

  return (
    <>
      {withClick(children, showModal)}
      <Modal
        title={`请选择${nextflowuser}人`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Spin tip="正在加载数据..." spinning={Boolean(loading)}>
          {loading === false && (
            <>
              {/* <Radio.Group onChange={handleChange} value={value}>
                {userlist.map((obj) => {
                  return (
                    <Radio key={obj.userId} value={obj.userId}>
                      {obj.userName}
                    </Radio>
                  )
                })}
              </Radio.Group> */}
              <Checkbox.Group options={dataArr(userlist)} onChange={handleChange} />
            </>
          )}
        </Spin>
      </Modal>
    </>
  );
};

SelectUser.defaultProps = { pangekey: '0' };

export default connect(({ itsmuser, loading }) => ({
  userlist: itsmuser.userlist,
  loading: loading.models.itsmuser,
}))(SelectUser);
