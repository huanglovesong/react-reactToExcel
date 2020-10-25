import React from 'react';
import {
  Menu,
  Icon, Switch
} from 'antd';

const { SubMenu } = Menu;

class PublickLayout extends React.Component {
  state = {
    theme: 'dark',
    current: '1',
  };

  changeTheme = value => {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  };

  handleClick = e => {
    let arr = ['', '/', '/pageOne', '/pageTwo'];
    this.props.history.push(arr[e.key]);
  };

  render() {
    console.log(this.state.theme,2222)
    console.log(2222222)
    return (
      <div>
        <Switch
          checked={this.state.theme === 'dark'}
          onChange={this.changeTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
        <br />
        <br />
        <Menu
          theme={this.state.theme}
          onClick={this.handleClick}
          style={{ width: 256 }}
          defaultOpenKeys={['sub1']}
          selectedKeys={[this.state.current]}
          mode="inline"
        >
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>Navigation One</span>
              </span>
            }
          >
            <Menu.Item key="1" onClick={this.changeHistory}>Option 1</Menu.Item>
            <Menu.Item key="2" onClick={this.changeHistory}>Option 2</Menu.Item>
            <Menu.Item key="3" onClick={this.changeHistory}>Option 3</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="appstore" />
                <span>Navigation Two</span>
              </span>
            }
          >
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
        {this.props.children}
      </div>
    );
  }
}
export default PublickLayout