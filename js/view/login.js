
$(function () {
    let login = () => {
        let sendJSon = {
            email: $('.email').val(),
            password: $('.password').val()
        }
        if (!sendJSon.email) {
            tipAlert('请输入邮箱')
            return
        } else if (!sendJSon.password) {
            tipAlert('请输入密码')
            return
        }
        sendJSon = JSON.stringify(sendJSon)
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            url: `${baseUrl}/gameHub/user/login`,
            data: sendJSon,
            success: function (data) {
                if (!data.code || data.code == 'false') {
                    tipAlert(data.errorMessage)
                } else {
                    tipAlert(data.success)
                    localStorage.id = data.id
                    window.location.href = 'index.html'
                    // setTimeout(function () {
                    // }, 3000)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    }
    $('#login').on('click', login)
    $('#email').on('keydown', (event) => {
        if(event.keyCode==13){
            login()
        }
    })
    $('#password').on('keydown', (event) => {
        if(event.keyCode==13){
            login()
        }
    })
})
