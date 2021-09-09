import React, { useImperativeHandle, useRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  AutoComplete,
  Select,
  DatePicker,
  Spin,
  message
} from 'antd';
import MergeTable from '@/components/MergeTable';
import { providerList, contractProvider, scoreListpage, clauseListpage } from '../../services/quality';
import moment from 'moment';
import styles from '../../index.less';

const { TextArea, Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Register = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, setFieldsValue },
    formItemLayout,
    formItemdeLayout,
    contractArr,
    getContrractname,
    register,
    id,
    changeTablesource,
    search,
    loading
  } = props;

  const required = true;

  const attRef = useRef();
  const [data, setData] = useState([]);
  const [disablelist, setDisabledList] = useState([]); // 服务商
  const [contractlist, setContractlist] = useState([]); // 合同
  const [scorelist, setScorelist] = useState([]); // 评分细则
  const [clauselist, setClauselist] = useState([]); // 详细条款
  const [providerId, setProviderId] = useState(''); //  设置服务商的id
  const [scoreId, setScoreId] = useState(''); //  设置服务商的id
  const [spinloading, setSpinLoading] = useState(true);

  useImperativeHandle(
    ref,
    () => ({
      attRef
    }),
    [],
  );

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const handleFieldChange = (e, fieldName, key, editid) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    changeTablesource(editid, e);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const handleTabledata = () => {
    const newarr = (register.details || []).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index, field1: index + 1 })
    })
    setData(newarr)
  }

  useEffect(() => {
    handleTabledata()
    // if(register && register.beginTime) {
    //   setFieldsValue({evaluationInterval:[moment(register.beginTime),moment(register.endTime)]})
    // }
  }, [register])

  const columns = [
    {
      title: '一级指标',
      dataIndex: 'target1Name',
      key: 'target1Name',
      align: 'center',
      render: (text, record) => {
        const obj = {
          children: text,
          props: {},
        };
        obj.props.rowSpan = record.rowSpan;
        return obj;
      },
    },
    {
      title: '一级指标满分',
      dataIndex: 'target1Score',
      key: 'target1Score',
      align: 'center',
      render: (text, record) => {
        const obj = {
          children: text,
          props: {},
        };
        obj.props.rowSpan = record.rowSpan;
        return obj;
      },
    },
    {
      title: '二级指标',
      dataIndex: 'target2Name',
      key: 'target2Name',
      align: 'center',
    },
    {
      title: '二级指标满分',
      dataIndex: 'target2Score',
      key: 'target2Score',
      align: 'center',
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      // render: (text, record) => {
      //   if (record.second_object === '合计') {
      //     return <span style={{ fontWeight: 700 }}>{text}</span>
      //   }
      //   return <span>{text}</span>
      // }
    },
    {
      title: '扣分说明',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            disabled={search}
            onChange={e => handleFieldChange(e.target.value, 'remark', record.key, record.id)}

          />
        )
      }
    }
  ];

  // 自动完成服务商
  const disableduser = disablelist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.providerNo}</span>
          <span>{opt.providerName}</span>
          <span>{opt.director}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 选择服务商，信息回填
  const handleDisableduser = (v, opt, type) => {
    const { id, providerName, scoreName, contractName, assessType, clauseName } = opt.props.disableuser;
    switch (type) {
      case 'provider':
        setFieldsValue({
          providerName,         // 服务商
          providerId: id,         // 服务商id
          contractName,
          contractId: '',
        });
        getContrractname(id)
        setProviderId(id);
        break;

      case 'score':
        setFieldsValue({
          scoreName,      // 评分细则名称
          scoreId: id,         // 评分细则id
          assessType
        });
        break;

      default:
        break;
    }
  };

  // 请求服务商
  const SearchDisableduser = (value, type) => {
    const requestData = {
      ...value,
      pageNum: 1,
      pageSize: 1000,
      status: '1'
    }
    switch (type) {
      case 'provider':
        providerList({ ...requestData }).then(res => {
          if (res) {
            const arr = [...(res.data.records)];
            setSpinLoading(false);
            setDisabledList(arr);
          }
        });
        break;
      case 'contract':
        if (!providerId) {
          message.error('请先选择服务商哦')
        } else {
          contractProvider({ id: providerId, status: '1' }).then(res => {
            if (res) {
              const arr = [...(res.data)];
              setSpinLoading(false);
              setContractlist(arr);
            }
          });
        }

        break;
      case 'score':
        scoreListpage({ ...requestData }).then(res => {
          if (res) {
            const arr = [...(res.data.records)];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      case 'clause':
        clauseListpage({ ...requestData, scoreId, targetId: target2Type, }).then(res => {
          if (res) {
            const arr = [...(res.data.records)];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      default:
        break;
    }
  };
  // 自动完成评分细则
  const scorenameList = scorelist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.scoreNo}</span>
          <span>{opt.scoreName}</span>
        </div>
      </Spin>
    </Option>
  ));

  const handleChange = (values, option, params) => {
    const { key, props: { value } } = option;
    setFieldsValue({
      contractName: key,
      contractId: value
    })
  }

  const handleFocus = () => {
    if (loading !== true && contractArr && contractArr.length === 0) {
      message.error('请选择有效的服务商')
    }
  }


  return (
    <>
      {
        loading !== true && (
          <Row gutter={24} style={{ paddingTop: 24 }}>
            <Form {...formItemLayout}>
              {/* <Row> */}
              {/* <Col span={8}> */}
              <Col span={8}>
                <Form.Item label='计分卡编号'>
                  {
                    getFieldDecorator('cardNo', {
                      initialValue: register.cardNo
                    })
                      (<Input disabled='true' />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='评价计分卡名称'>
                  {
                    getFieldDecorator('cardName', {
                      rules: [
                        {
                          required,
                          message: '请输入评价计分卡名称'
                        }
                      ],
                      initialValue: register.cardName
                    })
                      (<Input disabled={search} />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务商'>
                  {
                    getFieldDecorator('providerName', {
                      rules: [
                        {
                          required,
                          message: '请输入服务商'
                        }
                      ],
                      initialValue: register.providerName
                    })
                      (
                        <AutoComplete
                          disabled={search}
                          dataSource={disableduser}
                          dropdownMatchSelectWidth={false}
                          dropdownStyle={{ width: 600 }}
                          onSelect={(v, opt) => handleDisableduser(v, opt, 'provider')}
                        >
                          <Search
                            placeholder="可输入姓名搜索"
                            onSearch={values => SearchDisableduser(values, 'provider')}
                            allowClear
                          />
                        </AutoComplete>,
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label='服务商'>
                  {
                    getFieldDecorator('providerId', {
                      initialValue: register.providerId
                    })
                      (<Input disabled={search} />)
                  }
                </Form.Item>
              </Col>

              {
                (id ? (contractArr) : true) && (
                  <Col span={8}>
                    <Form.Item label='关联合同名称'>
                      {
                        getFieldDecorator('contractId', {
                          rules: [
                            {
                              required,
                              message: '请输入关联合同名称'
                            }
                          ],
                          initialValue: register.contractId
                        })
                          (
                            <Select
                              disabled={search}
                              placeholder='请选择'
                              allowClear
                              onChange={(value, option) => handleChange(value, option, 'contract')}
                              onFocus={() => handleFocus('contract')}
                            >
                              {contractArr.map(obj => [
                                <Option key={obj.contractName} value={obj.id}>
                                  <div className={styles.disableuser}>
                                    <span>{obj.contractNo}</span>
                                    <span>{obj.contractName}</span>
                                  </div>
                                </Option>
                              ])}
                            </Select>
                          )
                      }
                    </Form.Item>
                  </Col>
                )
              }

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label='关联合同名称'>
                  {
                    getFieldDecorator('contractName', {
                      rules: [
                        {
                          required,
                          message: '请输入关联合同名称'
                        }
                      ],
                      initialValue: register.contractName
                    })
                      (
                        <Input disabled={search} />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='评分细则名称'>
                  {
                    getFieldDecorator('scoreName', {
                      rules: [
                        {
                          required,
                          message: '请输入评分细则名称'
                        }
                      ],
                      initialValue: register.scoreName
                    })
                      (
                        <AutoComplete
                          disabled={search}
                          dataSource={scorenameList}
                          dropdownMatchSelectWidth={false}
                          dropdownStyle={{ width: 600 }}
                          onSelect={(v, opt) => handleDisableduser(v, opt, 'score')}
                        >
                          <Search
                            placeholder="可输入姓名搜索"
                            onSearch={values => SearchDisableduser(values, 'score')}
                            allowClear
                          />
                        </AutoComplete>,
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label='评分细则名称'>
                  {
                    getFieldDecorator('scoreId', {
                      rules: [
                        {
                          required,
                          message: '请输入评分细则名称'
                        }
                      ],
                      initialValue: register.scoreId
                    })
                      (
                        <Input disabled={search} />
                      )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='考核类型'>
                  {
                    getFieldDecorator('assessType', {
                      initialValue: (register.assessType === '1') ? '功能开发' : (register.assessType === '2') ? '系统运维' : ''
                    })
                      (<Input disabled='true' />)
                  }
                </Form.Item>
              </Col>



              <Col span={8}>
                <Form.Item label='版本号'>
                  {
                    getFieldDecorator('version', {
                      rules: [
                        {
                          required,
                          message: '请输入版本号'
                        }
                      ],
                      initialValue: register.version
                    })
                      (<Input disabled={search} />)
                  }
                </Form.Item>

              </Col>

              <Col span={8}>
                <Form.Item label='专业部门'>
                  {
                    getFieldDecorator('deptName', {
                      rules: [
                        {
                          required,
                          message: '请输入专业部门'
                        }
                      ],
                      initialValue: register.deptName
                    })
                      (<Input disabled={search} />)
                  }
                </Form.Item>

              </Col>

              <Col span={8}>
                <Form.Item label='评价区间'>
                  {
                    getFieldDecorator('evaluationInterval', {
                      initialValue: (register && register.beginTime) ? [moment(register.beginTime), moment(register.endTime)] : ''

                    })
                      (
                        <RangePicker
                          disabled={search}
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          placeholder="请选择"
                          allowClear
                        />

                      )
                  }
                </Form.Item>
              </Col>


              {
                id && (
                  <>
                    <Col span={24} >
                      <Form.Item label='评价详情' {...formItemdeLayout}>
                        {
                          getFieldDecorator('details', {})
                            (
                              <MergeTable
                                column={columns}
                                tableSource={data}
                                mergecell='target1Name'
                              />
                            )
                        }
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label='评价得分'>
                        {
                          getFieldDecorator('totalScore', {
                            initialValue: register.totalScore
                          })(
                            <Input disabled='true' />
                          )
                        }

                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label='评价等级'>
                        {
                          getFieldDecorator('grade', {
                            initialValue: register.grade
                          })(
                            <Input disabled='true' />
                          )
                        }
                      </Form.Item>
                    </Col>

                    <Col span={24} {...formItemdeLayout}>
                      <div style={{ textIndent: '4em' }}>
                        <p>注：1.评价等级：A: 【90-100）分、B：【80-90）分、C:【60-80）分、D：【0-60）</p>
                        <p style={{ textIndent: '6em' }}>    2.每季度第一个月上旬开展评价；作为乙方单位合同履约评价的依据。</p>
                      </div>

                    </Col>

                  </>
                )
              }





            </Form>
          </Row>
        )
      }





    </>
  )
})

Register.defaultProps = {
  register: {
    cardNo: '',
    cardName: '',
    providerName: '',
    providerId: '',
    contract: '',
    contractName: '',
    contractId: '',
    scoreName: '',
    scoreId: '',
    assessType: '',
    version: '',
    deptName: '',
    cardSeason: '',
    cardYear: '',
    totalScore: '',
    grade: ''
  }
}

export default Form.create({})(Register)