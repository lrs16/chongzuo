import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';

function TemporarySelectUser(props) {
  const { dispatch, visible, taskId, type, userlist, ChangeUserVisible } = props;

  useEffect(() => {
    if (taskId && type) {
      dispatch({
        type: 'releasetemp/getuserlist',
        payload: {
          taskId,
          type,
        },
      });
    };
  }, []);

  const handleOk = () => {
    ChangeUserVisible(false);
  }

  const handleCancel = () => {
    ChangeUserVisible(false);
  };

  console.log(userlist);

  return (
    <Modal visible={visible} onOk={handleOk} onCancel={handleCancel} width={700}>
      11111
    </Modal>
  );
}

export default connect(({ releasetemp, loading }) => ({
  userlist: releasetemp.userlist,
  loading: loading.models.releasetemp,
}))(TemporarySelectUser);