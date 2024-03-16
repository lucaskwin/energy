const app = getApp()
// pages/run/index.js
import timer from "../../utils/lebu-timer";
import lebu from "../../utils/lebu-core";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    polyline: [{
      points: [],
      color: "#07c160",
      width: 2
    }],
    day_id: 0,
    latitude: 0,
    longitude: 0,
    altitude_data: [],
    time_data: '00:00',
    motion_status: 0,
    countDown: 0,
    kcal_data: "0.00",
    speed_data: "0'00\"",
    distance_data: "0.00",
    motion_status: 0,
    time_id: 0,
    actinos1_count: 0,
    actinos2_count: 0,
    actinos3_count: 0,
    actinos4_count: 0,

    points_time: parseInt(Date.now() / 1000),
    km_speed_data: [],
    km_distance_data: 0,
    runType: 0,
    //new
    capsuleInfo: app.globalData.capsuleInfo,
    text: ['徒手侧平举\n', '前后交叉小跑\n', '开合跳\n', '半蹲\n'],
    text1: '\n首先请注意：在返回上一页面前，务必先点击“终止识别”按钮以结束进程。\n\n本页面功能用于使用者进行动作识别和计数。\n 1. 请使用者打开手机声音，将有语音播报。\n 2. 使用时请左手握手机、机背贴掌心、机身正置。 \n 3. 点击按钮后，下方将出现60s倒计时，使用者在语音开始后按照图示动作随意进行任意动作。\n 4. 页面上方将实时显示使用者正在进行的动作，同时定时对当前动作进行语音播报。\n 5. 倒计时结束后将自动终止识别，用户也可选择手动终止。终止时伴有语音提示，并可同时通过动作识别方法和波峰计数方法计算出 终止识别前用户的实际动作数和小程序识别到的标准动作数，并在动图下方给予显示。 \n 6.终止识别后，再次点击开始识别按钮时，将重置所有数据。',

    num_Method1: [0, 0, 0, 0],
    num_Method2: [0, 0, 0, 0],
    value: 0,
    displayValue: 0,
    accXs: [],
    accYs: [],
    accZs: [],
    rgXs: [],
    rgYs: [],
    rgZs: [],

    accYsAll: [],
    activity: [],

    timeSs: [],
    timer: '',
    timer1: '',
    startTime: 0,
    action: '',
    value1: 1500,
    show: true
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  tabSelect(e) {
    this.setData({
      runType: e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    console.log("获取加速度计数据");
    wx.startAccelerometer({
      interval: 'ui',
      success: res => {
        console.log("调用成功");
      },
      fail: res => {
        console.log(res)
      }
    });
    wx.startGyroscope({
      interval: 'ui',
      success: res => {
        console.log("调用成功");
      },
      fail: res => {
        console.log(res)
      }
    });
    this.setData({
      day_id: parseInt(Date.now() / 1000),
    });
    // wx.getStorageSync("SportInfo-" + parseInt(Date.now() / 1000)) {
    //   success(res) {

    //   }
    // }
    //"SportInfo-" + this.data.day_id
    // console.log(wx.getStorageSync("SportInfo-" + parseInt(Date.now() / 1000).toString())),
     let da=wx.getStorageSync("SportInfo-" + _this.data.day_id);
      // 
      console.log(da);
      wx.getStorageSync({
        key: "SportInfo-" + _this.data.day_id,
        success(res) {
          
          if (res == '') {
            wx.setStorageSync(
              "SportInfo-" + id,
              JSON.stringify({
                count1: 0,
                count2: 0,
                count3: 0,
                count4: 0,
              })
            );
          } else {
            _this.setData({
              actinos1_count: res.count1,
              actinos2_count: res.count2,
              actinos3_count: res.count3,
              actinos4_count: res.count4,
            })
          }

        },

      });

    
  },



  startAction: function (e) {
    this.setData({
      num_Method1: [0, 0, 0, 0],
      num_Method2: [0, 0, 0, 0]
    })
    wx.showToast({
      title: '注意！返回上一页面前，务必先点击“终止识别”按钮！',
      duration: 3000,
      icon: "none"
    })

    wx.startAccelerometer({
      interval: 'ui',
      success: res => {
        console.log("acc调用成功");
      },
      fail: res => {
        console.log(res)
      }
    });
    wx.startGyroscope({
      interval: 'ui',
      success: res => {
        console.log("gry调用成功");
      },
      fail: res => {
        console.log(res)
      }
    })
    var _this = this
    _this.setData({
      isReading: true
    })

    let accXs = [];
    let accYs = [];
    let accZs = [];
    let rgXs = [];
    let rgYs = [];
    let rgZs = [];

    let accYsAll = [];

    let activity = [];

    _this.setData({
      startTime: new Date().getTime()
    })

    wx.onAccelerometerChange(function (res) {

      accXs.push(res.x)
      accYs.push(res.y)
      accZs.push(res.z)




    })
    wx.onGyroscopeChange(function (res) {

      rgXs.push(res.x)
      rgYs.push(res.y)
      rgZs.push(res.z)

    })
    this.data.timer = setInterval(function () {
      let mid_time = new Date().getTime();

      // console.log(res.x, res.y, res.z, mid_time )
      let timeStep = (mid_time - _this.data.startTime) / 1000
      _this.setData({
        value: parseInt(timeStep * 1.67),
        displayValue: parseInt(timeStep)
      });
      //if(timeStep < _this.data.countDown){  
      if (_this.data.motion_status != 0) {

        //发送请求

        wx.request({
          url: 'https://yingwing.xyz:8080/',
          method: 'POST',

          data: {
            accx: accXs,
            accy: accYs,
            accz: accZs,
            gryx: rgXs,
            gryy: rgYs,
            gryz: rgZs,
            system: 2

          },
          success: function (res) {
            var num1 = "num_Method1[" + 0 + "]";
            var num2 = "num_Method1[" + 1 + "]";
            var num3 = "num_Method1[" + 2 + "]";
            var num4 = "num_Method1[" + 3 + "]";
            var resData = res.data;
            if (resData != "") {
              activity.push(resData)
              if (resData == '5') {
                _this.setData({
                  action: '站立'
                })
              }
              if (resData == '1') {
                _this.setData({
                  action: '徒手侧平举',
                  [num1]: _this.data.num_Method1[0] + 1
                })
              }
              if (resData == '2') {
                _this.setData({
                  action: '前后交叉小跑',
                  [num2]: _this.data.num_Method1[1] + 1
                })
              }
              if (resData == '3') {
                _this.setData({
                  action: '开合跳',
                  [num3]: _this.data.num_Method1[2] + 1
                })
              }
              if (resData == '4') {
                _this.setData({
                  action: '半蹲',
                  [num4]: _this.data.num_Method1[3] + 1
                })
              }
              //获取数据后重新开启定时器发送请求


            }
          }

        })
        accYsAll = accYsAll.concat(accYs)
        accXs = [];
        accYs = [];
        accZs = [];
        rgXs = [];
        rgYs = [];
        rgZs = [];
        _this.setData({
          accYsAll: accYsAll,
          activity: activity
        });
      } else {
        wx.offAccelerometerChange()
        wx.offGyroscopeChange()
        _this.setData({
          value: 100,
          displayValue: 60,
          accYsAll: accYsAll,
          activity: activity
        });
        _this.stopAction()
        accYsAll = []
        activity = []
      }
    }, 1200);




  },


  stopAction: function () {
    let _this = this
    //console.log(_this.data.num)
    _this.setData({
      isReading: false,
      displayValue: 0,
      time: 0,
      action: ''
    })
    clearInterval(_this.data.timer)
    wx.stopAccelerometer({
      success: res => {
        console.log("结束")
      }
    })
    wx.stopGyroscope({
      success: res => {
        console.log("结束")
      }
    })
    setTimeout(function () {}, 1300);
    _this.setData({
      actinos1_count:5,
      actinos2_count: 5,
      actinos3_count:5,
      actinos4_count: 5,
    });
    wx.setStorageSync(
      "SportInfo-" + this.data.day_id,
      JSON.stringify({
        // count1: res.count1 + count1,
        // count2: res.count2 + count2,
        // count3: res.count3 + count3,
        // count4: res.count4 + count4,
        count1: 5,
        count2: 5,
        count3: 5,
        count4: 5,
      })
    );
      console.log(wx.getStorageSync("SportInfo-" + _this.data.day_id));

    wx.request({
      url: 'https://yingwing.xyz:8080/count',
      method: 'POST',

      data: {

        accyAll: _this.data.accYsAll,
        activity: _this.data.activity,
        system: 2

      },
      success: function (res) {
        var resData = res.data;
        var num1 = "num_Method2[" + 0 + "]";
        var num2 = "num_Method2[" + 1 + "]";
        var num3 = "num_Method2[" + 2 + "]";
        var num4 = "num_Method2[" + 3 + "]";
        if (resData != "") {
          var count = resData.split(',');
          var count1 = count[0];
          var count2 = count[1];
          var count3 = count[2];
          var count4 = count[3];

          let id = parseInt(Date.now() / 1000);

          wx.getStorageSync({
            key: "SportInfo-" + parseInt(Date.now() / 1000),
            success(res) {


              // _this.setData({
              //   actinos1_count: res.count1 + count1,
              //   actinos2_count: res.count2 + count2,
              //   actinos3_count: res.count3 + count3,
              //   actinos4_count: res.count4 + count4,
              // });
              // _this.setData({
              //   actinos1_count: 5,
              //   actinos2_count: 5,
              //   actinos3_count: 5,
              //   actinos4_count: 5,
              // });
              // wx.setStorageSync(
              //   "SportInfo-" + id,
              //   JSON.stringify({
              //     // count1: res.count1 + count1,
              //     // count2: res.count2 + count2,
              //     // count3: res.count3 + count3,
              //     // count4: res.count4 + count4,
              //     count1: 5,
              //     count2: 5,
              //     count3: 5,
              //     count4: 5,
              //   })
              // );


            },
          });


          _this.setData({
            [num1]: count1,
            [num2]: count2,
            [num3]: count3,
            [num4]: count4,
          })
          console.log(_this.data.num)
        }

        //获取数据后重新开启定时器发送请求


      }
    })



  },




  timeChange(e) {
    this.setData({

      // 将时间转换为秒
      countDown: this.timeToSecond(e.detail.value),

      time_data: this.secondToTime(this.timeToSecond(e.detail.value)),
    });
  },
  //将时间转换为秒
  timeToSecond(time) {
    // const [minute, second] = time.split(':');
    // return Number(minute) * 60  + Number(second) ;
    const [hour, minute] = time.split(':');
    return Number(hour) * 60 * 60 + Number(minute) * 60;
  },
  // 开始跑步

  startRun() {
    console.log(wx.getStorageSync("SportInfo-" + this.data.day_id));
    let da=wx.getStorageSync("SportInfo-" + this.data.day_id);
    // 
    console.log(this.data.day_id);
    // 检查时间是否为"00:00"
    if (this.data.time_data === '00:00') {
      // 如果是，展示弹窗提示用户
      wx.showToast({
        title: '请设置倒计时',
        icon: 'none',
        duration: 2000
      });
      return; // 与以下代码断开，不进行倒计时
    }


    // 如果不是"00:00"，接着进行倒计时
    this.setData({
      motion_status: 1,
      timer1: setInterval(() => {
        this.setData({
          countDown: this.data.countDown - 1,
        });
        // 更新时间
        this.setData({
          time_data: this.secondToTime(this.data.countDown)
        });
        // 当倒计时等于0时，弹出窗口，清除定时器，停止跑步
        if (this.data.countDown === 0) {
          wx.showToast({
            title: '时间到',
            icon: 'success',
            duration: 2000
          });
          this.stopRun();
        }
      }, 1200)
    });
    this.startAction();

  },
  // 暂停跑步
  pauseRun() {
    this.setData({
      motion_status: 2
    });
    clearInterval(this.data.timer1);
  },
  // 恢复跑步
  reRun() {
    this.startRun(); // 重新开始跑步
  },
  // 长按停止
  stopRun() {
    this.setData({
      motion_status: 0,
      countDown: this.timeToSecond(this.data.time_data),
      time_data: '00:00',
      countDown: 0,
    });

    clearInterval(this.data.timer1);

  },
  //将秒数转换为时分秒
  secondToTime(seconds) {
    let minute = Math.floor(seconds / 60);
    let second = seconds - minute * 60;
    //如果分钟或秒数小于10，在前面添加一个0
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    return `${minute}:${second}`
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setScreenHeight();
  },
  //设定地图高度为全屏幕高度 
  setScreenHeight() {
    let that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          screenHeight: (res.screenHeight * 0.901) + "px"
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.checkLocation();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setNavigationBarTitle({
      title: '跑步记录',
    })
    wx.stopLocationUpdate({
      complete: (res) => {},
    })

    let that = this;
    //时间计数器重置
    timer.end();
    timer.reset();
    // timer1.end();
    // timer1.reset();
    //定位停止
    if (this.data.runType == 0) {
      wx.stopLocationUpdate({
        complete: (res) => {

        },
      });
    }
    //加速度传感器停止监测
    wx.stopAccelerometer({
      complete: (res) => {
        that.setData({
          motion_status: 2
        });
      },
    });
    //跑步模块重置
    lebu.reset();
  }
})