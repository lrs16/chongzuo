import React, { useImperativeHandle, useContext, forwardRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  message,
  DatePicker,
  Row,
  Col,
  Select,
  AutoComplete,
  Upload,
  Spin,
  Button
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { FileDownload, FileDelete, getFileSecuritySuffix } from '@/services/upload';
import moment from 'moment';
import UploadContext from '@/layouts/MenuContext';
import { searchUsers } from '@/services/common';
import SysDict from '@/components/SysDict';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import {
  providerList,
  scoreListpage,
  contractProvider,
} from '../../services/quality';
import styles from '../index.less';

const { TextArea, Search } = Input;
const { Option } = Select;

const Register = forwardRef((props, ref) => {
  const {
    form: { validateFields, getFieldDecorator, setFieldsValue, getFieldsValue, resetFields },
    formItemLayout,
    forminladeLayout,
    userinfo,
    register,
    getTarget1,
    getTarget2,
    target1,
    target2,
    getclausedetail,
    clauseList,
    contractArr,
    getContrractname,
    files,
    ChangeFiles,
    noEdit,
    tabdata,
    search,
    loading,
    getUploadStatus,
  } = props;

  const [fileslist, setFilesList] = useState([]);
  const [selectdata, setSelectData] = useState('');
  const [disablelist, setDisabledList] = useState([]); // 服务商
  const [contractlist, setContractlist] = useState([]); // 合同
  const [scorelist, setScorelist] = useState([]); // 评分细则
  const [directorlist, setDirectorlist] = useState([]); // 责任人
  const [filetype, setFileType] = useState('');

  const [providerId, setProviderId] = useState(''); //  设置服务商的id
  const [scoreId, setScoreId] = useState(''); //  设置服务商的id
  const [target2Type, setTarget2Type] = useState('');
  const [spinloading, setSpinLoading] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [banOpenFileDialog, setBanOpenFileDialog] = useState(true);
  const { getRegistUploadStatus, handleUploadStatus } = useContext(UploadContext);

  const required = true;


  useImperativeHandle(
    ref,
    () => ({
      getVal: () => getFieldsValue(),
      resetVal: () => resetFields(),
      Forms: props.form.validateFieldsAndScroll,
    }),
    [],
  );


  useEffect(() => {
    setProviderId(register.providerId);
    setScoreId(register.scoreId);
  }, [register])

  const handleChange = (values, option, params) => {
    const {
      key,
      props: { value },
    } = option;
    switch (params) {
      case 'contract':
        setFieldsValue({
          contractName: key,
          contractId: value,
        });
        break;
      case 'target1Name':
        setFieldsValue({
          target1Name: value,
          target1Id: key,
          target2Name: '',
          target2Id: '',
          clauseName: '',
        });
        getTarget2(key);
        setTarget2Type(key);
        break;
      case 'target2Name':
        getclausedetail(key, scoreId);
        setFieldsValue({
          target2Name: value,
          target2Id: key,
          clauseId: '',
          clauseName: '',
        });
        break;
      case 'clause': {
        const {
          props: {
            children: {
              props: { children },
            },
          },
        } = option;
        setFieldsValue({
          clauseId: value,
          clauseName: children[1].props.children,
          assessValue: children[3].props.children,
        });
        break;
      }
      default:
        break;
    }
  };

  const handleFocus = params => {
    switch (params) {
      case 'one':
        if (loading !== true && target1 && target1.length === 0) {
          message.error('请选择有效的评分细则名称');
        }
        break;
      case 'two':
        if (loading !== true && target2 && target2.length === 0) {
          message.error('请选择有效的一级指标');
        }
        break;
      case 'contract':
        if (loading !== true && contractArr && contractArr.length === 0) {
          message.error('请选择有效的服务商');
        }
        break;
      case 'clause':
        if (loading !== true && clauseList && clauseList.length === 0) {
          message.error('请选择有效的二级指标');
        }
        break;

      default:
        break;
    }
  };

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

  // 请求搜索框
  const SearchDisableduser = (value, type) => {
    const requestData = {
      providerName: value,
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
      case 'contract':
        if (!providerId) {
          message.error('请先选择服务商哦');
        } else {
          contractProvider(providerId).then(res => {
            if (res) {
              const arr = [...res.data];
              setSpinLoading(false);
              setContractlist(arr);
            }
          });
        }

        break;
      case 'score':
        scoreListpage({
          scoreName: value,
          pageNum: 1,
          pageSize: 1000,
        }).then(res => {
          if (res) {
            const arr = [...res.data.records];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      case 'clause':
        searchUsers({ ...requestData, scoreId, targetId: target2Type }).then(res => {
          if (res) {
            const arr = [...res.data.records];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      case 'director':
        searchUsers({ userName: value }).then(res => {
          if (res) {
            const arr = [...res.data];
            // setSpinLoading(false);
            setDirectorlist(arr);
          }
        });
        break;
      default:
        break;
    }
  };

  // 选择下拉值，信息回填
  const handleDisableduser = (v, opt, type) => {
    const { id, providerName, scoreName, assessType, userName } = opt.props.disableuser;
    switch (type) {
      case 'provider':
        setFieldsValue({
          ifproviderName: providerName,
          providerName, // 服务商
          providerId: id, // 服务商id
          contractName: '',
          contractId: '',
        });
        getContrractname(id);
        setProviderId(id);
        break;

      case 'score':
        setFieldsValue({
          ifscore: scoreName,
          score: scoreName, // 评分细则名称
          scoreId: id, // 评分细则id
          assessType,
          target1Name: '',
          target1Id: '',
          target2Name: '',
          target2Id: '',
          clauseId: '',
          clauseName: '',
          assessValue: ''
        });
        setScoreId(id);
        getTarget1(assessType === '功能开发' ? '1' : '2');
        break;

      case 'director':
        setFieldsValue({
          directorName: userName, // 服务商,
          directorNamesign: userName,
          directorId: id, // 服务商id
        });
        break;

      default:
        break;
    }
  };

  // 自动完成责任人
  const directoruser = directorlist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <div className={styles.disableuser}>
        <span>{opt.userName}</span>
      </div>
    </Option>
  ));

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  useEffect(() => {
    searchUsers({ userName: (tabdata && tabdata.directorName) || '' }).then(res => {
      if (res) {
        const arr = [...res.data];
        setDirectorlist(arr);
      }
    });
  }, [tabdata]);

  // const onChange = (date, dateString) => {
  //   setFieldsValue({ assessTime: moment(dateString) })
  // }

  const assessmentObject = getTypebyTitle('考核对象');
  const assessmentSource = getTypebyTitle('考核来源');

  useEffect(() => {
    if (files && files.length > 0) {
      setFilesList(files);
    };
  }, [register]);

  // 附件上传下载

  // 不允许上传类型
  useEffect(() => {
    getFileSecuritySuffix().then(res => {
      if (res.code === 200) {
        const arr = [...res.data];
        setFileType(arr);
      }
    });
  }, []);

  const handledownload = filesinfo => {
    FileDownload(filesinfo.uid).then(res => {
      const filename = filesinfo.name;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const uploadprops = {
    name: 'file',
    action: '/sys/file/upload',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    showUploadList: { showDownloadIcon: showIcon, showRemoveIcon: true },
    defaultFileList: files,
    multiple: true,
    openFileDialogOnClick: !banOpenFileDialog,

    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        setShowIcon(false);
        if (getUploadStatus) { getUploadStatus(true) };
        if (getRegistUploadStatus) { getRegistUploadStatus(true) };
        const type = file.name.lastIndexOf('.');
        const filesuffix = file.name.substring(type + 1, file.name.length);
        const correctfiletype = filetype.indexOf(filesuffix);
        if (correctfiletype === -1) {
          message.error(`${file.name}文件不符合上传规则,禁止上传...`);
          return reject();
        }
        return resolve(file);
      }
      );
    },

    onChange({ file, fileList }) {
      const allsuccess = fileList.map(item => item.response && item.response.fileUploadInfo && item.response.fileUploadInfo.length > 0);
      const alldone = fileList.map(item => item.status !== 'done');
      if (file.status === 'done' && alldone.indexOf(true) === -1 && file.response && file.response.code === 200 && allsuccess.indexOf(true) === -1) {
        const arr = [...fileList];
        const newarr = [];
        for (let i = 0; i < arr.length; i += 1) {
          const vote = {};
          vote.uid = arr[i]?.response?.data[0]?.id !== undefined ? arr[i]?.response?.data[0]?.id : arr[i].uid;
          vote.name = arr[i].name;
          vote.fileUrl = '';
          vote.status = arr[i].status;
          newarr.push(vote);
        }
        setFilesList([...newarr]);
        ChangeFiles({ arr: [...newarr], ischange: true });
        setShowIcon(true);
        if (getUploadStatus) { getUploadStatus(false) };
        if (getRegistUploadStatus) { getRegistUploadStatus(false) };
      }
    },
    onPreview(filesinfo) {
      if (showIcon) {
        handledownload(filesinfo);
      }

    },
    onDownload(filesinfo) {
      handledownload(filesinfo);
    },
    onRemove(filesinfo) {
      return new Promise((resolve, reject) => {
        validateFields((err) => {
          if (!err) {
            const newfilelist = fileslist.filter(item => item.uid !== filesinfo.uid);
            // 删除文件
            if (filesinfo && !filesinfo.lastModified) {
              FileDelete(filesinfo.uid).then(res => {
                if (res.code === 200) {
                  ChangeFiles({ arr: newfilelist, ischange: true });
                }
              });
            } else {
              message.success('已中止文件上传');
              setShowIcon(true);
              getUploadStatus(false);
            }
            return resolve()
          }

          if (err) {
            return reject(err)
          }

          return []
        })
      }).catch(() => {
        return new Promise((resolve) => {
          return resolve(false)
        })
      })
    },
  };

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <SysDict
        typeid='576'
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="服务绩效编号">
            {getFieldDecorator('assessNo', {
              initialValue: register.assessNo,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="发生时间">
            {getFieldDecorator('assessTime', {
              rules: [
                {
                  required,
                  message: '请选择发生时间',
                },
              ],
              initialValue: moment(register.assessTime),
            })(
              <DatePicker
                disabled={search || noEdit}
                showTime
                allowClear={false}
                format="YYYY-MM-DD HH:mm"
              />
              // <div>
              //   <DatePicker
              //     disabled={noEdit}
              //     defaultValue={moment(register.assessTime)}
              //     showTime
              //     allowClear={false}
              //     format="YYYY-MM-DD HH:mm:ss"
              //     onChange={onChange}
              //   />
              // </div>
            )}
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
              initialValue: register.provider?.providerName || (register && register.providerName)
            })(
              <AutoComplete
                getPopupContainer={e => e.parentNode}
                disabled={search || noEdit}
                dataSource={disableduser}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 600 }}
                onSelect={(v, opt) => handleDisableduser(v, opt, 'provider')}
              >
                <Search
                  placeholder="可输入服务商名称搜索"
                  onSearch={values => SearchDisableduser(values, 'provider')}
                  allowClear
                />
              </AutoComplete>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="服务商">
            {getFieldDecorator('providerId', {
              rules: [
                {
                  required,
                  message: '请输入服务商',
                },
              ],
              initialValue: register.providerId,
            })(<Input />)}
          </Form.Item>
        </Col>

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
                getPopupContainer={e => e.parentNode}
                disabled={search || noEdit}
                placeholder="请选择"
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 600 }}
                onChange={(value, option) => handleChange(value, option, 'contract')}
                onFocus={() => handleFocus('contract')}
              >
                {contractArr.map(obj => [
                  <Option key={obj.contractName} value={obj.id}>
                    <div className={styles.disableuser}>
                      {/* <span>{obj.contractNo}</span> */}
                      <span>{obj.contractName}</span>
                    </div>
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="关联合同名称">
            {getFieldDecorator('contractName', {
              initialValue: register.contractName,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="责任人">
            {getFieldDecorator('directorNamesign', {
              rules: [
                {
                  required,
                  message: '请选择责任人',
                },
              ],
              initialValue: register.directorName,
            })(
              <AutoComplete
                getPopupContainer={e => e.parentNode}
                disabled={search || noEdit}
                dataSource={directoruser}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 600 }}
                onSelect={(v, opt) => handleDisableduser(v, opt, 'director')}
              >
                <Search
                  placeholder="可输入人名称搜索"
                  onSearch={values => SearchDisableduser(values, 'director')}
                  // onSearch={values => getpersonLiable(values)}
                  allowClear
                />
              </AutoComplete>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="责任人id">
            {getFieldDecorator('directorName', {
              initialValue: register.directorName,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="责任人id">
            {getFieldDecorator('directorId', {
              initialValue: register.directorId,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="评分细则名称">
            {getFieldDecorator('score', {
              rules: [
                {
                  required,
                  message: '请选择评分细则名称',
                },
              ],
              initialValue: register.score?.scoreName ? register.score.scoreName : register.score,
            })(
              <AutoComplete
                getPopupContainer={e => e.parentNode}
                disabled={search || noEdit}
                dataSource={scorenameList}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 600 }}
                onSelect={(v, opt) => handleDisableduser(v, opt, 'score')}
              >
                <Search
                  placeholder="可输入评分细则名称搜索"
                  onSearch={values => SearchDisableduser(values, 'score')}
                  allowClear
                />
              </AutoComplete>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="评分细则名称">
            {getFieldDecorator('scoreId', {
              initialValue: register.scoreId,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="考核类型">
            {getFieldDecorator('assessType', {
              initialValue: (register && register.assessType) ? (register.assessType === '1' ? '功能开发' : '系统运维') : '',
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="考核对象">
            {getFieldDecorator('assessObject', {
              rules: [
                {
                  required,
                  message: '请选择考核对象',
                },
              ],
              initialValue: register.assessObject,
            })(
              <Select
                placeholder="请选择"
                disabled={search || noEdit}
                getPopupContainer={e => e.parentNode}
              >
                {(assessmentObject || []).map(obj => [
                  <Option key={obj.dict_code} value={obj.dict_code}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="考核来源">
            {getFieldDecorator('source', {
              rules: [
                {
                  required,
                  message: '请选择考核来源',
                },
              ],
              initialValue: register.source,
            })(
              <Select
                placeholder="请选择"
                disabled={search || noEdit}
                getPopupContainer={e => e.parentNode}
              >
                {(assessmentSource || []).map(obj => [
                  <Option key={obj.dict_code} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="考核内容说明" {...forminladeLayout}>
            {getFieldDecorator('assessContent', {
              rules: [
                {
                  required,
                  message: '请输入考核内容说明',
                },
              ],
              initialValue: register.assessContent,
            })(
              <TextArea
                disabled={search || noEdit}
                autoSize={{ minRows: 3 }}
                placeholder="请控制字数在500字以内"
                maxLength="500"
              />,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="一级指标">
            {getFieldDecorator('target1Name', {
              rules: [
                {
                  required,
                  message: '请输入一级指标',
                },
              ],
              initialValue: register.target1Name,
            })(
              <Select
                getPopupContainer={e => e.parentNode}
                disabled={search || noEdit}
                onChange={(value, option) => handleChange(value, option, 'target1Name')}
                onFocus={() => handleFocus('one')}
                placeholder="请选择"
              >
                {target1.map(obj => [
                  <Option key={obj.id} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="一级指标id">
            {getFieldDecorator('target1Id', {
              initialValue: register.target1Id,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="二级指标">
            {getFieldDecorator('target2Name', {
              rules: [
                {
                  required,
                  message: '请输入二级指标',
                },
              ],
              initialValue: register.target2Name,
            })(
              <Select
                getPopupContainer={e => e.parentNode}
                disabled={search || noEdit}
                onChange={(value, option) => handleChange(value, option, 'target2Name')}
                onFocus={() => handleFocus('two')}
                placeholder="请选择"
              >
                {target2.map(obj => [
                  <Option key={obj.id} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label=" 二级指标">
            {getFieldDecorator('target2Id', {
              initialValue: register.target2Id,
            })(<Input />)}
          </Form.Item>
        </Col>

        {
          !noEdit && (
            <Col span={24}>
              <Form.Item label="详细条款" {...forminladeLayout}>
                {getFieldDecorator('clauseId', {
                  rules: [
                    {
                      required,
                      message: '请输入详细条款',
                    },
                  ],
                  initialValue: register.clauseId,
                })(
                  <Select
                    getPopupContainer={e => e.parentNode}
                    disabled={search || noEdit}
                    onChange={(value, option) => handleChange(value, option, 'clause')}
                    onFocus={() => handleFocus('clause')}
                  >
                    {(clauseList.records || []).map(obj => [
                      <Option key={obj.detailed} value={obj.id}>
                        <div className={styles.disableuser}>
                          <span>{obj.orderNo}</span>
                          <span>{obj.detailed}</span>
                          <span>{obj.calc}</span>
                          <span>{obj.scoreValue}</span>
                          <span>{obj.sources}</span>
                        </div>
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )
        }

        {
          noEdit && (
            <Col span={24}>
              <Form.Item label=" 详细条款" {...forminladeLayout}>
                {getFieldDecorator('clause', {
                  initialValue: (register && register.clause) ? `${register.clause.orderNo}${'\xa0'}${'\xa0'}${'\xa0'}${'\xa0'}${register.clause.detailed}${'\xa0'}${'\xa0'}${'\xa0'}${'\xa0'}${register.clause.calc === 'ADD' ? '加分项' : '扣分项'}${'\xa0'}${'\xa0'}${'\xa0'}${'\xa0'}${register.clause.scoreValue}${'\xa0'}${'\xa0'}${'\xa0'}${'\xa0'}${register.clause.sources}` : '',
                })(
                  <Input disabled className={styles.disableuser} />
                )}
              </Form.Item>
            </Col>
          )
        }

        <Col span={24} style={{ display: 'none' }}>
          <Form.Item label="详细条款" {...forminladeLayout}>
            {getFieldDecorator('clauseName', {
              initialValue: register.clauseName,
            })(<Input />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="考核得分">
            {getFieldDecorator('assessValue', {
              rules: [
                {
                  required,
                  message: '请输入考核得分',
                },
              ],
              initialValue: register.assessValue,
            })(<Input disabled={search || noEdit} type="number" />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="考核状态">
            {getFieldDecorator('status', {
              initialValue: register.status,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        {
          !noEdit && (
            <Col span={24}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                <div
                  onMouseDown={() => {
                    setBanOpenFileDialog(true);
                    validateFields((err) => {
                      if (err) {
                        message.error('请先填写页面中的必填项再上传或者删除附件哦');
                      } else {
                        setBanOpenFileDialog(false)
                      }
                    })
                  }}
                >
                  <Upload {...uploadprops}>
                    <Button type="primary">
                      <DownloadOutlined /> 上传附件
                    </Button>
                    {filetype && filetype.length > 0 && (
                      <span style={{ color: '#ccc', lineHeight: '20px', paddingLeft: 16 }}>
                        1、仅能上传{filetype.join('，')}类型文件；2、最多可上传20个文件；3、附件名称最长100个字符；
                      </span>
                    )}
                  </Upload>
                </div>
              </Form.Item>
            </Col>
          )
        }

        {noEdit && (
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {register.attachment && <Downloadfile files={register.attachment} />}
            </Form.Item>
          </Col>
        )}

        <Col span={8}>
          <Form.Item label="登记人">
            {getFieldDecorator('registerName', {
              initialValue: register.registerName || userinfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="登记人">
            {getFieldDecorator('register', {
              initialValue: register.register || userinfo.userauthorityid,
            })(<Input disabled={search || noEdit} />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="登记时间">
            {getFieldDecorator('applyTime', {
              initialValue: moment(register.applyTime),
            })(<DatePicker
              disabled
              showTime
              format="YYYY-MM-DD HH:mm"
            />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

Register.defaultProps = {
  register: {
    assessNo: '',
    provider: '',
    providerId: '',
    target1Name: '',
    target2Name: '',
    contract: '',
    contractId: '',
    directorName: '',
    directorId: '',
    score: '',
    scoreId: '',
    assessType: '',
    assessContent: '',
    target1Id: '',
    target2Id: '',
    clauseId: '',
    clauseName: '',
    assessValue: '',
    status: '',
    remark: '',
    attachment: '',
    registerName: '',
    clause: {
      orderNo: '',
      detailed: '',
      calc: '',
      scoreValue: '',
      sources: ''
    },
    register: sessionStorage.getItem('userauthorityid')
  },
};

export default Form.create({})(Register);
