import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Drawer,
  Table,
  message,
  Radio
} from 'antd';
import { ConsoleSqlOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let showAlarmDialog = false;
let showTerminalDialog = false;
let title = '';
let sign = false;
// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};


function CheckModel(props) {
  const {
    dispatch,
    children,
    currentMOdel,
    statCode,
    status,
    currentNode,
    statTimeBegin,
    statTimeEnd,
    loading,
    statusdetailList
  } = props;
  // listCode = code;
  const [state, setState] = useState(false);
  const [data, setData] = useState([]);



  const handleopenClick = () => {
    console.log(1);
    getTabledata();
    setState(true);

  };

  const getTabledata = () => {
    switch (currentMOdel) {
      // console.log('currentMOdel: ', currentMOdel);
      case 'status':
        console.log('kkk');
        dispatch({
          type: 'problemstatistics/statusDetaisdata',
          payload: { currentNode, statCode, status }
        });
        break;

      default:
        break;
    }
  }



  const hanldleCancel = () => {
    setState(false);
  };


  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={title}
        visible={state}
        // width={720}
        width={1500}
        // centered='true'
        // maskClosable='true'
        onClose={hanldleCancel}
      >
        {
          loading === false && (
            <Table
            // columns={columns}
            dataSource={statusdetailList}
          // rowKey={record => record.id}
          />
          )
        }
       

        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button style={{ marginRight: 8 }}>
            取消
            </Button>
          <Button type="primary">
            确定
            </Button>
        </div>
      </Drawer>

    </>

  );
}

export default Form.create({})(
  connect(({ problemstatistics, loading }) => ({
    statusdetailList: problemstatistics.statusdetailList,
    loading: loading.models.problemstatistics,
  }))(CheckModel),
);
