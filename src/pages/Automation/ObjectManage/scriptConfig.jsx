/* eslint-disable react-hooks/rules-of-hooks */
import React, {
    // useEffect,
    useState
} from 'react';
import { connect } from 'dva';
import { Form, } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import LocalScriptList from './components/LocalScriptList';
import SystemScriptList from './components/SystemScriptList';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};

const tabList = [
    {
        key: 'systemscript',
        tab: '系统脚本',
    },
    {
        key: 'localscript',
        tab: '本地脚本',
    },
];

function scriptConfig(props) {
    const pagetitle = props.route.name;
    const {
        loading,
        dispatch,
        location,
    } = props;

    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [tabActivekey, settabActivekey] = useState('systemscript'); // 打开标签

    const handleTabChange = key => {
        settabActivekey(key);
    };

    // 数据字典取下拉值
    const getTypebyId = key => {
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    const scripttypemap = getTypebyId('1429784928986779649'); // 脚本类型
    const scriptsourcemap = getTypebyId('1429785542332436481'); // 脚本来源
    const scriptstatusmap = getTypebyId('1429787254489272321'); // 脚本状态

    return (
        <PageHeaderWrapper
            title={pagetitle}
            tabList={tabList}
            tabActiveKey={tabActivekey}
            onTabChange={handleTabChange}
        >
            <DictLower
                typeid="1429784773575233537"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            {tabActivekey === 'systemscript' && ( // 系统脚本
                <SystemScriptList
                    scriptsourcemap={scriptsourcemap}
                    scriptstatusmap={scriptstatusmap}
                    scripttypemap={scripttypemap}
                    formItemLayout={formItemLayout}
                    dispatch={dispatch}
                    location={location}
                />
            )}
            {tabActivekey === 'localscript' && ( // 本地脚本
                <LocalScriptList
                    dispatch={dispatch}
                    location={location}
                    scriptsourcemap={scriptsourcemap}
                    scripttypemap={scripttypemap}
                    formItemLayout={formItemLayout}
                />
            )}
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ scriptconfig, loading }) => ({
        systemscriptlist: scriptconfig.systemscriptlist,
        loading: loading.models.scriptconfig,
    }))(scriptConfig),
);