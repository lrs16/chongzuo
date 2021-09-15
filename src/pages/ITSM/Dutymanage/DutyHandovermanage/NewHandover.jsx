import React, {
    // useState, useEffect, 
    useRef
} from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card } from 'antd';
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
function NewHandover(props) {
    const pagetitle = props.route.name;
    const {
        // dispatch, 
        // location, 
        // tabnew, 
        tabdata
    } = props;


    const ContentRef = useRef(null);

    const handleSave = () => { // 保存
        const values = ContentRef.current.getVal();
        console.log(values);
        // ContentRef.current.Forms((err) => {

        // })
    }

    const handleclose = () => { // 返回
        router.push({
            pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover`,
            query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
        });
    };

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

    const extrabutton = (
        <>
            <Button type="danger" ghost style={{ marginRight: 8 }}>删除</Button >
            <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSave()}
            >
                导出WORD
            </Button>
            <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSave()}
            >
                保存
            </Button>
            <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSave()}
            >
                确认交班
            </Button>
            <Button onClick={handleclose}>关闭</Button>
        </>
    )

    return (
        <PageHeaderWrapper title={pagetitle} extra={extrabutton}>
            <Card>
              <Registrat forminladeLayout={forminladeLayout}/>
            </Card>
        </PageHeaderWrapper>
    );
}

export default connect(({ viewcache }) => ({
    tabnew: viewcache.tabnew,
    tabdata: viewcache.tabdata,
}))(NewHandover);