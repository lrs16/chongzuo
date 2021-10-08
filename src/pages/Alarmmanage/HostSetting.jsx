import React, { useState, useEffect } from 'react';
import { Table, InputNumber, Radio, Select, Card, message } from 'antd';
import { querkeyVal } from '@/services/api';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getAppMonitorData, setAppMonitorConf } from './services/api';

const { Option } = Select;

function HostSetting(props) {
  const pagetitle = props.route.name;
  const [data, setData] = useState([]);
  const [dist, setDist] = useState([]);
  const [frequency, setFrequency] = useState({});

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  };
  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      setData(newData);
      setAppMonitorConf([target]).then(res => {
        if (res.code === 200) {
          message.success('操作成功')
        } else {
          message.error('操作失败')
        }
      })
    }
  };

  useEffect(() => {
    querkeyVal('alarm', 'frequency').then(res => {
      if (res.code === 200) {
        setDist(res.data.frequency)
      }
    });
    getAppMonitorData().then(res => {
      if (res.code === 200) {
        setFrequency(res.data[res.data.length - 1])
        const newData = res.data;
        newData.pop()
        setData(newData);
      }
    })
  }, []);

  const onFrequency = (val) => {
    frequency.confValue = val;
    setAppMonitorConf([frequency]).then(res => {
      if (res.code === 200) {
        message.success('操作成功')
      } else {
        message.error('操作失败')
      }
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'confSorts',
      key: 'confSorts',
      // render: (text, record, index) => {
      //   return <>{`${index + 1}`}</>;
      // },
    },
    {
      title: '配置子项',
      dataIndex: 'confTitle',
      key: 'confTitle',
    },
    {
      title: '阈值',
      dataIndex: 'confValue',
      key: 'confValue',
      render: (text, record) => {
        return (
          <InputNumber
            key={record.key}
            defaultValue={text}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={e => handleFieldChange(e, 'confValue', record.id)}
          />
        )
      },
    },
    {
      title: '单位',
      dataIndex: 'confPlace',
      key: 'confPlace',
    },
    {
      title: '使用状态',
      dataIndex: 'confStatus',
      key: 'confStatus',
      width: 200,
      render: (text, record) => {
        return (
          <Radio.Group
            onChange={e => handleFieldChange(e.target.value, 'confStatus', record.key)}
            value={text}>
            <Radio value='1'>启用</Radio>
            <Radio value='0'>停用</Radio>
          </Radio.Group>
        )
      },
    },
  ]
  return (
    <PageHeaderWrapper title={pagetitle}>
      <div>配 置 项：应用程序运行状态监测</div>
      <div style={{ marginTop: 12 }}>配置描述：监测内容超过设定的阈值则告警</div>
      <Card style={{ marginTop: 24 }}>
        {frequency && frequency.confValue && (
          <>
            监控频率：<Select placeholder="请选择" style={{ width: 200, }} onChange={onFrequency} defaultValue={frequency.confValue}>
              {dist.map(({ key, val }) => [
                <Option key={key} value={key}>
                  {val}
                </Option>,
              ])}
            </Select>
          </>
        )}
        <Table
          style={{ marginTop: 24 }}
          columns={columns}
          dataSource={data}
          rowKey={record => record.id}
          pagination={false} />
      </Card>
    </PageHeaderWrapper>
  );
}

export default HostSetting;