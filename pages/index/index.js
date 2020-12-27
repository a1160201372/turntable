// pages/main/main.js
var utils = require('../../utils/utils.js');
var Animation = require('../../utils/Animation.js');
var Pointer = require('../../utils/Pointer.js');
var Wheel = require('../../utils/Wheel.js');
var QRCode =  require('../../weapp.qrcode.js');

import drawQrcode from '../../weapp.qrcode.js'
var qrcode;
Page({


  /**
   * 页面的初始数据
   */
  data: {

    registerFlag:false,

    systemNum:"",
    windowWidth: 0,
    windowHeight: 0,
    wheelImg: 'assets/wheel.png',
    pointImg: 'assets/point.png',
    touch: { x: 0, y: 0, isPressed: false },
    deadline:"错误",
    name:"",
    phone:"",
    prizeInfo:[  
      {
        set:"奖品一",
        Info:"极地附实打实大师大幅度发生的水电费水电费十多个放入近1"
      },
      {
        set:"奖品二",
        Info:"极地附近撒大声地"
      },
                  
  ],//奖项设置
    prizeInfoLengh:500
  },

  touchMove: function (event) {

  },
  bindKeyProfession:function(event){
    console.log(event)
  if(event.currentTarget.dataset.index==1)//姓名
  {
    this.data.name=event.detail.value
  }
  else if(event.currentTarget.dataset.index==2){//手机号
    this.data.phone=event.detail.value
  }
  },
  //初始化系统
  iniDatabase:function(){
    var that=this
    const db = wx.cloud.database()
    //读取
    db.collection('turntable_system').doc('system').get().then(res=>{
      console.log("编号",res.data.dateFlag)
    
      that.setData({
        systemNum:res.data.dateFlag
      })
  
      console.log("后面",that.data.systemNum)
    }).then(res=>{
      db.collection('turntable').doc(that.data.systemNum).get().then(res=>{
        that.data.systemFlag=res.data.Flag
        var prizeInfoNum =res.data.prizeInfo.length
        var lenghTmp=prizeInfoNum*
        console.log("长度",res.data.prizeInfo.length)
       /*that.setData({
          prizeInfo:res.data.prizeInfo
         // prizeInfoLengh:
        })*/
       // console.log("ss",res.data.Flag)
        //slicePrizes=res.data.奖励
        
       var fps = 60,
       /* slicePrizes = ["恭喜中了大奖",  "500 积分", "谢谢参与", "200 积分", "100 积分", "150 积分", "谢谢参与"],*/
        slicePrizes = [
          { text: "加载失败", img: "assets/gift.png" },
        ],
        w = this.data.windowWidth,
        h = this.data.windowHeight,
     
        context = wx.createCanvasContext('canvas')
        slicePrizes=res.data.奖励
       var wheel = new Wheel(w / 2, w / 2+100, w / 2 - 50, slicePrizes),
        point = new Pointer(w / 2, w / 2+100, 40, wheel),
        animation = new Animation(wheel, { w: w, h: h })
        ;
        
        
  
      wheel.prizeWidth = 30;
      wheel.prizeHeight = 30;
  
      // 启用事件
      point.inputEvent = true;
      point.onInputDown = run;
  
      // 更新动画
      var update = function () {
        // 清空
        context.clearRect(0, 0, w, h);
        // 画转盘
        wheel.draw(context);
        // 画指针
        point.draw(context);
  
        // 更新数据
        animation.draw(context);
        // 更新数据
        animation.update();
  
        // 获取手指点击
        var touch = that.data.touch;
        if (point.inputEvent && touch.isPressed && point.onInputDown) {
          // 如果点击到了指针
          if (point.contains(touch)) {
            // 调用点击回调方法
            point.onInputDown();
          }
        }
  
        // 绘图   
        context.draw()
  
      };
  
      setInterval(update, 1000 / fps, 1000 / fps);
          // 开始转
          function run() {
            // 避免重复调用
            if (animation.isRun) return;
            // 当动画完成时
            animation.onComplete = function (prize) {
              //抽完奖处理函数
              wx.showToast({
                image: prize.img,
                title: prize.text,
                duration: 3000,
                mask: true,
              })
              //存入数据库
            };
            // 开始转
            animation.run();
            // 模拟后台返回数据
            setTimeout(function () {
              // 随机一个奖品
              var prizeIndex = utils.getRandom(slicePrizes.length - 1);
              // 计算奖品角度
              animation.stopTo(prizeIndex);
            }, 3000);
          }
      })
    })


      db.collection("turntable_user").where({
        _openid: '{openid}'
      }).get({
        success:function(res){
        //  console.log("信息",res.data[0])
          console.log("信息",res.data.length)
          if(res.data.length==0)
          {
            that.setData({
              registerFlag:false
            })
          }else{
            that.setData({
              registerFlag:true,
              phone:res.data[0].phone
            })

          }
        }
       
      })
  },
  
  bindingInfo:function(){
    var that=this
    var phoneError=checkPhone(this.data.phone)
    var nameError=checkName(this.data.name)
    if(phoneError==0&&nameError==0){
      console.log("正确")
   
     // saveNamePhone("turntable_user",this.data.name,this.data.phone,this.data.systemNum)
     const db = wx.cloud.database()
      db.collection("turntable_user").add({
        // data 字段表示需新增的 JSON 数据
        data: {
          name:that.data.name,
          phone:that.data.phone,
          flag:that.data.systemNum,
        },
        success: function(res) {
          console.log("保存成功",res)
          console.log("保存成功33",that.data)
          that.setData({
            registerFlag:true,
            phone:that.data.phone
          })
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 2000
          })
        },
        fail:function(){
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
      
    }else{
      console.log("错误")
    }
   
    function checkName(name){
      if(name.length!=0){
        return 0
      }else{
        return 1
      }
    }
    function checkPhone(phoneNum){
      var that = this
      if(phoneNum.length==11){
        if(phoneNum[0]=='1'){
          if(phoneNum[1]=='3'||phoneNum[1]=='4'||phoneNum[1]=='5'||phoneNum[1]=='7'||phoneNum[1]=='8'){
            return 0
          }else{
            return 1
          }
        }else{
          return 2
        }
      }
      else {
        return 3
      }
    }


      const db = wx.cloud.database()

    

  },

  canvasTouchStart: function (event) {
    var touch = event.changedTouches[0];
    touch.isPressed = true;
    this.setData({
      touch: touch
    })
  },

  canvasTouchEnd: function (event) {
    var touch = event.changedTouches[0];
    touch.isPressed = false;
    this.setData({
      touch: touch
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.iniDatabase()

    drawQrcode({
      width: 160,
      height: 160,
      x: 0,
      y: 0,
      canvasId: 'myQrcode',
      typeNumber: 10,
      text: "调试中...",
      image: {
        imageResource: '/pages/index/assets/qqq.png',
        dx: 49,
        dy: 50,
        dWidth: 63,
        dHeight: 50
      },
      callback(e) {
        console.log('e: ', e)
      }
    })

    // 把设备的尺寸赋值给画布，以做到全屏效果
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        });
      },
    })
    const db = wx.cloud.database()

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '幸运大转盘',
    })
    const db = wx.cloud.database()
     var that = this


  



  },
    // 长按保存
    save: function () {
      console.log('save')
      var that=this
      wx.showActionSheet({
          itemList: ['保存图片'],
          success: function (res) {
              console.log(res.tapIndex)
              that.download()
          }
      })
  },
  download :function() {
      // 导出图片
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        destWidth: 300,
        destHeight: 300,
        canvasId: 'myQrcode',
        success(res) {
          console.log('图片的临时路径为：', res.tempFilePath)
          let tempFilePath = res.tempFilePath
          // 保存图片，获取地址
          // wx.saveFile({
          //   tempFilePath,
          //   success (res) {
          //     const savedFilePath = res.savedFilePath
          //     console.log('savedFilePath', savedFilePath)
          //   }
          // })
  
          // 保存到相册
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function (res) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail: function (res) {
              wx.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      })
    },
})
