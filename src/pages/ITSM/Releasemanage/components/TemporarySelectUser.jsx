import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';

function TemporarySelectUser(props) {
  const { dispatch, visible, taskId, type, userlist } = props;

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

  console.log(userlist);

  return (
    <Modal visible={visible}>
      11111
    </Modal>
  );
}

export default connect(({ releasetemp, loading }) => ({
  userlist: releasetemp.userlist,
  loading: loading.models.releasetemp,
}))(TemporarySelectUser);