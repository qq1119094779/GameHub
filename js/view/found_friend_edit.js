$(function () {
    // 查看团队详情
    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: `${baseUrl}/gameHub/user/teamDetail`,
        dataType: "json",
        data: JSON.stringify({
            teamId: getUrlkey(window.location.href).id
        }),
        success (data) {
            let setHtml = ''
            $('#team-name').val(data.teamDetail.teamName)
            data.numberList.forEach(value => {
                setHtml += `<li>
                        <a href="javascript:;" class="item ease-1 clearfix">
                            <div class="pic fl ease-1 radius-circle"><img src="${value.headUrl}" alt=""></div>
                            <div class="txt">
                                <h1 class="title fs20 text-overflow">${value.nickName}</h1>
                                <p class="desc fs14 txt-666 mb10">${value.email}</p>
                                ${
                                value.leadType == 1 ?
                                 '<p class="tag inlineblock ml10"><span><em>发起人</em></span></p>' :
                                 '<p class="tag inlineblock ml10"><span><em>移除</em></span></p>'   
                                }
                            </div>
                        </a>
                    </li>`
            })
            $('#team-list').html(setHtml)
            console.log(data)
            // team-list
        }
    })
    // 查询
    let queryUser = () => {
        let senJson = {
            email: $('#search_email').val()
        }
        let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        if (!reg.test(senJson.email)) {
            tipAlert('请输入正确邮箱')
            return
        }
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: `${baseUrl}/gameHub/user/showOwnerData`,
            dataType: "json",
            data: JSON.stringify(senJson),
            success () {
            }
        })
    }
    $('#search_email_btn').click(queryUser)
    $('#search_email').keydown(function(event){
        if(event.keyCode==13){
            queryUser()
        }
    });
    // 打开关闭弹窗，阻止冒泡
    $('#open-Invitation').click(function () {
        $('.invitation-mask').show()
    })
    $('.invitation-mask').click(function () {
        $('.invitation-mask').hide()
    })
    $('.invitation-mask .invitation').click(function (event) {
        event.stopPropagation()
    })
})
