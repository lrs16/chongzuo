import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, message, Spin, Checkbox } from 'antd';

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => { }) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};

const SelectUser = props => {
  const { children, dispatch, handleSubmit, problemlist, loading, changorder, taskId } = props;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [defaultvalue, setDefaultvalue] = useState([]);
  const type = sessionStorage.getItem('Processtype');

  const dataArr = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      if (datas[i].id === undefined) {
        const vote = {};
        vote.label = datas[i].userName;
        vote.value = datas[i].userId;
        newArr.push(vote);
      } else {
        const vote = {};
        vote.label = datas[i].userName;
        vote.value = datas[i].id;
        newArr.push(vote);
      }
    }

    return newArr;
  };

  const [value, setValue] = useState([]);
  const [specialvalue, setSpecialvalue] = useState([]);

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

  const specialhandleChange = checkedValues => {
    setSpecialvalue(checkedValues);
    sessionStorage.setItem('AutoflowUserId', checkedValues.join(','));
  };

  useEffect(() => {
    if (changorder !== undefined && type === 'event') {
      sessionStorage.setItem('Nextflowmane', changorder);
      sessionStorage.setItem('flowtype', '3');
    }
  }, [changorder]);

  const showModal = () => {
    setIsModalVisible(true);
    switch (type) {
      case 'problem':
        dispatch({
          type: 'itsmuser/problemuserlist',
          payload: {
            taskId,
            result: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      default:
        break;
    }
  };

  const handleOk = () => {
    const params = value.length && specialvalue.length;
    if (params < 1) {
      message.info('每种角色必须选择一个人');
    } else {
      handleSubmit();
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {withClick(children, showModal)}
      <Modal
        title="选择下一环节处理人"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Spin tip="正在加载数据..." spinning={Boolean(loading)}>
          {loading === false && problemlist && (
            <>
              <div>自动化业务人员</div>
              <div style={{ marginTop: 12 }}>
                <Checkbox.Group
                  defaultValue={defaultvalue}
                  options={dataArr(problemlist.serviceData)}
                  onChange={handleChange}
                />
              </div>

              <div>自动化科专责人员</div>
              <div style={{ marginTop: 12 }}>
                <Checkbox.Group
                  defaultValue={defaultvalue}
                  options={dataArr(problemlist.dutyData)}
                  onChange={specialhandleChange}
                />
              </div>
            </>
          )}
        </Spin>
      </Modal>
    </>
  );
};

// SelectUser.defaultProps = { pangekey: '0' };

export default connect(({ itsmuser, loading }) => ({
  problemlist: itsmuser.problemlist,
  loading: loading.models.itsmuser,
}))(SelectUser);
