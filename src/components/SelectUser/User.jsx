import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, message, Spin, Checkbox } from 'antd';
import styles from './index.less';

const User = props => {
  const {
    dispatch,
    // defaultvalue,
    // demandvalue,
    userlist,
    loading,
    changorder,
    taskId,
    visible,
    ChangeUserVisible,
    ChangeChoice,
    ChangeType,
  } = props;
  const [isnew, setIsNew] = useState(false);
  const [demandvalue, setDemandValue] = useState([])
  const [defaultvalue, setDefaultValue] = useState([])
  const type = sessionStorage.getItem('Processtype');

  useEffect(() => {
    if (loading) {
      setIsNew(true);
    }
    return () => {
      setIsNew(false);
      setDemandValue([]);
      setDefaultValue([]);
    };
  }, [userlist]);

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
      if (key === 1 && demandvalue.length === 0) {
        setDemandValue([{}, { ...obj }])
      } else {
        demandvalue.push(obj);
      }
    } else {
      demandvalue.splice(key, 1, obj);
    }
    sessionStorage.setItem('NextflowUserId', JSON.stringify(demandvalue));
  };

  useEffect(() => {
    if (changorder !== undefined && type === 'event') {
      sessionStorage.setItem('Nextflowmane', changorder);
      sessionStorage.setItem('flowtype', '3');
    }
  }, [changorder]);

  const showModal = () => {
    switch (type) {
      case 'event':
        dispatch({
          type: 'itsmuser/eventuserlist',
          payload: {
            taskId,
            type: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      case 'demand':
        dispatch({
          type: 'itsmuser/demanduserlist',
          payload: {
            taskId,
            result: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      case 'problem':
        dispatch({
          type: 'itsmuser/problemuserlist',
          payload: {
            taskId,
            result: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      case 'troub':
        dispatch({
          type: 'itsmuser/troubleuserlist',
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

  useEffect(() => {
    if (visible) {
      showModal();
    }
    return () => {

    }
  }, [visible]);

  const handleOk = () => {
    if (type !== 'demand') {
      if (value.length === 0) {
        message.error('最少选择一个处理人！');
      } else {
        ChangeChoice(true);
        ChangeUserVisible(false);
      }
    };
    if (type === 'demand') {
      const newArr = [];
      const nameArr = [];
      for (let i = 0; i < demandvalue.length; i += 1) {
        const idnum = demandvalue[i].userIds.length;
        newArr.push(idnum);
        nameArr.push(demandvalue[i].nodeName);
      }
      if (newArr.indexOf(0) !== -1 || nameArr.length < userlist.length) {
        message.error('最少选择一个处理人！');
      } else {
        ChangeChoice(true);
        ChangeUserVisible(false);
      };
    }

  };

  const handleCancel = () => {
    ChangeUserVisible(false);
    ChangeType('');
  };


  const nextflowuser =
    changorder !== undefined ? changorder : sessionStorage.getItem('Nextflowmane');
  return (
    <>
      <Modal title="选择下一环节处理人" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Spin tip="正在加载数据..." spinning={Boolean(loading)}>
          {loading === false && isnew && type !== 'demand' && (
            <>
              <div>{nextflowuser}人员</div>
              <div style={{ marginTop: 12 }} className={styles.useritem}>
                <Checkbox.Group
                  defaultValue={defaultvalue}
                  options={dataArr(userlist)}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          {type === 'demand' && loading === false && isnew && userlist !== '' && (
            <>
              {userlist.map((obj, index) => {
                return (
                  <div key={index.toString()}>
                    <div>{obj.nodeName}人员</div>
                    <div style={{ marginTop: 12 }}>
                      <Checkbox.Group
                        defaultValue={defaultvalue}
                        options={dataArr(obj.users)}
                        onChange={values => handledemandChange(values, obj.nodeName, index)}
                        key={index.toString()}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </Spin>
      </Modal>
    </>
  );
};

User.defaultProps = {
  pangekey: '0',
  // defaultvalue: [],
  // demandvalue: []
};

export default connect(({ itsmuser, loading }) => ({
  userlist: itsmuser.userlist,
  loading: loading.models.itsmuser,
}))(User);
