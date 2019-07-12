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
                console.log(data)
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
            window.location.href = '/editor_publish.html'
        })
    }
})
