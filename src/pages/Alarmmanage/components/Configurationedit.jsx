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

let showAlarmDialog = false;
let showTerminalDialog = false;
let newtitle = '';
let tableSign = '';
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
  const [tableSign, setTableSign] = useState([]);
  // const [column, setColumn] = useState('');

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
          onChange={e => handleFieldChange(e.target.value, 'minVal', record.key)}
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
          onChange={e => handleFieldChange(e.target.value, 'maxVal', record.key)}
        />
      }
    },
    {
      title: '使用状态',
      dataIndex: 'useStatus',
      key: 'useStatus',
      render: (text, record) => {
        return <Radio.Group defaultValue={record.useStatus} onChange={e => handleFieldChange(e.target.value, 'useStatus', record.key)}>
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
          onChange={e => handleFieldChange(e.target.value, 'pzz', record.key)}
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
          onChange={e => handleFieldChange(e.target.value, 'tryTimes', record.key)}
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
          onChange={e => handleFieldChange(e.target.value, 'ms', record.key)}
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
      width: 200,
      render: (text, record) => {
        return (
          <Radio.Group
            defaultValue={record.sybz}
            onChange={e => handleFieldChange(e.target.value, 'sybz', record.key)}>
            <Radio value='Y'>启用</Radio>
            <Radio value='N'>停用</Radio>
          </Radio.Group>
        )
      }
    },
  ];

  const dlcolumns = [
    {
      title: '登录地址',
      dataIndex: 'gddwbm',
      key: 'gddwbm',
      render: (text, record, index) => {
        return <Input
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'gddwbm', record.key)}
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
          onChange={e => handleFieldChange(e.target.value, 'tryTimes', record.key)}
        />
      }
    },
    {
      title: '登录账号',
      dataIndex: 'gddwmc',
      key: 'gddwmc',
      render: (text, record, index) => {
        return <Input
          // type='number'
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'gddwmc', record.key)}
        />
      }
    },
    {
      title: '密码',
      dataIndex: 'pzz',
      key: 'pzz',
      render: (text, record, index) => {
        return <Input
          type='number'
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'pzz', record.key)}
        />
      }
    },
    {
      title: '用户名',
      dataIndex: 'ms',
      key: 'ms',
      render: (text, record, index) => {
        return <Input
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'ms', record.key)}
        />
      }
    },
    {
      title: '使用状态',
      dataIndex: 'sybz',
      key: 'sybz',
      width: 200,
      render: (text, record) => {
        return (
          <Radio.Group
            defaultValue={record.sybz}
            onChange={e => handleFieldChange(e.target.value, 'sybz', record.key)}>
            <Radio value='Y'>启用</Radio>
            <Radio value='N'>停用</Radio>
          </Radio.Group>
        )
      }
    },
  ];

  const sxcolumns = [
    {
      title: '序号',
      dataIndex: 'gddwbm',
      key: 'gddwbm',
      render:(text,record,index) => {
        return <span>{index +1}</span>
      }
    },
    {
      title: '供电单位',
      dataIndex: 'gddwmc',
      key: 'gddwmc',
      render: (text, record, index) => {
        return <Input
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'gddwmc', record.key)}
        />
      }
    },
    {
      title: '终端地址|资产编号',
      dataIndex: 'pzz',
      key: 'pzz',
      render: (text, record, index) => {
        return <Input
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'pzz', record.key)}
        />
      }
    },
    {
      title: '查询记录总数',
      dataIndex: 'ms',
      key: 'ms',
      render: (text, record, index) => {
        return <Input
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'ms', record.key)}
        />
      }
    },
    {
      title: '连续报文数',
      dataIndex: 'tryTimes',
      key: 'tryTimes',
      width: 200,
      render: (text, record, index) => {
        return <Input
          defaultValue={text}
          onChange={e => handleFieldChange(e.target.value, 'tryTimes', record.key)}
        />
      }
    },
    {
      title: '使用状态',
      dataIndex: 'sybz',
      key: 'sybz',
      width: 200,
      render: (text, record) => {
        return (
          <Radio.Group
            defaultValue={record.sybz}
            onChange={e => handleFieldChange(e.target.value, 'sybz', record.key)}>
            <Radio value='Y'>启用</Radio>
            <Radio value='N'>停用</Radio>
          </Radio.Group>
        )
      }
    },
  ];

 

  // 获取行
  const getRowByKey = (key, newData) => {
    console.log('newData: ', newData);
    console.log((newData || data).filter(item => item.key === key)[0])
    return (newData || data).filter(item =>
      item.key === key)[0]
      ;
    ;
  };

  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    console.log('key: ', key);
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    console.log('target: ', target);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  };
  console.log(data, 'data')

  // 提交保存数据
  const savedata = () => {
    console.log(data, 'data444')
    return dispatch({
      type: 'monitorconfiguration/batchSave',
      payload: { data, tableSign }
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        hanldleCancel();
      }
    })
  };


  const handleopenClick = () => {
    const alarm = ['cjwzl', 'zdfgl', 'zdcbl', 'gkcj', 'sdl', 'gdl', 'cldzb', 'kafka', 'zdzxl', 'datb', 'gsdl'];
    const term = ['sjzc_dy', 'dazc', 'sjzc_fk', 'sjzc_cz'];
    if (alarm.indexOf(code) !== -1) {
      // 告警
      // showAlarmDialog = true;
      newtitle = '采集完整率配置';
      setTableSign('采集完整率配置')
      // setColumn(columns)
      // sign = true;
    } else if (term.indexOf(code) !== -1) {
      // 终端配置
      // showTerminalDialog = true;
      newtitle = '档案参数下发召测配置';
      setTableSign('档案参数下发召测配置')
      // setColumn(zdcolumns)
      // sign = true;
    }

    if (code === 'packet') {
      // showTerminalDialog = true;
      newtitle = '上下行报文监测告警配置';
      setTableSign('上下行报文监测告警配置')
      // sign = true;
    }

    if (code === 'dljc') {
      newtitle = '登录检测配置';
      setTableSign('登录检测配置')
      // setColumn(dlcolumns)
    }

    if (code === 'packet') {
      newtitle = '上下行报文监测告警配置';
      setTableSign('上下行报文监测告警配置')
      // setColumn(dlcolumns)
    }

    if (code === 'rd') {
      newtitle = '日冻结电能量';
      setTableSign('日冻结电能量')
      // setColumn(dlcolumns)
    }
    console.log(code,'code')
    return dispatch({
      type: 'monitorconfiguration/detailConfigura',
      payload: { code, newtitle }
    }).then(res => {
      if (res.code === 200) {
        const newarr = (res.data).map((item, index) => {
          return (Object.assign(item, { key: index }))
        })
        setState(true)
        setData(newarr);
      }
    })
  };

  const hanldleCancel = () => {
    setState(false);
    newtitle = ''
  };

  // useEffect (() => {
  //   sign = false;
  // },[])

  console.log(tableSign, 'tableSign')

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={tableSign}
        visible={state}
        // width={720}
        width={1500}
        centered='true'
        maskClosable='true'
        onClose={hanldleCancel}
      >

        {
          loading === false && (tableSign === '采集完整率配置' || tableSign === '日冻结电能量') && (
            <Table
              columns={columns}
              dataSource={data}
              rowKey={record => record.id}
            />
          )
        }

        {
          loading === false && tableSign === '档案参数下发召测配置' && (
            <Table
              columns={zdcolumns}
              dataSource={data}
              rowKey={record => record.id}
            />
          )
        }

        {
          loading === false && (tableSign === '登录检测配置') && (
            <Table
              columns={dlcolumns}
              dataSource={data}
              rowKey={record => record.id}
            />
          )
        }

        {
          loading === false && tableSign === '上下行报文监测告警配置' && (
            <Table
              columns={sxcolumns}
              dataSource={data}
              rowKey={record => record.id}
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
          <Button onClick={hanldleCancel} style={{ marginRight: 8 }}>
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
