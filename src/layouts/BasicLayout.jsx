/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout'; // , { DefaultFooter }
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import {
  // Icon,
  Result,
  Button,
  // Alert,
  //  Spin,
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../../public/menulogo.png';
// import Layout from './BlankLayout';

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

/**
 * use Authorized check all menu item
 */

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
  /**
   * constructor
   */

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
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
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
        siderWidth={240}
        navTheme="light"
        // onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
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
          <Authorized authority={Userauth} noMatch={noMatch}>
            {children}
          </Authorized>
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
