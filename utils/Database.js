
const  app = getApp()
function readPrize () {
  var that=this
  const db = wx.cloud.database()

  db.collection('turntable').doc('prize').get({
    success: function(res) {
      // res.data 包含该记录的数据
      console.log(res.data.奖励)
      return res.data.a
    }
  }).then({
    
  })
  
/*
  try{
    const db = wx.cloud.database()
    db.collection('turntable').where({
      _id: "prize"
    }).get({
      success:function(res){
      
        console("读取奖励",res)
      },
      fail:function(e){
        console.error("读取异常1",e)
      }
    })
  } catch (e) {
    // Do something when catch error
    console.error("读取异常",e)
  }*/
}


function Database1(circle) {
  this.circle = circle;
 
}

module.exports = {
  readPrize 
}
