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
      },
      error (err) {

      }
    })
  }

  getDetailsData()
})
