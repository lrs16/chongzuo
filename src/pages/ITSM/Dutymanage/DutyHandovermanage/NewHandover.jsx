import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Button,
  Popconfirm,
  message,
  Form,
} from 'antd';
import Reasonregression from '../../Problemmanage/components/Reasonregression';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import Registrat from './components/Registrat';

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};


let shift;
let succession;
let shiftName;
function NewHandover(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    location,
    location: { query: { id, type, addtab } },
    tabdata,
    loading,
    currentUserarr,
    shiftGrouparr,
    logbookIddetail,
    shiftSearcharr,
    searchUsersarr
  } = props;

  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [modalrollback, setModalRollBack] = useState(false);   // 回退信息modle

  const ContentRef = useRef(null);

  const formDetail = () => {
    dispatch({
      type: 'shifthandover/fetchlogbookId',
      payload: id
    })
  }

  useEffect(() => {
    if(location.state && location.state.reset && id) {
      formDetail()
    }
  },[location.state])

  const handleSave = (params) => { // 保存
    const values = ContentRef.current.getVal();
    if ((values.dutyBeginTime && !values.dutyEndTime)) {
      message.error('请选择完整时间')
    }
    ContentRef.current.Forms((err) => {
      if (!err) {
        if (values.dutyBeginTime.valueOf() > values.dutyEndTime.valueOf()) {
          message.error('开始时间必须小于结束时间');
          return false
        }


        return dispatch({
          type: 'shifthandover/fetchlogbookSave',
          payload: {
            id,
            ...values,
            dutyBeginTime: moment(values.dutyBeginTime).format('YYYY-MM-DD HH:mm:ss'),
            dutyEndTime: moment(values.dutyEndTime).format('YYYY-MM-DD HH:mm:ss'),
            registerTime: moment(values.registerTime).format('YYYY-MM-DD HH:mm:ss'),
            handoverTime: moment(values.handoverTime).format('YYYY-MM-DD HH:mm:ss'),
            receiveTime: '',
            attachment: files.ischange ? JSON.stringify(files.arr) : '',
            handoverItems:values.handoverItems ? values.handoverItems.toString():''
          }
        }).then(res => {
          if (res.code === 200) {
            switch (params) {
              case 'logbookTransfer':
                handlelogbookTransfer();
                break;
              case 'logbookReceive':
                handlelogbookReceive();
                break;
              case undefined:
                formDetail();
                break;
              default:
                break;
            }
            message.info(res.msg)
          }
        })
      }

    })
  }

  useEffect(() => {
    if (files.ischange) {
      handleSave()
    }
  }, [files])

  const handleclose = () => { // 返回
    router.push({
      pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover`,
      query: { pathpush: true },
      state: { cach: false }
    });
  };

  useEffect(() => {
    dispatch({
      type: 'shifthandover/fetchcurrentUser'
    })

    if (id) {
      formDetail()
    } else {
      dispatch({
        type: 'shifthandover/clearlogbookIddetail'
      })
    }
  }, [id])

  useEffect(() => {
    if (currentUserarr && currentUserarr.groupId) {
      dispatch({
        type: 'shifthandover/fetchshiftGroup',
        payload: { groupId: currentUserarr.groupId }
      })
    }
  }, [currentUserarr])

  if (shiftGrouparr && (shiftGrouparr.length) > 0) {
    shift = (shiftGrouparr).map(item => {
      return {
        beginTime: item.beginTime,
        endTime: item.endTime,
        groupName: item.groupName,
        groupId: item.groupId,
        shiftName: item.shiftName,
        id: item.id,
      }
    })
  }

  useEffect(() => {
    if (currentUserarr && currentUserarr.groupId) {
      dispatch({
        type: 'dutyandtypesetting/staffSearch',
        payload: {
          groupId: currentUserarr.groupId,
          current: 1,
          size: 1000
        }
      })
    }
  }, [currentUserarr])

  if (searchUsersarr && searchUsersarr.records && (searchUsersarr.records).length > 0) {
    succession = (searchUsersarr.records).map(item => {
      return {
        id: item.id,
        heirName: item.staffName,
        userId: item.userId,
      }
    })
  }

  if (shiftSearcharr && shiftSearcharr.records && (shiftSearcharr.records.length) > 0) {
    shiftName = (shiftSearcharr.records).map(item => {
      return {
        shiftName: item.shiftName,
        id: item.id
      }
    })
  }

  // // 重置表单信息
  // useEffect(() => {
  //     if (tabnew) {
  //         ContentRef.current.resetVal();
  //     }
  // }, [tabnew]);

  // // 获取页签信息
  // useEffect(() => {
  //     if (location.state && location.state.cache) {
  //         const values = ContentRef.current.getVal();
  //         dispatch({
  //             type: 'viewcache/gettabstate',
  //             payload: {
  //                 cacheinfo: { ...values },
  //                 tabid: sessionStorage.getItem('tabid')
  //             },
  //         });
  //     }
  // }, [location])
  const handleDelete = () => {
    return dispatch({
      type: 'shifthandover/fetchlogbookDel',
      payload: { id }
    }).then(res => {
      if (res.code === 200) {
        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/handoverdetail`,
          query: {
            mainId: id,
            closetab: true,
          },
        });

        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover`,
          query: { pathpush: true },
          state: { cache: false },
        });
      } else {
        message.error(res.msg);
      }
    })
  }

  const handlelogbookTransfer = () => {
    return dispatch({
      type: 'shifthandover/fetchlogbookTransfer',
      payload: { id }
    }).then(res => {
      if (res.code === 200) {
        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/handoverdetail`,
          query: {
            mainId: id,
            closetab: true,
          },
        });

        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover`,
          query: { pathpush: true },
          state: { cache: false },
        });
        message.info(res.msg);
      } else {
        message.error(res.msg);
      }
    })
  }

  const logbookTransfer = () => {
    handleSave('logbookTransfer');
  }

  const handlelogbookReceive = () => {
    const values = ContentRef.current.getVal();
    return dispatch({
      type: 'shifthandover/fetchlogbookReceive',
      payload: { id, remark: values.receiveRemark }
    }).then(res => {
      if (res.code === 200) {
        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/handoverdetail`,
          query: {
            mainId: id,
            closetab: true,
          },
        });

        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover`,
          query: { pathpush: true },
          state: { cache: false },
        });
        message.info(res.msg);
      } else {
        message.error(res.msg);
      }
    })
  }

  const logbookReceive = () => {
    handleSave('logbookReceive');
  }

  const download = () => {
    dispatch({
      type: 'shifthandover/fetchlogbookWord',
      payload: { id },
    }).then(res => {
      const filename = '下载.doc';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const handleBack = () => {
    setModalRollBack(true)
  }

  const reasonSubmit = (reason) => {
    dispatch({
      type: 'shifthandover/fetchfallback',
      payload: {
        id,
        reason: reason.backReason
      }
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/handoverdetail`,
          query: {
            mainId: id,
            closetab: true,
          },
        });

        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover`,
          query: { pathpush: true },
          state: { cache: false },
        });
      }
    })
  }

  const extrabutton = (
    <>
      {
        id && (logbookIddetail.handoverStatus === '未交接') && (
          <Button
            type="danger"
            ghost
            style={{ marginRight: 8 }}
            onClick={handleDelete}
          >
            删除
          </Button >
        )
      }

      {
        id && logbookIddetail.handoverStatus === '待接班' && type === 'listButton' && (
          <Button
            type="danger"
            ghost
            style={{ marginRight: 8 }}
            onClick={handleBack}
          >
            回退
          </Button >
        )
      }

      {
        id && (
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => download()}
          >
            导出WORD
          </Button>
        )
      }

      {
        type !== 'search' && (
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleSave()}
          >
            保存
          </Button>
        )
      }

      {
        id && (logbookIddetail && logbookIddetail.handoverStatus === '未交接' || logbookIddetail.handoverStatus === '已退回') && (
          <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => logbookTransfer()}
            >
              确认交班
            </Button>
        )
      }

      {
        id && logbookIddetail.handoverStatus === '待接班' && type === 'listButton' && (
          <Popconfirm
          title='接班后不可回退，确认是否接班？'
          onConfirm={() => logbookReceive()}
        >
        <Button
            type="primary"
            style={{ marginRight: 8 }}
            // onClick={() => logbookReceive()}
          >
            确认接班
          </Button>
        </Popconfirm>
        )
      }
      <Button onClick={handleclose}>返回</Button>
    </>
  )

  return (
    <PageHeaderWrapper title={pagetitle} extra={extrabutton}>
      {
        loading === false && (
          <Registrat
            forminladeLayout={forminladeLayout}
            files={(logbookIddetail && logbookIddetail.attachment) ? JSON.parse(logbookIddetail.attachment) : []}
            wrappedComponentRef={ContentRef}
            currentUserarr={currentUserarr}
            formrecord={id ? logbookIddetail : {}}
            statue={((logbookIddetail && logbookIddetail.handoverStatus === '待接班' && !addtab) || type === 'search') ? true : false}
            shiftinfo={shift}
            successioninfo={succession}
            shiftNameinfo={shiftName}
            ChangeFiles={newvalue => {
              setFiles(newvalue);
            }}
            type={type}
          />
        )
      }

      <Reasonregression
        title="填写回退意见"
        visible={modalrollback}
        ChangeVisible={v => setModalRollBack(v)}
        rollbackSubmit={v => reasonSubmit(v)}
      />
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ shifthandover, dutyandtypesetting, shiftsandholidays, loading }) => ({
    currentUserarr: shifthandover.currentUserarr,
    searchUsersarr: dutyandtypesetting.searchUsersarr,
    shiftSearcharr: shiftsandholidays.shiftSearcharr,
    shiftGrouparr: shifthandover.shiftGrouparr,
    logbookIddetail: shifthandover.logbookIddetail,
    loading: loading.models.shifthandover
  }))(NewHandover),
);