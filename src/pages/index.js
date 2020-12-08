import React, { Component } from 'react';
import router from 'umi/router';
import fireworks from 'react-fireworks';
import { Button, Drawer, Menu, Icon, Row, Col } from 'antd';
import { connect } from 'dva';

import styles from './index.less';
import yearImg from '../assets/2020.png';
import Rewarders from './components/Rewarders'

@connect(({ lottery }) => ({
  lottery,
}))
class Index extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      visibleDrawer: false,
      userData: [],
      rewardData: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'lottery/init',
    })
      .then(() => {
        const { userData, rewardData } = this.props.lottery;
        this.setState({ userData, rewardData });
      });
  }

  showDrawer = () => {
    this.setState({
      visibleDrawer: true,
    });
  };

  onClose = () => {
    this.setState({
      visibleDrawer: false,
    });
  };

  handleMenuClick = e => {
    console.log('click ', e.key);
    switch (e.key) {
      case '1':
        router.replace('/user');
        break;
      case '2':
        router.replace('/reward');
        break;
      default:
        break;
    }
  };

  handleStartRoll = () => {
    this.props.dispatch({
      type: 'lottery/startRoll',
    })
  }

  handleNextRoll = () => {
    this.props.dispatch({
      type: 'lottery/nextReward',
    })
      .then(() => {
        const {endReward} = this.props.lottery;
        if (endReward){
          fireworks.init("contain",{});
          fireworks.start()
        }
      })
  }

  renderLuckeyGuides = (rewardData, nowRewardIndex, luckyGuies) =>{
    if (rewardData.length > 0 && luckyGuies.length >0 && rewardData[nowRewardIndex].rewardCount === 1) {
      return(
        <div className={styles.lotteryContainer} key={luckyGuies[0].id}>
          <span className={styles.lotteryName}>{luckyGuies[0].name}</span>
        </div>
      )
    }
    if (rewardData.length > 0 && luckyGuies.length >0  && rewardData[nowRewardIndex].rewardCount > 1) {
      const newArr = []
      for (var i = 0; i < rewardData[nowRewardIndex].rewardCount; i++) {
        newArr.push(i)
      }
      const list = (
        <div className={styles.listContainer}>
          {newArr.map(item => {
            if (item < luckyGuies.length) {
              return (
                <div className={styles.lotteryContainer} key={item}>
                  <span className={styles.lotteryName}>{luckyGuies[item].name}</span>
                </div>
              )
            }
          })}
        </div>
      )
      return list
    }
    return <div></div>
  }

  render() {
    const { visibleDrawer, rewardData, userData } = this.state;
    const { rolling, luckyGuies, nowRewardIndex, endReward, rewardUserData } = this.props.lottery;
    return (
      <div id="contain" className={styles.normal}>
        <Row className={styles.contentContainer}>
          <Col span={7}></Col>
          <Col span={10}>
            <div className={styles.actionContain}>
              <div className={styles.headContain}>
                <div className={styles.depTitle}>
                  <img src={yearImg} alt=""/>
                </div>
              </div>
              <div className={styles.middleContain}>
                {this.renderLuckeyGuides(rewardData, nowRewardIndex, luckyGuies)}
                {(endReward === true )&& (
                  <div className={styles.lotteryContainer}>
                    <span className={styles.lotteryName}>活动结束</span>
                  </div>
                )}
                {(userData.length === 0 )&& (
                  <div className={styles.lotteryContainer}>
                    <span className={styles.lotteryName}>请先导入用户数据</span>
                  </div>
                )}
              </div>

              <div className={styles.footContain}>
                {(endReward === false) && (
                  <div className={styles.reward}>
                    {(rewardData.length > 0)&& `本轮奖品：${rewardData[nowRewardIndex].name} (${rewardData[nowRewardIndex].rewardCount})`}
                  </div>
                )}
                {(rolling === false && luckyGuies.length === 0 && endReward === false  ) && (
                  <Button
                    size="large"
                    type="primary"
                    className={styles.rollButton}
                    style={{ color: 'rgb(234, 67, 53)' }}
                    onClick={this.handleStartRoll}
                  >
                    开始抽奖
                  </Button>
                )}
                {(rolling === true && endReward === false  )&& (
                  <Button
                    size="large"
                    type="primary"
                    className={styles.rollButton}
                    style={{ color: 'rgb(234, 67, 53)' }}
                    onClick={this.handleStartRoll}
                  >
                    停止
                  </Button>
                )}
                {(rolling === false && luckyGuies.length > 0 && endReward === false )&& (
                  <Button
                    size="large"
                    type="primary"
                    className={styles.rollButton}
                    style={{ color: 'rgb(234, 67, 53)' }}
                    onClick={this.handleNextRoll}
                  >
                    下一轮
                  </Button>
                )}
              </div>
            </div>
          </Col>
          <Col span={7} className={styles.rewarderContainer}>
            {(rewardUserData && rewardUserData.length > 0) && (
              <div style={{ width: '80%'}}>
                <Rewarders rewarderData={rewardUserData} />
              </div>
            )}
          </Col>
        </Row>
        <Button className={styles.showDrawerButton} onClick={() => this.showDrawer()}></Button>
        <Drawer
          title="抽奖设置"
          placement="left"
          visible={visibleDrawer}
          onClose={this.onClose}
          className={styles.drawerContainer}
        >
          <Menu
            mode="inline"
            theme="light"
            multiple={false}
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="1">
              <Icon type="user"/>
              <span>人员管理</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="gift"/>
              <span>奖品管理</span>
            </Menu.Item>
          </Menu>
        </Drawer>
      </div>
    );
  }

}

export default Index;
