import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
import App from './App';
import { ConfigProvider } from 'antd';
import PublickLayout from './PublickLayout';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const WraperRouter = (props, WrappedComponent) => {
    return (
        <PublickLayout {...props}>
            <ConfigProvider locale={zh_CN}>
                <WrappedComponent {...props} />
            </ConfigProvider>
        </PublickLayout >
    )
}

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" render={(props) => WraperRouter(props, App)} />
            <Route exact path="/pageOne" render={(props) => WraperRouter(props, PageOne)} />
            <Route exact path="/pageTwo" render={(props) => WraperRouter(props, PageTwo)} />
        </Switch>
    </HashRouter>
);


export default BasicRoute;