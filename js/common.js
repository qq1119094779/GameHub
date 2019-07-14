const baseUrl = 'http://106.14.206.226:8080'
const userId = localStorage.id
$(function () {
    // 获取当前用户信息
    if (userId && $('#head .login_status')) {
        let sendJSon = {userId: userId}
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            url: `${baseUrl}/gameHub/user/personalData`,
            data: JSON.stringify(sendJSon),
            success: function (data) {
                $('#head .login_status').hide()
                $('#head .head-right').append(`
                <div class="user-data fr clearfix">
                    <div class="user-nickname fl">${data.personData.nickName}</div>
                    <div class="user-header fl" id="user-header" style="background-image: url(${data.personData.headUrl})"></div>
                    <div class="fl sign-out" id="sign-out">退出</div>
                </div>
                `)
            },
            error: function () {
            }
        })
        $(document).on('click', '#sign-out', function(){
            delete localStorage.id
            location.reload()
        })
        $(document).on('click', '#user-header', function(){
            window.location.href = '/personal_centre.html'
        })
    }
})

/**
 * 格式化时间戳
 * */
const formatTime = function (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    // 位数不够两位，前面加0
    const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
    }

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**
 * 计算滚动条
 * 传父级需要被计算的元素，用jq获取好的
 **/
const scrollbars = (element) => {
    let scrollTop = $(document).scrollTop();
    let bodyHeight = $(document.body).outerHeight(true)
    let offsetTop = element.offset().top;
    let eleHeight = element.outerHeight(true);
    return scrollTop + bodyHeight  >= offsetTop + eleHeight - 50;
}
const convertBase64UrlToBlob = (urlData) => {

    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob( [ab] , {type : 'image/png'});
}
let IsPicture = () => {
    //判断是否是图片 - strFilter必须是小写列举
    var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"
    if(this.indexOf(".")>-1)
    {
        var p = this.lastIndexOf(".");
        //alert(p);
        //alert(this.length);
        var strPostfix=this.substring(p,this.length) + '|';
        strPostfix = strPostfix.toLowerCase();
        //alert(strPostfix);
        if(strFilter.indexOf(strPostfix)>-1)
        {
            //alert("True");
            return true;
        }
    }
    //alert('False');
    return false;
}
