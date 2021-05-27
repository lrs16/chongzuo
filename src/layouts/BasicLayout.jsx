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
// import MenuContext from '@/layouts/MenuContext';
import { getAuthorityFromRouter } from '@/utils/utils';
import TobTabHoc from './TopTabHoc';
import logo from '../../public/menulogo.png';
// import Layout from './BlankLayout';
// import PageTab from './PageTab';


const { TabPane } = Tabs;

const homepane = [{
  name: '首页',
  itemPath: '/ITSM/home',
  id: '1362219140546301953',
  closable: false,
  state: { cache: false },
},
  // {
  //   name: "接口数据核查情况",
  //   id: "1273546374179000321",
  //   itemPath: "/monitormanage/measurmonitor/measurface",
  //   query: {},
  //   closable: true
  // }
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
  { path: '/ITSM/operationplan/operationplanform' },
  { path: '/ITSM/operationplan/operationplansearchdetail' },
];

// 多条登记
const multiplepath = [
  { path: '/ITSM/eventmanage/registration', type: 'event' },
  { path: '/ITSM/faultmanage/registration', type: 'fault' },
  { path: '/ITSM/problemmanage/registration', type: 'problem' },
  { path: '/ITSM/demandmanage/registration', type: 'demand' },
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
    cacheinfo,
    tabid,
    savecache,
  } = props;

  const url = location.pathname;
  const multipleurl = multiplepath.filter(item => item.path === location.pathname)[0];

  const [toptabs, setTopTabs] = useState([...homepane]);
  const [activeKey, setActiveKey] = useState('1362219140546301953');

  const clearcache = () => {
    dispatch({
      type: 'viewcache/cleardata',
    });
  }

  const getcache = () => {
    dispatch({
      type: 'viewcache/fetch',
      payload: {
        newtab: true,
        tabid: activeKey,
      },
    });
  }

  // 待研究
  // const getChildren = (v) => {
  //   return React.Children.map(children, child => {
  //     return React.cloneElement(child, {
  //       new: v,
  //     });
  //   })
  // }

  // 初始强制跳转首页
  useEffect(() => {
    if (toptabs.length === 1 && url !== '/ITSM/home') {
      clearcache();         // 清缓存
      router.push({
        pathname: '/ITSM/home',
        query: {}
      });
    }
  }, []);

  // 打开最末的标签
  const lasttabactive = (tabs) => {
    const end = tabs.slice(-1)[0];
    const target = alonepath.filter(item => item.path === end.itemPath)[0];
    setActiveKey(end.id);
    router.push({
      pathname: end.itemPath,
      query: target ? end.query : {},
      state: end.state,
    });
  }

  // 监听列表跳转详情页的路由,处理完成路转回待办列表
  //  待办跳转处理用mainId做为标签id并传编号orderNo用于标签标题显示,查询跳转详情用编号No做为标签id
  useEffect(() => {
    const tabtargetid = toptabs.filter(item => location.query.No ? item.id === location.query.No : item.id === location.query.mainId)[0];      //  已有mindId或No标签
    const tabtargetpath = toptabs.filter(item => item.itemPath === url)[0];                     //  已有非工单处理路由
    const target = alonepath.filter(item => item.path === url)[0];                              //  属于工单处理路由
    const menutarget = menulist.filter(item => item.menuUrl === url)[0];                        //  系统管理菜单列表有该路由
    const targetmultiple = multiplepath.filter(item => item.path === location.pathname)[0];         //  属于登记类打开同一个链接多页签
    // 已有标签,且不属于登记类
    if (tabtargetpath && !targetmultiple) {
      setActiveKey(tabtargetpath.id);
    };
    if (tabtargetid) {
      // 已有标签的工单详情或工单
      const id = location.query.No ? location.query.No : location.query.mainId;
      setActiveKey(id);
    } else if (target && menutarget) {
      // 属于工单详情
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
        // 属于工单
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
    // 处理完毕且待办列表已关闭需跳转回待办列表，添加待办列表新签标
    if (location.query.pathpush && !tabtargetid && !target && !tabtargetpath && menutarget) {
      const { menuDesc, id, menuUrl } = menutarget;
      const panels = { name: menuDesc, id, itemPath: menuUrl, query: {}, closable: true };
      toptabs.push(panels);
      setActiveKey(id);
    };
  }, [location])

  // 关闭页签
  useEffect(() => {
    // 工单处理后关闭页签
    if (location.query.closetab && location.query.mainId) {
      const newtabs = toptabs.filter(item => item.id !== location.query.mainId);
      setTopTabs([...newtabs]);
    }
    // 登记关闭页签
    if (location.query.closecurrent && location.query.tabid) {
      const newtabs = toptabs.filter(item => item.id !== location.query.tabid);
      setTopTabs([...newtabs]);
      lasttabactive(newtabs)
    }
    if (location.query.closetab && location.query.tabid) {
      const newtabs = toptabs.filter(item => item.id !== location.query.tabid);
      setTopTabs([...newtabs]);
      // lasttabactive(newtabs)
    }
  }, [location.query])

  // 表单信息写入页签
  const ChangetabState = () => {
    const target = toptabs.filter(item => item.id === tabid)[0];
    if (target) {
      target.data = cacheinfo;
      target.state.cache = false;
    };
    const newData = toptabs.map(item => {
      return item.id === target.id ? target : item
    });
    setTopTabs(newData)
  };
  useEffect(() => {
    if (savecache) {
      ChangetabState();
      clearcache();
    }
  }, [savecache])
  // console.log(cacheinfo, savecache, toptabs)

  const callback = (key) => {
    const target = toptabs.filter(item => item.id === key)[0];
    if (target) {
      setActiveKey(key);
      router.push({
        pathname: target.itemPath,
        query: target.query,
        state: { cacheinfo: target.data.cacheinfo, cache: false }
      });
    }
  };

  const remove = targetKey => {
    clearcache();
    const panes = toptabs.filter(pane => pane.id !== targetKey);
    if (panes.length) {
      setTopTabs([...panes]);
      if (activeKey === targetKey) {
        lasttabactive(panes);
      }
    };
  };
  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      remove(targetKey)
    }
  };

  const handletopLink = (menuItemProps) => {
    const target = props.route.routes.filter(item => item.path === menuItemProps.itemPath)[0];   // comfig配置的路由
    const targetpath = target.routes[0].redirect;                                                // 获取此路由下redirect的路由
    const targetmenu = menulist.filter(item => item.menuUrl === targetpath)[0];                  // 系统管理菜单列表获取redirect路由信息
    const { id, itemPath } = targetmenu;
    const targetlink = toptabs.filter(item => item.id === id)[0];                                // 标签中是否已含有redirect的路由
    if (!targetlink && targetmenu) {
      const panels = { name: targetmenu.menuDesc, id, itemPath, query: location.query, closable: true, state: { cache: false }, };
      toptabs.push(panels);
    };
    setActiveKey(id);
  };

  const handleLink = (menuItemProps) => {
    const { name, id, itemPath } = menuItemProps;
    const target = toptabs.filter(item => item.id === id)[0];
    const targetmultiple = multiplepath.filter(item => item.path === itemPath)[0];
    if (!targetmultiple) {
      // 非登记类打开单页签
      if (!target) {
        const panels = { name, id, itemPath, query: {}, closable: true, state: { cache: false }, };
        toptabs.push(panels);
        lasttabactive(toptabs);
      } else {
        setActiveKey(id);
        router.push({
          pathname: target.itemPath,
          //  query: { ...target.query },
        });
      };
    } else {
      // 登记类打开相同多页签
      const targettype = toptabs.filter(item => item.type === targetmultiple.type);
      const num = targettype.length;
      const endid = num === 0 ? 0 : Number(targettype.slice(-1)[0].id.replace(/[^0-9]/ig, "")) + 1;
      if (targettype[0]) {
        getcache();    // 获取旧页签数据
        const panels = {
          name,
          type: targetmultiple.type,
          id: `${targetmultiple.type}${endid}`,
          query: { tabid: `${targetmultiple.type}${endid}` },
          state: { cache: false },
          itemPath,
          closable: true
        };
        toptabs.push(panels);
        lasttabactive(toptabs);
      } else {
        // 增加登记页签
        const panels = {
          name,
          type: targetmultiple.type,
          id: `${targetmultiple.type}${endid}`,
          query: { tabid: `${targetmultiple.type}${endid}` },
          state: { cache: false },
          itemPath,
          closable: true
        };
        toptabs.push(panels);
        lasttabactive(toptabs);
      };
    };
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


  // 缓存tabid
  useEffect(() => {
    sessionStorage.setItem('tabid', activeKey);
  }, [activeKey]);

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
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        };
        return (
          <>
            <Link to={menuItemProps.path} onClick={() => handletopLink(menuItemProps)}>{defaultDom}</Link>
          </>
        );
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
          };

          const targetmultiple = multiplepath.filter(item => item.path === menuItemProps.itemPath)[0];
          const endid = () => {
            if (targetmultiple) {
              const targettype = toptabs.filter(item => item.type === targetmultiple.type);
              const num = targettype.length;
              return num === 0 ? 0 : Number(targettype.slice(-1)[0].id.replace(/[^0-9]/ig, "")) + 1;
            }
            return null
          }
          const rutersave = () => {
            router.push({
              pathname: location.pathname,
              state: { ...location.state, cache: true },
            });
          }
          return (
            <>
              {targetmultiple && (
                <Link
                  to={{
                    pathname: menuItemProps.path,
                    query: { tabid: `${targetmultiple.type}${endid()}` },
                    state: {
                      cache: false
                    },
                  }}
                  onClick={() => handleLink(menuItemProps)}
                  onMouseDown={() => { rutersave() }}
                >{defaultDom}</Link>
              )}
              {!targetmultiple && (
                <Link to={{
                  pathname: menuItemProps.path,
                  state: { cache: false },
                }}
                  onClick={() => handleLink(menuItemProps)}
                  onMouseDown={() => { rutersave() }}
                >{defaultDom}</Link>
              )}
            </>
          );
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
              style={{ margin: '-24px -24px 0 ', backgroundColor: '#fff' }}
            >
              {toptabs.map(obj => [
                <TabPane
                  tab={obj.name}
                  key={obj.id}
                  closable={obj.closable}
                >
                  {/* <Authorized authority={Userauth} noMatch={noMatch}>
                    {multipleurl && (
                      <div style={{ padding: '0 24px 0 24px', marginTop: 8, background: '#f1f1f1' }}>
                        {children}
                      </div>
                    )}
                  </Authorized> */}
                </TabPane>,
              ])}
            </Tabs>
            <Authorized authority={Userauth} noMatch={noMatch}>
              {/* <PageTab>{children}</PageTab> */}
              {/* <MenuContext.Provider value={{ tabnew, cleartabdata }}>
                <div style={{ marginTop: 10 }}>
                  {children}
                </div>
              </MenuContext.Provider> */}
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
    </ProLayout >
  );
};

export default connect(({ global, settings, user, viewcache, loading }) => ({
  collapsed: global.collapsed,
  cacheinfo: viewcache.cacheinfo,
  tabid: viewcache.tabid,
  savecache: viewcache.savecache,
  settings,
  Userauth: user.Userauth,
  menuData: user.menuData,
  menulist: user.menulist,
  loading: loading.models.user,
}))(BasicLayout);
