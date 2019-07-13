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
      let html = ''
      if (data.length) {
        for (let i = 0, len = data.length; i < len; i++) {
          let tag = ''
          if (data[i].gameTypes) {
            for (let j = 0; j < data[i].gameTypes.length; j++) {
              tag += `<span><em>${data[i].gameTypes[j]}</em></span>`
            }
          }
          html += `<div class="swiper-slide" style=" background-image: url(${data[i].bannerUrl});">
                      <div class="info txt-l">
                        <div class="title mb20">
                          <h2 class="caption">${data[i].gameName}</h2>
                          <p class="date">${data[i].createTime}</p>
                          <p class="tag">${tag}</p>
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


/**
 * 试玩/想法最新列表
 * */
$(function () {
  let sendJson = {classify: 1}
  $.ajax({
    type: "POST",
    contentType: 'application/json',
    url: baseUrl + "/gameHub/home/queryNewGame",
    dataType: "json",
    data: JSON.stringify(sendJson),
    success (data) {
      console.log('列表', data)
      let list = data.pageList
      let html = ''
      if (list.length) {
        for (let i = 0, len = list.length; i < len; i++) {
          let time = formatTime(new Date(list[i].createTime))
          html += `<li>
                        <div class="item ease-3 clearfix">
                            <a href="trial_details.html">
                                <div class="pic"><img src="${list[i].gamePic}" alt="北京北方华光十五成立周年暨二零一四年年会庆典"></div>
                                <div class="txt">
                                    <div class="title">${list[i].gameName}</div>
                                    <p class="des txt-666 mb10">${list[i].briefIntroduction}</p>
                                    <p class="date txt-999">${time}</p>
                                </div>
                            </a>
                        </div>
                    </li>`
        }
        $('.list_download_con ul').html(html)
      }
    },
    error (err) {
      console.log('err', err)
    }
  })
})
