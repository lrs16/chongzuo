import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { AlertTwoTone } from '@ant-design/icons';
import moment from 'moment';
import {
  Drawer,
  Button,
  Table,
  Tooltip,
  Popconfirm
} from 'antd';

const columns = [
  {
    title: '需求编号',
    dataIndex: 'demandId',
    key: 'demandId',
    with: 180,
    fixed: 'left',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/demandmanage/query/details`,
          query: {
            taskId: record.taskId,
            mainId: record.processId,
            taskName: record.taskName,
            No: text,
          },
        });
      };
      return (<a onClick={() => handleClick(text, record)}>{text}</a>);
    },
  },
  {
    title: '当前处理环节',
    dataIndex: 'flowNodeName',
    key: 'flowNodeName',
    width: 200,
    onCell: () => {
      return {
        style: {
          maxWidth: 200,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '超时状态',
    dataIndex: 'timeoutStatus',
    key: 'timeoutStatus',
    width: 150,
    onCell: () => {
      return {
        style: {
          maxWidth: 150,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => {
      const blubnap = new Map([
        ['未超时', <AlertTwoTone twoToneColor="#52C41A" />],
        ['即将超时', <AlertTwoTone twoToneColor="orange" />],
        ['已超时', <AlertTwoTone twoToneColor="red" />]
      ]);
      const colormap = new Map([
        ['未超时', '#52C41A'],
        ['即将超时', 'orange'],
        ['已超时', 'red']
      ]);
      return (
        <><span style={{ fontSize: '1.4em', marginRight: 8 }}>{blubnap.get(text)}</span>
          <span style={{ color: colormap.get(text) }}>{text}</span>
        </>
      )
    }
  },
  {
    title: '功能模块',
    dataIndex: 'functionalModule',
    key: 'functionalModule',
    with: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '需求标题',
    dataIndex: 'title',
    key: 'title',
    with: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '需求原因',
    dataIndex: 'reason',
    key: 'reason',
    with: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '需求描述',
    dataIndex: 'detail',
    key: 'detail',
    with: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '申请人单位',
    dataIndex: 'proposingUnit',
    key: 'proposingUnit',
    with: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '申请人',
    dataIndex: 'proposer',
    key: 'proposer',
    with: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '联系电话',
    dataIndex: 'proposerPhone',
    key: 'proposerPhone',
    with: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '申请时间',
    dataIndex: 'registerTime',
    key: 'registerTime',
    with: 250,
  },
  {
    title: '业务科室领导审核结果',
    dataIndex: 'checkOneResult',
    key: 'checkOneResult',
    with: 400,
    onCell: () => {
      return {
        style: {
          maxWidth: 400,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '业务科室领导审核人',
    dataIndex: 'checkOneUserName',
    key: 'checkOneUserName',
    with: 350,
    onCell: () => {
      return {
        style: {
          maxWidth: 350,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '业务科室领导审核时间',
    dataIndex: 'checkThreeReviewTime',
    key: 'checkThreeReviewTime',
    with: 430,
    onCell: () => {
      return {
        style: {
          maxWidth: 430,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '期望完成时间',
    dataIndex: 'completeTime',
    key: 'completeTime',
    with: 250,
    onCell: () => {
      return {
        style: {
          maxWidth: 250,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '开发负责人',
    dataIndex: 'checkTwoDevelopmentLead',
    key: 'checkTwoDevelopmentLead',
    with: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '预计开发完成时间',
    dataIndex: 'devFinishTime',
    key: 'devFinishTime',
    with: 350,
    onCell: () => {
      return {
        style: {
          maxWidth: 350,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '预计发布时间',
    dataIndex: 'releaseTime',
    key: 'releaseTime',
    with: 250,
    onCell: () => {
      return {
        style: {
          maxWidth: 250,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '需求完成进度',
    dataIndex: 'developSchedule',
    key: 'developSchedule',
    with: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
  {
    title: '需求登记人员确认结果',
    dataIndex: 'confirmTwoResult',
    key: 'confirmTwoResult',
    with: 430,
    onCell: () => {
      return {
        style: {
          maxWidth: 430,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text} getPopupContainer={() => document.querySelector('.ant-drawer-body')}>{text}</Tooltip>
  },
];

function ChartDrawer(props) {
  const {
    visible,
    ChangeVisible,
    drawerdata,
    dispatch,
    demandquerylists,
    list, // 工单超时列表
    loading
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  // const [selectedRowKeys, setSelectedKeys] = useState([]);

  // const rowSelection = {
  //   onChange: index => {
  //     setSelectedKeys([...index])
  //   }
  // };

  const searchdata = (value, page, size) => {
    const pointdate = value.date && Array.from(value.date).length === 2;
    switch (value.staticName) {
      // Card 需求工单情况
      case '需求总数':
      case 'sumtotal':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            pageNum: page,
            pageSize: size,
            model: '工单情况',
            type: 'all',
            begin: value.time1,
            end: value.time2
          }
        })
        break;
      case '已开发':
      case '未开发':
      case '需求取消':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            pageNum: page,
            pageSize: size,
            model: '工单情况',
            type: value.staticName,
            begin: value.time1,
            end: value.time2
          }
        })
        break;
      // 需求工单总情况(饼+线)1
      case '需求工单总情况':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            pageNum: page,
            pageSize: size,
            model: '工单情况',
            type: value.type,
            begin: value.time1,
            end: value.time2
          }
        })
        break;
      case '需求工单总情况线':
        if (value.timeType === 'Y') {
          dispatch({
            type: 'demandquery/getdemandstatidetailData',
            payload: {
              model: '工单情况',
              type: value.name === '总数' ? 'all' : value.name,
              begin: moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: moment(value.date).endOf('month').format('YYYY-MM-DD 23:59:59'),
              pageNum: page,
              pageSize: size,
            }
          })
        } else {
          dispatch({
            type: 'demandquery/getdemandstatidetailData',
            payload: {
              model: '工单情况',
              type: value.name === '总数' ? 'all' : value.name,
              begin: pointdate === true ? moment(value.time1).format(`YYYY-MM-DD ${value.date}:00:00`) : moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: pointdate === true ? moment(value.time2).format(`YYYY-MM-DD ${value.date}:59:59`) : moment(value.date).format('YYYY-MM-DD 23:59:59'),
              pageNum: page,
              pageSize: size,
            }
          })
        }
        break;
      // module 功能模块(饼+线)2
      case '功能模块情况':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '功能模块',
            pageNum: page,
            pageSize: size,
          }
        })
        break;
      case '功能模块情况线':
        if (value.timeType === 'Y') {
          dispatch({
            type: 'demandquery/getdemandstatidetailData',
            payload: {
              type: value.name === '总数' ? 'all' : value.name,
              begin: moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: moment(value.date).endOf('month').format('YYYY-MM-DD 23:59:59'),
              pageNum: page,
              pageSize: size,
              model: '功能模块',
            }
          })
        } else {
          dispatch({
            type: 'demandquery/getdemandstatidetailData',
            payload: {
              type: value.name === '总数' ? 'all' : value.name,
              begin: pointdate === true ? moment(value.time1).format(`YYYY-MM-DD ${value.date}:00:00`) : moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: pointdate === true ? moment(value.time2).format(`YYYY-MM-DD ${value.date}:59:59`) : moment(value.date).format('YYYY-MM-DD 23:59:59'),
              pageNum: page,
              pageSize: size,
              model: '功能模块',
            }
          })
        }
        break;
      // 需求类型统计分析（饼+线）3
      case '需求类型统计分析':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '需求类型',
            pageNum: page,
            pageSize: size,
          }
        })
        break;
      case '需求类型统计分析线':
        if (value.timeType === 'Y') {
          dispatch({
            type: 'demandquery/getdemandstatidetailData',
            payload: {
              type: value.name === '总数' ? 'all' : value.name,
              begin: moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: moment(value.date).endOf('month').format('YYYY-MM-DD 23:59:59'),
              model: '需求类型',
              pageNum: page,
              pageSize: size,
            }
          })
        } else {
          dispatch({
            type: 'demandquery/getdemandstatidetailData',
            payload: {
              type: value.name === '总数' ? 'all' : value.name,
              begin: pointdate === true ? moment(value.time1).format(`YYYY-MM-DD ${value.date}:00:00`) : moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: pointdate === true ? moment(value.time2).format(`YYYY-MM-DD ${value.date}:59:59`) : moment(value.date).format('YYYY-MM-DD 23:59:59'),
              model: '需求类型',
              pageNum: page,
              pageSize: size,
            }
          })
        }
        break;
      // 需求工单超时情况（饼）
      case '需求工单超时情况':
        dispatch({
          type: 'demandquery/querylist',
          payload: {
            completeStatus: value.type,
            endTime: value.time2,
            startTime: value.time1,
            limit: size,
            page
          }
        })
        break;
      case '需求申请人':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '申请人',
            pageNum: page,
            pageSize: size,
          }
        })
        break;
      case '需求处理人':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '处理人',
            pageNum: page,
            pageSize: size,
          }
        })
        break;
      case '需求申请单位':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '申请单位',
            pageNum: page,
            pageSize: size,
          }
        })
        break;
      case '需求处理单位':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '处理单位',
            pageNum: page,
            pageSize: size,
          }
        })
        break;
      // 饼图总数
      case 'moduletotal':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            type: 'all',
            begin: value.time1,
            end: value.time2,
            model: '功能模块',
            pageNum: page,
            pageSize: size,
          }
        })
        break;
      case 'typetotal':
        dispatch({
          type: 'demandquery/getdemandstatidetailData',
          payload: {
            type: 'all',
            begin: value.time1,
            end: value.time2,
            model: '需求类型',
            pageNum: page,
            pageSize: size,
          }
        })
        break;
      case 'timeouttotal': // 工单超时总数
        dispatch({
          type: 'demandquery/querylist',
          payload: {
            completeStatus: '未处理',
            endTime: value.time2,
            startTime: value.time1,
            limit: size,
            page
          }
        })
        break;
      default:
        break;
    }
  };

  // 获取数据
  useEffect(() => {
    if (drawerdata)
      searchdata(drawerdata, paginations.current, paginations.pageSize);
  }, [drawerdata]);

  const onShowSizeChange = (page, size) => {
    searchdata(drawerdata, 1, size);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: size,
    });
  };

  const changePage = page => {
    searchdata(drawerdata, page, paginations.pageSize);
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: demandquerylists.total || list.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  // 取消
  const hanldleCancel = () => {
    ChangeVisible(false);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: 15
    });
  };

  //  下载 /导出功能
  const download = value => {
    const pointdate = value.date && Array.from(value.date).length === 2;
    switch (value.staticName) {
      // Card 需求工单情况
      case '需求总数':
      case 'sumtotal':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            model: '工单情况',
            type: 'all',
            begin: value.time1,
            end: value.time2
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '已开发':
      case '未开发':
      case '需求取消':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            model: '工单情况',
            type: value.staticName,
            begin: value.time1,
            end: value.time2
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      // 需求工单总情况(饼+线)1
      case '需求工单总情况':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            model: '工单情况',
            type: value.type,
            begin: value.time1,
            end: value.time2
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '需求工单总情况线':
        if (value.timeType === 'Y') {
          dispatch({
            type: 'demandquery/statidetailDownload',
            payload: {
              model: '工单情况',
              type: value.name === '总数' ? 'all' : value.name,
              begin: moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: moment(value.date).endOf('month').format('YYYY-MM-DD 23:59:59'),
            }
          }).then(res => {
            const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        } else {
          dispatch({
            type: 'demandquery/statidetailDownload',
            payload: {
              model: '工单情况',
              type: value.name === '总数' ? 'all' : value.name,
              begin: pointdate === true ? moment(value.time1).format(`YYYY-MM-DD ${value.date}:00:00`) : moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: pointdate === true ? moment(value.time2).format(`YYYY-MM-DD ${value.date}:59:59`) : moment(value.date).format('YYYY-MM-DD 23:59:59'),
            }
          }).then(res => {
            const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        }
        break;
      // module 功能模块(饼+线)2
      case '功能模块情况':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '功能模块',
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '功能模块情况线':
        if (value.timeType === 'Y') {
          dispatch({
            type: 'demandquery/statidetailDownload',
            payload: {
              type: value.name === '总数' ? 'all' : value.name,
              begin: moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: moment(value.date).endOf('month').format('YYYY-MM-DD 23:59:59'),
              model: '功能模块',
            }
          }).then(res => {
            const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        } else {
          dispatch({
            type: 'demandquery/statidetailDownload',
            payload: {
              type: value.name === '总数' ? 'all' : value.name,
              begin: pointdate === true ? moment(value.time1).format(`YYYY-MM-DD ${value.date}:00:00`) : moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: pointdate === true ? moment(value.time2).format(`YYYY-MM-DD ${value.date}:59:59`) : moment(value.date).format('YYYY-MM-DD 23:59:59'),
              model: '功能模块',
            }
          }).then(res => {
            const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        }
        break;
      // 需求类型统计分析（饼+线）3
      case '需求类型统计分析':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '需求类型',
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '需求类型统计分析线':
        if (value.timeType === 'Y') {
          dispatch({
            type: 'demandquery/statidetailDownload',
            payload: {
              type: value.name === '总数' ? 'all' : value.name,
              begin: moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: moment(value.date).endOf('month').format('YYYY-MM-DD 23:59:59'),
              model: '需求类型',
            }
          }).then(res => {
            const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        } else {
          dispatch({
            type: 'demandquery/statidetailDownload',
            payload: {
              type: value.name === '总数' ? 'all' : value.name,
              begin: pointdate === true ? moment(value.time1).format(`YYYY-MM-DD ${value.date}:00:00`) : moment(value.date).format('YYYY-MM-DD 00:00:00'),
              end: pointdate === true ? moment(value.time2).format(`YYYY-MM-DD ${value.date}:59:59`) : moment(value.date).format('YYYY-MM-DD 23:59:59'),
              model: '需求类型',
            }
          }).then(res => {
            const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        }
        break;
      // 需求工单超时情况（饼）
      case '需求工单超时情况':
        dispatch({
          type: 'demandquery/download',
          payload: {
            completeStatus: value.type,
            endTime: value.time2,
            startTime: value.time1,
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '需求申请人':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '申请人',
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '需求处理人':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '处理人',
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '需求申请单位':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '申请单位',
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '需求处理单位':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            type: value.type,
            begin: value.time1,
            end: value.time2,
            model: '处理单位',
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      // 饼图总数
      case 'moduletotal':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            type: 'all',
            begin: value.time1,
            end: value.time2,
            model: '功能模块',
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case 'typetotal':
        dispatch({
          type: 'demandquery/statidetailDownload',
          payload: {
            type: 'all',
            begin: value.time1,
            end: value.time2,
            model: '需求类型',
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case 'timeouttotal':
        dispatch({
          type: 'demandquery/download',
          payload: {
            completeStatus: '未处理',
            endTime: value.time2,
            startTime: value.time1,
          }
        }).then(res => {
          const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      default:
        break;
    }
  };

  const setTableHeight = () => {
    let height = 500;
    const clientHeight = window.document?.body?.clientHeight || 500;
    height = clientHeight - 400
    return height;
  };

  return (
    <>
      <Drawer
        visible={visible}
        width={1500}
        title={drawerdata.drawtitle}
        onClose={hanldleCancel}
        bodyStyle={{ paddingBottom: 60 }}
        destroyOnClose
      >
        <div style={{ marginBottom: 24 }}>
          <Popconfirm title="确定导出数据？" onConfirm={() => download(drawerdata)}>
            <Button
              type="primary">
              导出数据
            </Button>
          </Popconfirm>
        </div>
        <Table
          columns={columns}
          loading={loading}
          dataSource={demandquerylists.rows || list.rows || []}
          rowKey={record => record.id}
          pagination={pagination}
          // rowSelection={rowSelection}
          scroll={{ x: 3500, y: setTableHeight() }}
        />
      </Drawer>
    </>
  )
}

export default connect(({ demandquery, loading }) => ({
  demandquerylists: demandquery.demandquerylists, // 工单数
  list: demandquery.list, // 工单超时数据
  loading: loading.models.demandquery,
}))(ChartDrawer);