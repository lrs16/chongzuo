import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Divider,
  Popconfirm,
  Select,
  AutoComplete,
  Spin
} from 'antd';
import SysUpload from '@/components/SysUpload';
import { queryDisableduserByUser, queryUnitList, queryDeptList } from '@/services/common';
import styles from '../index.less';

const { Search } = Input;
const { Option } = Select;

const ThisWeekitsm = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  )

  const {
    form: { getFieldDecorator, setFieldsValue },
    forminladeLayout,
    thisWeekitsmlist,
    ChangeFiles,
    searchNumber
  } = props;

  const [data, setData] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [newbutton, setNewButton] = useState(false);
  const [fileslist, setFilesList] = useState([]);
  const [disablelist, setDisabledList] = useState([]);
  const [spinloading, setSpinLoading] = useState(true);

  useEffect(() => {
    ChangeFiles(fileslist);
    // getTableindex('1')
  },[fileslist])
  // 自动完成报障用户
  const disableduser = disablelist.map(opt => (
    <Option key={opt.id} value={opt.user} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.user}</span>
          {/* <span>{opt.phone}</span>
            <span>{opt.unit}</span>
            <span>{opt.dept}</span> */}
        </div>
      </Spin>
    </Option>
  ));

  // 请求报障用户
  const SearchDisableduser = value => {
    queryDisableduserByUser({ user: value }).then(res => {
      if (res) {
        const arr = [...res];
        setSpinLoading(false);
        setDisabledList(arr);
      }
    });
  };

  // 选择报障用户，信息回填
  const handleDisableduser = (v, opt, fieldName, key) => {
    // const newData = data.map(item => ({ ...item }));
    // const { user } = opt.props.disableuser;
    // // setFieldsValue({
    // //   num5: 'user',         // 申报人
    // // });
    // const target = getRowByKey(key,newData);
    // console.log('target: ', target);
    // if(target) {
    //   target[fieldName] = user;
    //   setData(newData)
    // }
  };

  console.log(data)

  const thisWeekitsm = [
    {
      num1: 'num1',
      num2: 'num2',
      num3: 'num3',
      num4: 'num4',
      num5: 'num5',
      num6: 'num6',
      num7: 'num7',
      num8: 'num8',
    }
  ]

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  //  删除数据
  const remove = key => {
    const target = getRowByKey(key) || {};
  };

  // 编辑记录
  const toggleEditable = (e, key, record) => {

    e.preventDefault();
    const newData = data.map(item => ({ ...item })
    );
    const target = getRowByKey(key, newData);
    if (target) {
      if (!target.editable) {
        setcacheOriginData({ key: { ...target } });
      }
      // target.editable = !target.editable;
      target.isNew = true;
      setData(newData);
    }
  }

  //  点击编辑生成filelist
  const handlefileedit = (key, values) => {
    if (!values) {
      setFilesList([]);
    } else {
      setFilesList(JSON.parse(values))
    }
  }

  const savedata = (target, id) => {
    // handleSavethisweek(target)
  }

  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    savedata(target, id);
    if (target.isNew) {
      target.isNew = false
      // setNewButton(false)
    }
  }

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
    if(fieldName === 'num3') {
      searchNumber(e)
    }

  }

  const handleTabledata = () => {
    const newarr = thisWeekitsm.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }

  useEffect(() => {
    handleTabledata();
  }, [])

  const column = [
    {
      title: '序号',
      dataIndex: 'num1',
      key: 'num1',
    },
    {
      title: '工单类型',
      dataIndex: 'num2',
      key: 'num2',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Select
              defaultValue={text}
              onChange={e => handleFieldChange(e, 'num2', record.key)}
            >
              <Option key='事件' value='事件'>事件</Option>
              <Option key='问题' value='问题'>问题</Option>
              <Option key='故障' value='故障'>故障</Option>
            </Select>
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '工单编号',
      dataIndex: 'num3',
      key: 'num3',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'num3', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }

      }
    },
    {
      title: '应用系统名称',
      dataIndex: 'num4',
      key: 'num4',
    },
    {
      title: '具体内容',
      dataIndex: 'num5',
      key: 'num5',
      render: (text, record) => {
        if (record.isNew) {
          console.log(text)
          return (
            <>
              <AutoComplete
                defaultValue={text}
                onChange={e => handleFieldChange(e, 'num5', record.key)}
                dataSource={disableduser}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 600 }}
                optionLabelProp="value"
              // onSelect={(v, opt) => handleDisableduser(v, opt,'num5',record.key)}
              >
                <Search
                  placeholder="可输入姓名搜索"
                  onSearch={values => SearchDisableduser(values)}
                  allowClear
                />
              </AutoComplete>,
            </>
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '处理情况',
      dataIndex: 'num6',
      key: 'num6',
    },
    {
      title: '开始发生时间',
      dataIndex: 'num7',
      key: 'num7',
    },
    {
      title: '处理完成时间',
      dataIndex: 'num8',
      key: 'num8',
    },
    {
      title: '故障报告是否提交负责人',
      dataIndex: 'num9',
      key: 'num9',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        if (record.isNew === true) {
          return (
            <span>
              <a onClick={e => saveRow(e, record.key, 'secondTable')}>保存</a>
              <Divider type='vertical' />
              <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }

        return (
          <span>
            <a
              onClick={e => {
                toggleEditable(e, record.key, record, 'secondTable');
                // handlefileedit(record.key, record.attachment)
              }}
            >编辑</a>
            <Divider type='vertical' />
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }

    }
  ];



  return (
    <>
      <Row gutter={16}>
        <Col span={20}>
          <p style={{ fontWeight: '900', fontSize: '16px' }}>四、本周事件、问题及故障</p>
        </Col>

        <Table
          columns={column}
          dataSource={data}
        />

        <Col span={6}>
          <Form.Item
            label='上传附件'
            {...forminladeLayout}
          >
            {getFieldDecorator('params22', {})
              (
                <div style={{ width: 400 }}>
                  <SysUpload
                    fileslist={[]}
                    ChangeFileslist={newvalue => {
                      setFieldsValue({params22:JSON.stringify(newvalue.arr)})
                      setFilesList(newvalue)
                    }}
                  />
                </div>
              )}

          </Form.Item>
        </Col>
      </Row>

    </>
  )
})

export default Form.create({})(ThisWeekitsm)