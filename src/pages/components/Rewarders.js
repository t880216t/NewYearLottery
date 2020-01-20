import React from 'react';
import { List, Card, Avatar } from 'antd';

import styles from './index.less'

export default class Rewarders extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { rewarderData } = this.props
    return (
      <Card bordered={false} className={styles.infoList} bodyStyle={{background: 'rgba(0,0,0,.3)'}}>
        <List bordered={false} footer="" className={styles.list}>
          {rewarderData && (
            rewarderData.map(item => (
              <List.Item key={item.id}>
                <div className={styles.infoContent}>
                  <span className={styles.name}>{item.userName}</span>
                  <span className={styles.info}>{item.rewardName}</span>
                </div>
              </List.Item>
            ))
          )}
        </List>
      </Card>
    )
  }
}
