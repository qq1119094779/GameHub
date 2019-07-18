$(function () {
  let classify = 1
  let page = 1
  let totalPages = null

  /**
   * 试玩轮播数据获取
   * */
  let turnPlay = function () {
    let sendJson = {classify: classify}
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
            html += `<div class="swiper-slide" style=" background-image: url(${fileUrl}${data[i].bannerUrl});">
                    <a href="trial_details.html?classify=1&id=${data[i].gameId}">
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
                    </a>
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
  }
  turnPlay()


  /**
   * 试玩/想法最新列表
   * */
  let newList = function () {
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
        let url = classify == 1 ? 'trial_details.html' : 'idea_details.html'
        if (list.length) {
          for (let i = 0, len = list.length; i < len; i++) {
            let time = formatTime(new Date(list[i].createTime))
            html += `<li>
                        <div class="item ease-3 clearfix">
                            <a href="${url}?classify=${classify}&id=${list[i].id}">
                                <div class="pic"><img style="width: 100%; height: 172px" src="${fileUrl}${list[i].gamePic}" alt=""></div>
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
  }
  newList()


  /**
   * 获取分类方法
   * */
  getClassification().then(res => {
    if (res.gameType.length) {
      let html = '<option value="0">类型</option>'
      for (let i = 0, len = res.gameType.length; i < len; i++) {
        html += `<option value="${res.gameType[i].id}">${res.gameType[i].gameType}</option>`
      }
      $('.filter .type').html(html)
    }
  })

  /**
   * 获取所有试玩游戏/想法列表
   * */
  let allList = function (pass={}) {
    let sendJson = {
      classify: classify,
      pageNo: page,
      pageSize: 10,
      timeType: pass.timeType,
      gameType: pass.gameType
    }
    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: baseUrl + "/gameHub/home/findGameList",
      dataType: "json",
      data: JSON.stringify(sendJson),
      success (data) {
        let list = data.dataList
        let url = classify == 1 ? 'trial_details.html' : 'idea_details.html'
        page++
        totalPages = data.totalPages
        if (list.length) {
          let html = ''
          for (let i = 0, len = list.length; i < len; i++) {
            let tag = ''
            if (list[i].gameTypes) {
              for (let j = 0; j < list[i].gameTypes.length; j++) {
                tag += `<span><em>${list[i].gameTypes[j]}</em></span>`
              }
            }
            html += `<li>
                        <a href="${url}?classify=${classify}&id=${list[i].id}" class="item ease-1">
                            <div class="pic fl ease-1"><img src="${fileUrl}${list[i].gamePic}" alt=""></div>
                            <div class="txt">
                                <h1 class="title fs20 text-overflow">${list[i].gameName}</h1>
                                <div class="date txt-666">${formatTime(new Date(list[i].createTime))}<p class="tag inlineblock ml10">${tag}</p></div>
                                <p class="desc fs14 txt-666 mb10">${list[i].briefIntroduction}</p>
                                <div class="focus">
                                    <span><i class="icon iconfont mr5"></i><em>${list[i].pointRatio}</em></span>
                                    <span><i class="icon iconfont mr5"></i><em>${list[i].favoriteCount}</em></span>
                                </div>
                            </div>
                        </a>
                    </li>`
          }
          $('.filter_list ul').html(html)
        }
        console.log('data', data)
      },
      error (err) {

      }
    })
  }
  allList()


  /**
   * 试玩展示按钮发生事件
   * */
  document.querySelector('#indextab .tryout').onclick = function () {
    $(this).addClass('on').siblings().removeClass('on')
    console.log('tryout', classify)
    if (classify != 1) {
      classify = 1
      page = 1
      turnPlay()
      newList()
    }
  }


  /**
   * 游戏想法按钮发生事件
   * */
  document.querySelector('#indextab .idea').onclick = function () {
    $(this).addClass('on').siblings().removeClass('on')
    console.log('idea', classify)
    if (classify != 2) {
      classify = 2
      page = 1
      turnPlay()
      newList()
    }
  }

  /**
   * 类型条件筛选
   * */
  $(document).on("change", '.filter .type', function(e){
    console.log(222222, $(this).val());
    let value = $(this).val() == 0 ? '' : $(this).val()
    allList({gameType: value})
  })

  /**
   * 时间条件筛选
   * */
  $(document).on("change", '.filter .type', function(e){
    let value = $(this).val() == 0 ? '' : $(this).val()
    allList({timeType: value})
  })

  /**
   * 页面滚动
   * */
  $(document).scroll((e) => {
    if (scrollbars($('.filter_list ul'))) {
      if (page <= totalPages) {
        allList()
      }
    }
  })
})








