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


function MonitorConfiguration(props) {
  const {
    dispatch,
    children,
    code,
    loading
  } = props;
  // listCode = code;
  const [state, setState] = useState(false);
  const [data, setData] = useState([]);

  const columns = [
    {
      title: '监控名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '配置项',
      dataIndex: 'itme',
      key: 'itme',
    },
    {
      title: '警戒值小',
      dataIndex: 'minVal',
      key: 'minVal',
      render: (text, record, index) => {
        return <Input
          type='number'
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'minVal', record.id)}
        />
      }
    },
    {
      title: '警戒值大',
      dataIndex: 'maxVal',
      key: 'maxVal',
      render: (text, record, index) => {
        return <Input
          type='number'
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'maxVal', record.id)}
        />
      }
    },
    {
      title: '使用状态',
      dataIndex: 'useStatus',
      key: 'useStatus',
      render:(text,record) => {
        return  <Radio.Group defaultValue={record.useStatus} onChange={e => handleFieldChange(e.target.value, 'useStatus', record.key)}>
          <Radio value='Y'>启用</Radio>
          <Radio value='N'>停用</Radio>
        </Radio.Group>
        
      }
    },
  ];

  const zdcolumns = [
    {
      title: '地区编码',
      dataIndex: 'gddwbm',
      key: 'gddwbm'
    },
    {
      title: '单位名称',
      dataIndex: 'gddwmc',
      key: 'gddwmc'
    },
    {
      title: '终端地址',
      dataIndex: 'pzz',
      key: 'pzz',
      render: (text, record, index) => {
        return <Input
          // type='number'
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'pzz', record.id)}
        />
      }
    },
    {
      title: '失败重试次数',
      dataIndex: 'tryTimes',
      key: 'tryTimes',
      render: (text, record, index) => {
        return <Input
          type='number'
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'tryTimes', record.id)}
        />
      }
    },
    {
      title: '描述',
      dataIndex: 'ms',
      key: 'ms',
      render: (text, record, index) => {
        return <Input
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'ms', record.id)}
        />
      }
    },
    {
      title: '创建时间',
      dataIndex: 'cjsj',
      key: 'cjsj'
    },
    {
      title: '使用状态',
      dataIndex: 'sybz',
      key: 'sybz',
      width:200,
      render: (text, record) => {
          return (
            <Radio.Group defaultValue={record.sybz} onChange={e => handleFieldChange(e.target.value, 'sybz', record.key)}>
              <Radio value='Y'>启用</Radio>
              <Radio value='N'>停用</Radio>
            </Radio.Group>
          )
      }
    },
  ]

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item =>
      item.id === key)[0]
      ;
    // return (newData || data).filter(item =>console.log(item))
    ;
  };

  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  };

  // 提交保存数据
  const savedata = () => {
    return dispatch({
      type: 'monitorconfiguration/batchSave',
      payload: {data,showAlarmDialog,showTerminalDialog}
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        hanldleCancel();
        showAlarmDialog = false;
        showTerminalDialog = false;
      }
    })
  };


  const handleopenClick = () => {
    const alarm = ['cjwzl', 'zdfgl', 'zdcbl', 'gkcj', 'sdl', 'gdl', 'cldzb', 'kafka', 'zdzxl', 'datb', 'gsdl'];
    const term = ['sjzc_dy', 'dazc', 'sjzc_fk', 'sjzc_cz'];
    if (alarm.indexOf(code) != -1) {
      // 告警
      console.log(1,'1');
      showAlarmDialog = true;
      title = '采集完整率配置';
      sign = true;
    } else if (term.indexOf(code) != -1) {
      // 终端配置
      console.log(2,'2');
      showTerminalDialog = true;
      title = '档案参数下发召测配置';
      sign = true;
    }
    return dispatch({
      type: 'monitorconfiguration/detailConfigura',
      payload: { code,showAlarmDialog,showTerminalDialog }
    }).then(res => {
      if (res.code === 200) {
        const tableArr = [];
        (res.data).map((item, index) => {
          tableArr.push(Object.assign({}, item, { key: index }))
        })
        setState(true);
        setData(tableArr);
      }
    })
  };

  const hanldleCancel = () => {
    setState(false);
    showAlarmDialog = false;
    showTerminalDialog = false;
  };

  useEffect (() => {
    console.log(false);
  
    sign = false;
  },[])


  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={title}
        visible={state}
        // width={720}
        width={showAlarmDialog?1000:showTerminalDialog?1500:720}
        centered='true'
        maskClosable='true'
        onClose={hanldleCancel}
      >
        {
          showAlarmDialog === true && sign &&(
            <Table
              columns={columns}
              dataSource={data}
            // rowKey={record => record.id}
            />
          )
        }

        {
          showTerminalDialog === true  &&  sign &&(
            <Table
              columns={zdcolumns}
              dataSource={data}
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
          <Button  onClick={hanldleCancel} style={{ marginRight: 8 }}>
            取消
            </Button>
          <Button onClick={savedata} type="primary">
            确定
            </Button>
        </div>
      </Drawer>

    </>

  );
}

export default Form.create({})(
  connect(({ monitorconfiguration, loading }) => ({
    detailArr: monitorconfiguration.detailArr,
    loading: loading.models.monitorconfiguration,
  }))(MonitorConfiguration),
);
