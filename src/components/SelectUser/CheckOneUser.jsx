import React, { useContext, useState } from 'react';
import { Modal, Radio, message } from 'antd';
import UserContext from '@/layouts/MenuContext';

function CheckOneUser(props) {
  const { userlist } = props;
  const [checkeduser, setCheckUser] = useState('');
  const { setChoiceUser, uservisible, setUserVisible, title } = useContext(UserContext);

  const onChange = e => {
    setCheckUser(e.target.value);
  };

  const handleOk = () => {
    if (checkeduser === '') {
      message.error(`请选择${title}人`);
    } else {
      setChoiceUser({ users: checkeduser, ischange: true });
      setUserVisible(false)
    }
  }

  const handleCancel = () => {
    setChoiceUser({ users: '', ischange: false });
    setUserVisible(false)
  }


  return (
    <Modal title={`选择${title}人`} visible={uservisible} onOk={handleOk} onCancel={handleCancel}>
      <Radio.Group onChange={onChange} value={checkeduser}>
        {userlist.map(obj => (
          <Radio key={obj.userId} value={obj.userId}>
            {obj.userName}
          </Radio>
        ))}
      </Radio.Group>
    </Modal>
  );
}

export default CheckOneUser;