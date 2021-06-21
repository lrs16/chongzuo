import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Button,
  Divider,
  Popconfirm
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
function WeeklyMeeting(props) {

  const {
    form: { getFieldDecorator },
    forminladeLayout,
    meetingSummaryList,
    meetingSummaryarr,
    type
  } = props;
  const [data, setData] = useState([]);
  const [seconddata, setSeconddata] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [uploadkey, setKeyUpload] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [newbutton, setNewButton] = useState(false);


  // 初始化把数据传过去
  useEffect(() => {
    if (data && data.length) {
      meetingSummaryList(data)
    }
  }, [data]);
  // 新增一条记录
  const newMember = (params) => {
    setFilesList([]);
    setKeyUpload('');
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: '',
      field2: '',
      field3: '',
      field4: '',
    });
    setData(newData);
    setNewButton(true);
  };

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }


  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const handleTabledata = () => {
    if(newbutton === false) {
      const newarr = meetingSummaryarr.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }


  const column = [
    {
      title: '工作内容',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
          />
        )
      }
    },
    {
      title: '完成情况',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
        // }
      }

    }

  ];

  useEffect(() => {
    handleTabledata();
  }, [meetingSummaryarr])


  return (
    <>
      <Row gutter={16}>
        <Col span={20}>
          <p style={{ fontWeight: '900', fontSize: '16px' }}>{type === 'week' ? '5 周例会会议纪要完成情况' : '5 月例会会议纪要完成情况'}</p>
        </Col>

        <Table
          columns={column}
          dataSource={data}
        />

        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="primary"
          ghost
          onClick={() => newMember()}
          icon="plus"
        >
          新增
        </Button>
      </Row>
    </>
  )
}

export default Form.create({})(WeeklyMeeting)
