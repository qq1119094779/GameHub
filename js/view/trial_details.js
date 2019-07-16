$(function () {
  let classify = null
  let id = null

  /**
   * 获取页面参数
   * */
  let getQueryletiable =function (letiable)
  {
    let query = window.location.search.substring(1);
    let lets = query.split("&");
    for (let i=0;i<lets.length;i++) {
      let pair = lets[i].split("=");
      if(pair[0] == letiable){return pair[1];}
    }
    return(false);
  }

  classify = getQueryletiable('classify')
  id = getQueryletiable('id')


  /**
   * 请求详情数据
   * */
  let getDetailsData = function () {
    let sendJson = {gameId: id}
    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: baseUrl + "/gameHub/recreation/gameDetails",
      dataType: "json",
      data: JSON.stringify(sendJson),
      success (data) {
        console.log('details', data)
        let tags = ''
        let sliderHtml = ''
        let versionHtml = ''
        let devHtml = ''
        // 简介部分
        for (let i = 0, len = data.gameTypeList.length; i < len; i++) {
          tags += `<span><em>${data.gameTypeList[i]}</em></span>`
        }
        $('.game_introduction .info').html(`<div class="title">
            <h2 class="caption">${data.gameName}</h2>
            <p class="date">${formatTime(new Date(data.createTime))}</p>
        </div>
        <p class="desc">${data.briefIntroduction}</p>
        <div class="focus">
            <span><i class="icon iconfont mr5">&#xe6b3;</i><em>${data.pointRatio}</em></span>
            <a href="${data.gameUrl}" class="btndownload"><em>下载</em></a>
        </div>
        <p class="tag">${tags}</p>`)

        // 轮播部分
        for (let i = 0, len = data.gamePictureList.length; i < len; i++) {
          sliderHtml += `<div class="swiper-slide">
                <img src="${fileUrl}${data.gamePictureList[i]}" alt="" />
            </div>`
        }
        $(".game_introduction .pic").html(sliderHtml)
        $(".game_introduction .pic").slide({
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

        // 详情和特殊说明
        $('.page_game_introduction .introduction').html(`<div class="item mb20">
                <h3>详细介绍</h3>
                <p class="text_box">${data.detailedIntroduction}</p>
            </div>
            <div class="item">
                <h3>特殊说明 </h3>
                <p class="text_box">${data.specialIntroduction}</p>
            </div>`)

        // 历史记录
        for (let i = 0, len = data.recreationVersionVOList.length; i < len; i++) {
          versionHtml += `<div class="item mb20">
                        <div class="title">${data.recreationVersionVOList[i].versionNo}</div>
                        <p class="desc">${data.recreationVersionVOList[i].versionIntroduction}</p>
                    </div>`
        }
        $('.page_game_introduction .version .zScroll').html(versionHtml)

        // 开发人员
        for (let i = 0, len = data.gameUserVOList.length; i < len; i++) {
          let tags = ``
          if (data.gameUserVOList[i].Location) {
            for (let j = 0; j < data.gameUserVOList[i].Location.length; j++) {
              tags = `<span><em>${data.gameUserVOList[i].Location[j]}</em></span>`
            }
          }
          devHtml += `<li class="fl">
                    <a href="player_information.html" class="item ease-1 clearfix">
                        <div class="pic ease-1 fl radius-circle"><img src="${fileUrl}${data.gameUserVOList[i].headUrl}" alt=""></div>
                        <div class="txt fl">
                            <h1 class="title fs20 text-overflow">${data.gameUserVOList[i].nickName}</h1>
                            <p class="tag inlineblock ml10">${tags}</p>
                        </div>
                    </a>
                </li>`
        }
        $('.page_game_introduction .developer ul').html(devHtml)
      },
      error (err) {

      }
    })
  }

  getDetailsData()
})
