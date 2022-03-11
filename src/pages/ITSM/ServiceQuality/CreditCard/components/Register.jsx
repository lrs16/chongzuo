import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback
} from 'react';
import { Form, Input, Row, Col, AutoComplete, Select, DatePicker, Spin, message } from 'antd';
import MergeTable from '@/components/MergeTable';
import moment from 'moment';
import SysDict from '@/components/SysDict';
import { providerList, scoreListpage } from '../../services/quality';
import styles from '../../index.less';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Register = forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, setFieldsValue, getFieldsValue, resetFields },
    formItemLayout,
    formItemdeLayout,
    contractArr,
    getContrractname,
    register,
    id,
    changeTablesource,
    search,
    loading,
  } = props;

  const required = true;

  const [data, setData] = useState([]);
  const [disablelist, setDisabledList] = useState([]); // 服务商
  const [scorelist, setScorelist] = useState([]); // 评分细则
  const [providerId, setProviderId] = useState(''); //  设置服务商的id
  const [spinloading, setSpinLoading] = useState(true);
  const [selectdata, setSelectData] = useState('');
  const [phaseArr, setPhaseArr] = useState([]);

  useImperativeHandle(
    ref,
    () => ({
      getVal: () => getFieldsValue(),
      resetVal: () => resetFields(),
      Forms: props.form.validateFieldsAndScroll,
    }),
    [],
  );

  //  获取行
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  };

  const handleFieldChange = (e, fieldName, key, editid) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    changeTablesource(editid, e);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  };

  const handleTabledata = () => {
    const newarr = (register.details || []).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index, field1: index + 1 });
    });
    setData(newarr);
  };

  useEffect(() => {
    const requestData = {
      scoreName: '',
      pageNum: 1,
      pageSize: 1000,
      status: '1',
    };
    handleTabledata();
    scoreListpage({ ...requestData }).then(res => {
      if (res) {
        const arr = [...res.data.records];
        setSpinLoading(false);
        setScorelist(arr);
      }
    });


  }, [register]);

  useEffect(() => {
    const phaseArrresult = contractArr.filter(obj => obj.id === register.contractId)
    setPhaseArr(phaseArrresult[0]?.phases || [])
  }, [contractArr])


  function useDebounce(fn, delay) {
    const { current } = useRef({ fn, timer: null });
    useEffect(function () {
      current.fn = fn;
    }, [fn]);

    return useCallback(function f(...args) {
      if (current.timer) {
        clearTimeout(current.timer);
      }
      current.timer = setTimeout(() => {
        current.fn.call(this, ...args);
      }, delay);
    })
  }

  const handleValue = useDebounce((e, fieldName, key, editid) => {
    handleFieldChange(e, fieldName, key, editid)
  }, 500);

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
    },
    {
      title: '扣分',
      dataIndex: 'minusScore',
      key: 'minusScore',
      align: 'center',
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
            onChange={e => handleValue(e.target.value, 'remark', record.key, record.id)}
          />
        );
      },
    },
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
    const {
      id,
      providerName,
      scoreName,
      contractName,
      assessType,
    } = opt.props.disableuser;
    switch (type) {
      case 'provider':
        setFieldsValue({
          providerName, // 服务商
          providerId: id, // 服务商id
          contractName,
          contractId: '',
          phaseId: ''
        });
        getContrractname(id);
        setProviderId(id);
        break;

      case 'score':
        setFieldsValue({
          scoreName, // 评分细则名称
          scoreId: id, // 评分细则id
          assessType,
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
      status: '1',
    };
    switch (type) {
      case 'provider':
        providerList({ ...requestData }).then(res => {
          if (res) {
            const arr = [...res.data.records];
            setSpinLoading(false);
            setDisabledList(arr);
          }
        });
        break;

      default:
        break;
    }
  };

  const handleChange = (values, option) => {
    const {
      key,
      props: { value, scoreId, scoreName },
    } = option;
    const phaseArrresult = contractArr.filter(obj => obj.id === value)
    setPhaseArr(phaseArrresult[0]?.phases || [])
    const findassessType = scorelist.filter(obj => obj.id === scoreId)
    setFieldsValue({
      contractName: key,
      contractId: value,
      scoreId,
      scoreName,
      assessType: findassessType[0]?.assessType || '',
      phaseId: ''
    });
  };

  const handleFocus = () => {
    if (loading !== true && contractArr && contractArr.length === 0) {
      message.error('请选择有效的服务商');
    }
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const setevaluationInterval = (value, option) => {
    if (value) {
      const {
        props: {
          beginTime, endTime
        },
      } = option;
      setFieldsValue({
        evaluationInterval: [moment(beginTime), moment(endTime)]
      })
    }

  }

  const grade = getTypebyTitle('评价等级');

  return (
    <>
      <SysDict
        typeid="576"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <div className='noexplain'>
        <Row gutter={24} style={{ paddingTop: 24 }}>
          <Form {...formItemLayout}>
            {/* <Row> */}
            {/* <Col span={8}> */}
            <Col span={8}>
              <Form.Item label="计分卡编号">
                {getFieldDecorator('cardNo', {
                  initialValue: register.cardNo,
                })(<Input disabled />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="评价计分卡名称">
                {getFieldDecorator('cardName', {
                  rules: [
                    {
                      required,
                      message: '请输入评价计分卡名称',
                    },
                  ],
                  initialValue: register.cardName,
                })(<Input disabled={search} />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="服务商">
                {getFieldDecorator('providerName', {
                  rules: [
                    {
                      required,
                      message: '请选择服务商',
                    },
                  ],
                  initialValue: register.providerName,
                })(
                  <AutoComplete
                    disabled={search}
                    dataSource={disableduser}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 600 }}
                    onSelect={(v, opt) => handleDisableduser(v, opt, 'provider')}
                  >
                    <Search
                      placeholder="可输入服务商名称搜索"
                      onSearch={values => SearchDisableduser({ providerName: values }, 'provider')}
                      allowClear
                    />
                  </AutoComplete>,
                )}
              </Form.Item>
            </Col>

            <Col span={8} style={{ display: 'none' }}>
              <Form.Item label="服务商">
                {getFieldDecorator('providerId', {
                  initialValue: register.providerId,
                })(<Input disabled={search} />)}
              </Form.Item>
            </Col>

            {(id ? contractArr : true) && (
              <Col span={8}>
                <Form.Item label="关联合同名称">
                  {getFieldDecorator('contractId', {
                    rules: [
                      {
                        required,
                        message: '请选择关联合同名称',
                      },
                    ],
                    initialValue: register.contractId,
                  })(
                    <Select
                      disabled={search}
                      placeholder="请选择"
                      allowClear={false}
                      onChange={(value, option) => handleChange(value, option, 'contract')}
                      onFocus={() => handleFocus('contract')}
                    >
                      {contractArr.map(obj => [
                        <Option key={obj.contractName} value={obj.id} scoreId={obj.scoreId} scoreName={obj.scoreNo}>
                          <div className={styles.disableuser}>
                            <span>{obj.contractNo}</span>
                            <span>{obj.contractName}</span>
                          </div>
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            )}

            <Col span={8} style={{ display: 'none' }}>
              <Form.Item label="关联合同名称">
                {getFieldDecorator('contractName', {
                  initialValue: register.contractName,
                })(<Input disabled={search} />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="评分细则名称">
                {getFieldDecorator('scoreId', {
                  rules: [
                    {
                      required,
                      message: '评分细则名称为空,请选择有效的关联合同',
                    },
                  ],
                  initialValue: register.scoreId,
                })(
                  <Select
                    disabled
                    allowClear={false}
                  >
                    {scorelist.map(obj => [
                      <Option key={obj.id} value={obj.id}>
                        {obj.scoreName}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8} style={{ display: 'none' }}>
              <Form.Item label="评分细则名称id">
                {getFieldDecorator('scoreName', {
                  initialValue: register.scoreName,
                })(<Input disabled={search} />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="考核类型">
                {getFieldDecorator('assessType', {
                  // initialValue: (register.assessType === '1') ? '功能开发' : (register.assessType === '2') ? '系统运维' : ''
                  initialValue:
                    register && register.assessType && register.assessType === '1'
                      ? '功能开发'
                      : register.assessType === '2'
                        ? '系统运维'
                        : '',
                })(<Input disabled />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="版本号">
                {getFieldDecorator('version', {
                  rules: [
                    {
                      required,
                      message: '请输入版本号',
                    },
                  ],
                  initialValue: register.version,
                })(<Input disabled={search} />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="专业部门">
                {getFieldDecorator('deptName', {
                  rules: [
                    {
                      required,
                      message: '请输入专业部门',
                    },
                  ],
                  initialValue: register.deptName,
                })(<Input disabled={search} />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="评价区间">
                {getFieldDecorator('evaluationInterval', {
                  initialValue:
                    register && register.beginTime
                      ? [moment(register.beginTime), moment(register.endTime)]
                      : '',
                })(
                  <RangePicker
                    disabled={search}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    placeholder="请选择"
                  />

                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="考核周期">
                {getFieldDecorator('phaseId', {
                  initialValue: register.phaseId,
                })(
                  <Select
                    disabled={search}
                    allowClear
                    onChange={(value, option) => setevaluationInterval(value, option)}

                  >
                    {phaseArr.map(obj => [
                      <Option key={obj.id} value={obj.id} beginTime={obj.beginTime} endTime={obj.endTime}>
                        <span>{obj.assessCycle} {obj.beginTime}-{obj.endTime}</span>
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            {id && (
              <>
                <Col span={24}>
                  <Form.Item label="评价详情" {...formItemdeLayout}>
                    {getFieldDecorator(
                      'details',
                      {},
                    )(<MergeTable column={columns} tableSource={data} mergecell="target1Name" />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="评价得分">
                    {getFieldDecorator('totalScore', {
                      initialValue: register.totalScore,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="评价等级">
                    {getFieldDecorator('grade', {
                      initialValue: register.grade,
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                {grade && grade.length && (
                  <Col span={24} {...formItemdeLayout}>
                    <div style={{ textIndent: '4em' }}>
                      <p>注：{grade[0].title}</p>
                      <p style={{ textIndent: '6em' }}>{grade[1].title} </p>
                    </div>
                  </Col>
                )}
              </>
            )}
          </Form>
        </Row>
      </div>

    </>
  );
});

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
    grade: '',
    phaseId: ''
  },
};

export default Form.create({})(Register);
