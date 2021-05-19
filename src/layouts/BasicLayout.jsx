/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout'; // , { DefaultFooter }
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import {
  // Icon,
  Result,
  Button,
  // Alert,
  //  Spin,
  Tabs,
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../../public/menulogo.png';
// import Layout from './BlankLayout';
// import PageTab from './PageTab';

const { TabPane } = Tabs;

const homepane = [{
  name: '首页',
  itemPath: '/ITSM/home',
  id: '1362219140546301953',
  closable: false,
},
{
  name: "接口数据核查情况",
  id: "1273546374179000321",
  itemPath: "/monitormanage/measurmonitor/measurface",
  query: {},
  closable: true
}
]

// 单条工单
const alonepath = [
  { path: '/ITSM/eventmanage/to-do/record/workorder' },
  { path: '/ITSM/eventmanage/query/details' },
  { path: '/ITSM/faultmanage/todolist/record' },
  { path: '/ITSM/faultmanage/querylist/record' },
  { path: '/ITSM/problemmanage/besolveddetail/workorder' },
  { path: '/ITSM/problemmanage/problemquery/detail' },
  { path: '/ITSM/demandmanage/to-do/record/workorder' },
  { path: '/ITSM/demandmanage/query/details' },
]

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    // const localItem = { ...item, children: [] };
    return Authorized.check(item.authority, localItem, null);
  });

const topMenuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: [], routes: [] };
    return Authorized.check(item.authority, localItem, null);
  });

