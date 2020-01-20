import { delay } from 'dva/saga';
import { message } from 'antd';
import { shuffle, getRandomIndex, getRandomArray } from '../utils/shuffle'

export default {
  namespace: 'lottery',
  state: {
    rewardData: [],
    userData: [],
    luckyGuies: [],
    rewardUserData: [],
    nowRewardIndex: 0,
    rolling: false,
    endReward: false,
},

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {});
    },
  },

  effects: {
    *init({ payload }, { put }) {
      let rewardData = sessionStorage.getItem('rewardData');
      let userData = sessionStorage.getItem('userData');
      if(rewardData){
        const newRewardData = JSON.parse(rewardData).sort(function(a,b){
          return a.weight - b.weight
        })

        yield put({
          type: 'save',
          payload: {
            rewardData: newRewardData,
          }
        })
      }
      if(userData){
        yield put({
          type: 'save',
          payload: {
            userData: JSON.parse(userData),
          }
        })
      }
    },
    *startRoll({ payload }, { call, put, select }) {
      let { userData, rewardData, nowRewardIndex, luckyGuies, rewardUserData, rolling } = yield select(state => state.lottery);
      if (rewardData.length === 0) {
        message.error('没有奖励数据！')
        return
      }
      if (userData.length === 0) {
        message.error('没有人员数据！')
        return
      }
      yield put({type: 'save',payload: {rolling: !rolling }});
      //过滤掉已中奖员工
      let extraArr = [];
      const ids = rewardUserData.map(item => (item.id));
      let copyArr = userData.filter(item => {
        if (ids.indexOf(item.id) === -1) {
          if (item.weight) {
            extraArr.push(item);
          }
          return true;
        }
        return false;
      });
      // copyArr = copyArr.concat(extraArr);
      copyArr = shuffle(copyArr)
      const rewardCount = rewardData[nowRewardIndex].rewardCount;
      while (true) {
        // yield call(delay, 50);
        let rewardIndexArr = [];
        if (copyArr.length > rewardCount){
          rewardIndexArr = getRandomArray(copyArr,rewardCount)
        }else {
          rewardIndexArr = getRandomArray(copyArr, copyArr.length)
        }
        rewardIndexArr.forEach((item,index) => {
          luckyGuies[index] = item
        })
        yield put({type: 'save',payload: {luckyGuies}})
        const { rolling } = yield select(state => state.lottery);
        yield call(delay, 50);
        if ( !rolling ){
          let { luckyGuies, rewardUserData } = yield select(state => state.lottery);
          let newRewarderUserData = rewardUserData
          const rewardIds = rewardUserData.map(item => (item.id));
          luckyGuies.forEach(item => {
            if (rewardIds.indexOf(item.id) === -1){
              newRewarderUserData.push({
                id: item.id,
                userName: item.name,
                rewardName: rewardData[nowRewardIndex].name,
              })
            }
          })
          yield put({type: 'save',payload: {rewardUserData}});
          break
        }
      }
    },
    *nextReward({ payload }, { call, put, select }) {
      const { rolling, nowRewardIndex, rewardData } = yield select(state => state.lottery);
      if (!rolling){
        let newNowIndex = nowRewardIndex
        if (rewardData && rewardData.length>0 && nowRewardIndex+1 !== rewardData.length) {
          newNowIndex = nowRewardIndex + 1
        }else {
          yield put({
            type: 'save',
            payload: {
              endReward: true,
            }
          })
        }
        yield put({
          type: 'save',
          payload: {
            nowRewardIndex: newNowIndex,
            luckyGuies: [],
          }
        })
      }
    },
    *addReward({ payload }, { put, select }) {
      let { rewardData } = yield select(state => state.lottery);
      const lastId = rewardData.length
      rewardData.push({
        id: lastId,
        name: payload.name,
        rewardCount: payload.rewardCount,
        weight: payload.weight,
      });
      yield put({
        type: 'save',
        payload: {
          rewardData: [...rewardData]
        }
      })
      sessionStorage.setItem('rewardData', JSON.stringify(rewardData));
    },
    *editReward({ payload }, { put, select }) {
      let { rewardData } = yield select(state => state.lottery);
      rewardData.forEach(item => {
        if (item.id === payload.id) {
          item.name = payload.name
          item.rewardCount = payload.rewardCount
          item.weight = payload.weight
        }
      })
      yield put({
        type: 'save',
        payload: {
          rewardData: rewardData
        }
      })
      sessionStorage.setItem('rewardData', JSON.stringify(rewardData));
    },
    *editUser({ payload }, { put, select }) {
      let { userData } = yield select(state => state.lottery);
      userData.forEach(item => {
        if (item.id === payload.id) {
          item.name = payload.name
          item.weight = payload.weight
        }
      })
      yield put({
        type: 'save',
        payload: {
          userData
        }
      })
      sessionStorage.setItem('userData', JSON.stringify(userData));
    },
    *deleteReward({ payload }, { put, select }) {
      let { rewardData } = yield select(state => state.lottery);
      let list = rewardData.filter(item => item.id !== payload.id);
      yield put({
        type: 'save',
        payload: {
          rewardData: list
        }
      })
      sessionStorage.setItem('rewardData', JSON.stringify(list));
    },
    *deleteUser({ payload }, { put, select }) {
      console.log('payload', payload)
      let userData = sessionStorage.getItem('userData');
      userData = JSON.parse(userData);
      let list = [];
      if (userData){
        list = userData.filter(item => item.id !== payload.id);
      }
      yield put({
        type: 'save',
        payload: {
          userData: list
        }
      })
      sessionStorage.setItem('userData', JSON.stringify(list));
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
