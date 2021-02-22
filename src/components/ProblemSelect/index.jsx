import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, message, Spin, Checkbox } from 'antd';

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
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

  const [value, setValue] = useState('');
  const [demandvalue, setDemandValue] = useState([]);

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

  // 需求多选下一环节人员
  const handledemandChange = (values, nodeName, key) => {
    const obj = {};
    obj.nodeName = nodeName;
    obj.userIds = values;
    const target = demandvalue.filter((_, index) => key === index)[0];
    if (target === undefined) {
      demandvalue.push(obj);
    } else {
      demandvalue.splice(key, 1, obj);
    }
    sessionStorage.setItem('NextflowUserId', JSON.stringify(demandvalue));
    // setValue(values);
  };

  // useEffect(() => {
  //   sessionStorage.setItem('NextflowUserId', value);
  // }, []);

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
    if (type !== 'demand') {
      if (value.length === 0) {
        message.error('最少选择一个处理人！');
      } else {
        handleSubmit();
        setIsModalVisible(false);
      }
    }
    if (type === 'demand') {
      const newArr = [];
      const nameArr = [];
      for (let i = 0; i < demandvalue.length; i += 1) {
        const idnum = demandvalue[i].userIds.length;
        newArr.push(idnum);
        nameArr.push(demandvalue[i].nodeName);
      }
      if (newArr.indexOf(0) !== -1 || nameArr.length < problemlist.length) {
        message.error('最少选择一个处理人！');
      } else {
        handleSubmit();
        setIsModalVisible(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const nextflowuser =
    changorder !== undefined ? changorder : sessionStorage.getItem('Nextflowmane');
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
          {loading === false && type !== 'demand' && (
            <>
              <div>{nextflowuser}人员</div>
              <div style={{ marginTop: 12 }}>
                <Checkbox.Group
                  defaultValue={defaultvalue}
                  options={dataArr(problemlist.data)}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </Spin>
      </Modal>
    </>
  );
};

SelectUser.defaultProps = { pangekey: '0' };

export default connect(({ itsmuser, loading }) => ({
  problemlist: itsmuser.problemlist,
  loading: loading.models.itsmuser,
}))(SelectUser);