const BasicLayout = props => {
  const {
    loading,
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    Userauth,
    menuData,
    menulist,
  } = props;

  const url = location.pathname;

  const [toptabs, setTopTabs] = useState([...homepane]);
  const [activeKey, setActiveKey] = useState('1273546374179000321');

  // 初始强制跳转首页
  // useEffect(() => {
  //   if (toptabs.length === 1 && url !== '/ITSM/home') {
  //     router.push({
  //       pathname: '/ITSM/home',
  //     });
  //   }
  // }, [])

  // 监听列表跳转详情页的路由
  //  待办跳转处理用mainId做为标签id并传编号orderNo用于标签标题显示,查询跳转详情用编号No做为标签id
  useEffect(() => {
    const tabtargetid = toptabs.filter(item => location.query.No ? item.id === location.query.No : item.id === location.query.mainId)[0];      //  已有mindId或No标签
    const tabtargetpath = toptabs.filter(item => item.itemPath === url)[0];                //  已有非工单处理路由
    const target = alonepath.filter(item => item.path === url)[0];                         //  属于工单处理路由
    const menutarget = menulist.filter(item => item.menuUrl === url)[0];                   //  系统管理菜单列表有该路由
    // 已有标签
    if (tabtargetpath) {
      setActiveKey(tabtargetpath.id);
    };
    if (tabtargetid) {
      const id = location.query.No ? location.query.No : location.query.mainId;
      setActiveKey(id);
    } else if (target && menutarget) {
      if (location.query.No) {
        const panels = {
          name: `${menutarget.menuDesc}${location.query.No}`,
          id: location.query.No,
          itemPath: url,
          query: location.query,
          closable: true
        };
        toptabs.push(panels);
        setActiveKey(location.query.No);
      } else if (location.query.mainId) {
        const panels = {
          name: `${menutarget.menuDesc}${location.query.orderNo}`,
          id: location.query.mainId,
          itemPath: url,
          query: location.query,
          closable: true
        };
        toptabs.push(panels);
        setActiveKey(location.query.mainId);
      };

    };

  }, [location])

  // 监听关闭页签
  useEffect(() => {
    if (location.query.closetab) {
      const newtabs = toptabs.filter(item => item.id !== location.query.mainId);
      setTopTabs([...newtabs]);
    }
  }, [location.query])
  //  console.log(toptabs)

  const callback = (key) => {
    setActiveKey(key);
    const target = toptabs.filter(item => item.id === key)[0];
    if (target) {
      router.push({
        pathname: target.itemPath,
        query: { ...target.query },
      });
    }
  };

  const remove = targetKey => {
    const panes = toptabs.filter(pane => pane.id !== targetKey);
    if (panes.length) {
      setTopTabs([...panes]);
      if (activeKey === targetKey) {
        const end = panes.slice(-1);
        setActiveKey(end[0].id);
        router.push({
          pathname: end[0].itemPath,
          query: { ...end[0].query },
        });
      }
    };

  };
  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      remove(targetKey)
    }
  };


  const handleLink = (menuItemProps) => {
    const { name, id, itemPath } = menuItemProps;
    const target = toptabs.filter(item => item.id === id)[0];
    if (!target) {
      const panels = { name, id, itemPath, query: location.query, closable: true };
      toptabs.push(panels);
    };
    setActiveKey(id);
  };

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    if (dispatch) {
      dispatch({
        type: 'user/fetchMenu',
      });
    }
  }, []);

  // 获取后端路由后为菜单添加用户权限,如果是"/"从config中获取rediret路由再获取该路由权限
  const authorized = getAuthorityFromRouter(menulist, props.route.routes, location.pathname);

  // 根据当前url变化获取左侧菜单数据
  const pathArr = location.pathname.split('/');
  const path = `/${pathArr[1]}`;
  // const routeData = props.route.routes;
  const routeData = menuData;
  let leftRoute = {};
  routeData.map(item => {
    if (item.path === path) {
      leftRoute = item;
      return true;
    }
    return false;
  });

  return (
    <ProLayout
      loading={loading}
      layout="topmenu"
      fixedHeader
      logo={logo}
      // menuHeaderRender={(logoDom, titleDom) => (
      //   <Link to="/">
      //     {logoDom}
      //     {titleDom}
      //   </Link>
      // )}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      menuDataRender={() => topMenuDataRender(menuData)}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...settings}
      route={menuData}
      disableContentMargin
      disableMobile // 禁用手机端菜单，不然手机端下会表现异常
    >
      <ProLayout
        // layout={'sidemenu'}
        fixSiderbar
        headerRender={false}
        menuHeaderRender={false}
        siderWidth={280}
        navTheme="light"
        // onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path} onClick={() => handleLink(menuItemProps)}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
              defaultMessage: 'Home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        menuDataRender={menuDataRender}
        route={leftRoute}
      // footerRender={footerRender}
      >
        {authorized === Userauth && (
          <>
            <Tabs
              hideAdd
              activeKey={activeKey}
              type='editable-card'
              onChange={(key) => callback(key)}
              onEdit={onEdit}
              style={{ margin: '-24px -24px 8px' }}
            >
              {toptabs.map(obj => [
                <TabPane
                  tab={obj.name}
                  key={obj.id}
                  closable={obj.closable}
                />,
              ])}
            </Tabs>
            <Authorized authority={Userauth} noMatch={noMatch}>
              {/* <PageTab>{children}</PageTab> */}
              {children}
            </Authorized>
          </>
        )}
        {authorized === 'incontrol' && (
          <Result
            status="403"
            title="403"
            subTitle="Sorry, 您没有此页面的访问权限。"
            extra={
              <Button type="primary">
                <Link to="/">返 回</Link>
              </Button>
            }
          />
        )}
        {authorized === undefined && (
          <>
            <Result
              status="404"
              title="404"
              subTitle="Sorry, 您访问的页面不存在"
              extra={
                <Button type="primary">
                  <Link to="/">返 回</Link>
                </Button>
              }
            />
          </>
        )}
      </ProLayout>
    </ProLayout>
  );
};

export default connect(({ global, settings, user, loading }) => ({
  collapsed: global.collapsed,
  settings,
  Userauth: user.Userauth,
  menuData: user.menuData,
  menulist: user.menulist,
  loading: loading.models.user,
}))(BasicLayout);
