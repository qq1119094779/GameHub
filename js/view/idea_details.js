$(function () {
  let classify = null
  let id = null
  let page = 1
  let reply = {}

  /**
   * 获取页面参数
   * */
  let getQueryletiable =function (letiable) {
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
    let sendJson = {
      gameId: id,
      gameClassify: classify
    }
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
        let devHtml = ''
        if (data) {
          // 简介部分
          for (let i = 0, len = data.gameTypeList.length; i < len; i++) {
            tags += `<span><em>${data.gameTypeList[i]}</em></span>`
          }
          $('.page_ieadDetail .info').html(`<div class="title">
              <h2 class="caption">${data.gameName}</h2>
              <p class="date">${formatTime(new Date(data.createTime))}</p>
  
          </div>
          <p class="desc">${data.briefIntroduction}</p>
          <div class="focus">
              <span id="thumbs-up"><i class="icon iconfont mr5">&#xe6b3;</i><em>${data.pointRatio}</em></span>
              <!--<a href="###" class="btndownload"><em>下载</em></a>-->
          </div>
          <p class="tag">${tags}</p>`)

          // 轮播部分
          for (let i = 0, len = data.gamePictureList.length; i < len; i++) {
            sliderHtml += `<div class="swiper-slide">
                <img src="${fileUrl}${data.gamePictureList[i]}" alt="" />
            </div>`
          }
          $(".page_ieadDetail .pic .swiper-wrapper").html(sliderHtml)
          $(".page_ieadDetail .pic").slide({
            // titCell: ".hd ul",
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

          // 开发人员
          if (data.gameUserVOList.length) {
            for (let i = 0, len = data.gameUserVOList.length; i < len; i++) {
              devHtml += `<li class="fl">
                    <a href="player_information.html" class="item ease-1 clearfix">
                        <div class="pic ease-1 fl radius-circle"><img src="${fileUrl}${data.gameUserVOList[i].headUrl || ''}" alt=""></div>
                        <div class="txt fl">
                            <h1 class="title fs20 text-overflow">${data.gameUserVOList[i].nickName}</h1>
                            <p class="tag inlineblock ml10"><span><em>${data.gameUserVOList[i].location}</em></span></p>
                        </div>
                    </a>
                </li>`
            }
            $('.page_game_introduction #developer ul').html(devHtml)
          }
        }
      },
      error (err) {

      }
    })
  }
  getDetailsData()


  /**
   * 获取评测列表
   * */
  let commentJson = {
    gameId: id,
    pageNo: page,
    pageSize: 10,
    gameClassify: classify
  };
  let renderComment = true;
  let pageAll = 0;
  let getCommentList = function () {
    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: baseUrl + "/gameHub/recreation/accessPage",
      dataType: "json",
      data: JSON.stringify(commentJson),
      success (data) {
        console.log('data', data)
        commentJson.pageNo++;
        pageAll = data.totalPages;
        renderComment=true;
        let html = ``
        for (let i = 0, len = data.dataList.length; i < len; i++) {
          let commentReplayVOList = data.dataList[i].commentReplayVOList
          let small = ''
          for (let j = 0, len1 = commentReplayVOList.length; j < len1; j++) {
            small += `<div class="comments_smallbox">
                    <div class="comments_item mb20">
                        <div class="comments_avatar avatar_radius radius-circle"><img src="${fileUrl}${commentReplayVOList[j].respondedHeadUrl}"></div>
                        <div class="comments_point"><span class="txt-rank txt-peach">${formatTime(new Date(commentReplayVOList[j].createTime))}</span></div>
                        <div class="comments_content">
                            <h5 class="comments_user"><span class="mr10 fs14">${commentReplayVOList[j].commentNickname}</span></h5>
                            <p class="comments_body txt-333 mb20 fs14">${commentReplayVOList[j].content}</p>
                            <div class="comments_mark">
                            <span class="txt-blue mr10 reply" commentId="${commentReplayVOList[j].commentId}" userId="${commentReplayVOList[j].userId}"><i class="iconfont mr5">&#xe60d;</i>回复</span>
                            <span class="txt-666 mr10 pointer report-btn" commentId="${data.dataList[i].commentId}" userId="${data.dataList[i].userId}"><i class="iconfont mr5 txt-red">&#xe651;</i>举报</span>
                            </div>
                        </div>
                    </div>
                </div>`
          }
          html += `<div class="comments_bigbox">
                <div class="comments_item mb20">
                    <div class="comments_avatar avatar_radius radius-circle"><img src="${fileUrl}${data.dataList.headUrl}"></div>
                    <div class="comments_point"><span class="txt-rank txt-peach">${formatTime(new Date(data.dataList[i].createTime))}</span></div>
                    <div class="comments_content">
                        <h5 class="comments_user"><span class="mr10 fs16">${data.dataList[i].nickName}</span></h5>
                        <p class="comments_body txt-333 mb20 fs16">${data.dataList[i].content}</p>
                        <div class="comments_mark fs16">
                          <span class="txt-blue mr10 reply" commentId="${data.dataList[i].commentId}" userId="${data.dataList[i].userId}"><i class="iconfont mr5">&#xe60d;</i>回复</span>
                          <span class="txt-666 mr10 pointer report-btn" commentId="${data.dataList[i].commentId}" userId="${data.dataList[i].userId}"><i class="iconfont mr5 txt-red">&#xe651;</i>举报</span>
                        </div>
                    </div>
                </div>
                ${small}
            </div>`
        }
        $('.comments .comments_list').append(html)
      },
      error (err) {

      }
    })
  }
  getCommentList()
  $(document).scroll(function () {
    if(scrollbars($('.comments .comments_list'))) {
      if (commentJson.pageNo <= pageAll && renderComment) {
        renderComment = false
        getCommentList()
      }
    }
  })

  /**
   * 发布测评
   * */
  document.querySelector('#assessment .btn_submit').onclick = function () {
    let value = $('#assessment .input_text').val()
    console.log('calue', value)
    if (!value) {
      alert('请输入评测内容')
      return
    }
    // if (!userId) {
    //   alert('请先登陆')
    //       return
    // }
    let sendJson = {
      gameId: id,
      userId: userId,
      content: value
    }
    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: baseUrl + "/gameHub/recreation/addAssess",
      dataType: "json",
      data: JSON.stringify(sendJson),
      success (data) {
        console.log('发布评测', data)
        if (data.code == 'true') {
          getCommentList()
        }
        if (data.code == 'false') {
          tipAlert(data.errorMessage)
        } else {
          commentJson.pageNo = 1
          tipAlert(data.success)
          getCommentList()
        }
      },
      error (err) {

      }
    })
  }

  /**
   * 点击评测回复按钮
   * */
  $(document).on('click', '.comments_bigbox .comments_mark .reply', function() {
    let commentId = document.querySelector('.comments_bigbox .comments_mark span').getAttribute('commentId')
    let userId = document.querySelector('.comments_bigbox .comments_mark span').getAttribute('userId')
    reply.commentId = commentId
    reply.userId = userId
    document.querySelector('#dialog').style.display = 'block'
  })


  /**
   * 点击评测回复的回复按钮（就是‘.comments_smallbox’下面的回复按钮）
   * */
  $(document).on('click', '.comments_smallbox .comments_mark .reply', function() {
    let commentId = document.querySelector('.comments_smallbox .comments_mark span').getAttribute('commentId')
    let userId = document.querySelector('.comments_smallbox .comments_mark span').getAttribute('userId')
    reply.commentId = commentId
    reply.userId = userId
    document.querySelector('#dialog').style.display = 'block'
  })

  /**
   * 回复测评
   * */
  document.querySelector('#assessment1 .btn_submit').onclick = function () {
    let value = $('#assessment1 .input_text').val()
    let sendJson = {
      commentId: reply.commentId,
      userId: reply.userId,
      replayUserId: userId,
      content: value
    }
    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: baseUrl + "/gameHub/recreation/addRespond",
      dataType: "json",
      data: JSON.stringify(sendJson),
      success (data) {
        document.querySelector('#dialog').style.display = 'none'
        if (data.code == 'true') {
          getCommentList()
        }
      },
      error (err) {
        document.querySelector('#dialog').style.display = 'none'
      }
    })
  }

  /**
   * 点击dialogMask
   * */
  document.querySelector('.dialog .dialog-mask').onclick = function () {
    $('#dialog')[0].style.display = 'none'
  }
    /**
     * 点赞
     * */
    $(document).on('click', '#thumbs-up', function () {
        // /gameHub/home/addGameTips
        let upJson = {
            tipType: 1,
            userId,
            gameId: id
        }
        let self = $(this)
        if (self.hasClass('already_praised')) {
            upJson.tipType = 2
        }

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: baseUrl + "/gameHub/home/addGameTips",
            dataType: "json",
            data: JSON.stringify(upJson),
            success (data) {
                console.log(data)
                if (data.code == "true") {
                    let num = self.find('em').text()
                    if (upJson.tipType == 2) {
                        num--
                        self.removeClass('already_praised')
                    } else {
                        num++
                        self.addClass('already_praised')
                    }
                    self.find('em').text(num)
                } else {
                    tipAlert(data.errorMessage || data.success)
                }
            }
        })
    })
    /**
     * 举报*/
    let reportJson = {
        reportId: userId,
        reporteeId: '',
        reportType: '',
        reportTitle: '',
        contentId: '',
        content: ''
    }
    $(document).on('click', '.report-btn' ,function () {
        reportJson.reporteeId = $(this).attr('userId')
        reportJson.reportType = 2
        reportJson.contentId = $(this).attr('commentId')
        $('.report-mask').show()
    })
    $('.cancel-report').click(function () {
        $('.report-mask').hide()
    })
    $('.report-class-item').click(function () {
        $(this).addClass('active').siblings().removeClass('active')
    })
    $('#explain').keyup(function () {
        if ($(this).val()) {
            $('#determine-report').addClass('btn_blue')
        } else {
            $('#determine-report').removeClass('btn_blue')
        }
    })
    $('#determine-report').click(function () {
        reportJson.reportTitle = $('.report-class-item.active').text()
        reportJson.content = $('#explain').val()
        if (!reportJson.content) {
            return
        }
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: baseUrl + "/gameHub/user/report",
            dataType: "json",
            data: JSON.stringify(reportJson),
            success (data) {
                if (data.code == 'true') {
                    tipAlert(data.success)
                    $('.report-mask').hide()
                } else {
                    tipAlert(data.errorMessage)
                }
            },
            error (err) {
            }
        })
    })
})
