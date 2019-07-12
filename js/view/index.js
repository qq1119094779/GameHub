/**
 * 试玩轮播数据获取
 * */
$(function () {
  let sendJson = {classify: 1}
  $.ajax({
    type: "POST",
    contentType: 'application/json',
    url: baseUrl + "/gameHub/home/showBanner",
    dataType: "json",
    data: JSON.stringify(sendJson),
    success (data) {
      console.log(111, data);// 成功之后执行这里面的代码
      let html = ''
      if (data) {
        for (let i = 0, len = data.length; i < len; i++) {
          html += `<div class="swiper-slide" style=" background-image: url(${data[i].bannerUrl});">
                      <div class="info txt-l">
                        <div class="title mb20">
                          <h2 class="caption">${data[i].gameName}</h2>
                          <p class="date">${data[i].createTime}</p>
                          <p class="tag"><span><em>RPG</em></span><span><em>射击</em></span></p>
                        </div>
                        <p class="desc">${data[i].briefIntroduction}</p>
                        <div class="focus">
                          <span><i class="icon iconfont mr5">&#xe62b;</i><em>${data[i].favoriteCount}</em></span>
                          <span><i class="icon iconfont mr5">&#xe6b3;</i><em>${data[i].pointRatio}</em></span>
                        </div>
                      </div>
                  </div>`
        }
        $('#indexslider .swiper-wrapper').html(html)
        $("#indexslider").slide({
          titCell: ".hd ul",
          autoPage: true,  //是否使用自动显示分页
          mainCell:".swiper-wrapper",
          autoPlay:true,
          effect:"fold",   //特效left,leftLoop,topLoop,top,fade（支持响应窗口大小）,
          easing:"easeOutCirc",  //缓动效果 easeInQuint,easeInBack,easeOutBounce,easeOutElastic
          trigger:"mouseover",   //触发方式  mouseover,click
          delayTime:1000,  //延迟时间
          interTime:5000,  //间隔时间
          triggerTime:0,
          pnLoop:true,   //前后按钮循环，默认true
          mouseOverStop:true   //鼠标经过停止播放，默认true
          /*startFun:function(i,c,slider, titCell, mainCell, targetCell, prevCell, nextCell){
              $('#indexslider .swiper-wrapper .swiper-slide').eq(i).addClass("enter").siblings().removeClass("enter");
          }*/
        });
      }
    },
    error (e) {
      console.log(222, e)//请求失败是执行这里的函数
    }
   })
})
