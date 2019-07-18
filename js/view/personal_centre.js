if (!userId) {
    window.location.href = 'login.html'
}

$(function () {
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: `${baseUrl}/gameHub/user/personalData`,
        data: JSON.stringify({userId: userId}),
        success: function (data) {
            $('#user-center-name').html(data.personData.nickName).attr('title', data.personData.nickName)
            $('#user-center-email').html(data.personData.email).attr('title', data.personData.email)
            console.log(data, 1233)
        },
        error: function () {
        }
    })
    // 获取团队
    let teamsJson = {
        pageNo: 1,
        pageSize: 10,
        teamType: '',
        userId: userId
    }
    let teamsPages = null
    let teamsLoad = true
    // 获取消息列表
    let messageJson = {
        pageNo: 1,
        pageSize: 10,
        userId,
        mesType:''
    }
    let messagePages = null
    let messageLoad = true
    // 获取已赞
    let fabulousJson = {
        pageNo: 1,
        pageSize: 10,
        userId: userId,
        gameClassify: ''
    }
    let fabulousPages = null
    let fabulousLoad = true
    // 是否展示当前用户资料
    let isShow = 1
    //
    // 创建团队
    $('#create-team').click(function () {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            url: `${baseUrl}/gameHub/user/createTeam`,
            data: JSON.stringify({
                userId: userId,
                teamName: `${userId}${(new Date()).getTime()}`
            }),
            success (data) {
                if (data.code == 'true') {
                    window.location.href = `found_friend_edit.html?id=${data.teamId}`
                }else {
                    tipAlert(data.errorMessage)
                }
            }
        })
    })
    let innitDisplay = () => {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            url: `${baseUrl}/gameHub/user/passShow`,
            data: JSON.stringify({
                id: userId
            }),
            success (data) {
                if (data.personData) {
                    isShow = 0
                    $('#data-display .privacy').html('&#xe62b;')
                } else {
                    isShow = 1
                    $('#data-display .privacy').html('&#xe6e3;')
                }
            }
        })
    }
    innitDisplay()
    $('#data-display .privacy').click(function () {
        if (isShow === 1) {
            isShow = 0
        } else {
            isShow = 1
        }
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            url: `${baseUrl}/gameHub/user/editShow`,
            data: JSON.stringify({
                id: userId,
                isShow
            }),
            success (data) {
                if (data.code == 'true') {
                    innitDisplay()
                    tipAlert(data.success)
                } else {
                    tipAlert(data.errorMessage)
                }
            }
        })

    })
    let isLoad = (sendJson, url) => {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                url: `${baseUrl}${url}`,
                data: JSON.stringify(sendJson),
                success (data) {
                    if (data.dataList) {
                        resolve(data)
                    } else {
                        tipAlert(data.errorMessage)
                    }
                },
                error (err) {
                    reject(err)
                }
            })
        })
    };
    // 获取团队
    let gettingTeams = (setJson) => {
        isLoad(setJson, '/gameHub/user/teamList').then(response => {
            let data = response.dataList
            let setHtml = ''
            teamsPages = response.totalPages
            teamsJson.pageNo++
            teamsLoad = true
            data.map(value => {
                setHtml+= `
                    <li class="team-item">
                        <div class="title">${value.teamName}</div>
                        <div class="desc"></div>
                        <div class="operation">
                        ${value.createType == 1 || $('#team-select').val() == 1 ?
                            `<a href="found_friend_edit.html?id=${value.id}" class="btn btn_small btn_blue inlineblock radius-5 mr5">编辑</a>
                            <a href="javascript:;" class="btn btn_small btn_red inlineblock radius-5 dissolution" data-id="${value.id}">解散</a>` :
                    `
                    <!--<a href="found_friend_edit.html?id=${value.id}" class="btn btn_small btn_blue inlineblock radius-5 mr5">查看</a>-->
                    <a href="javascript:;" data-id="${value.id}" class="btn btn_small btn_red inlineblock radius-5 return-teams">退出</a>`
                        }
                            
                        </div>
                    </li>`
            })
            if (response.pageNumber == 1) {
                $('#teams').html(setHtml)
            } else {
                $('#teams').append(setHtml)
            }
        }).catch(err => {
            teamsLoad = true
        })
    }
    // 解散团队
    $(document).on('click', '.dissolution', function () {
        let dissolutionJson = {
            id: $(this).attr('data-id'),
            userId
        }
        let self = $(this)
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            url: `${baseUrl}/gameHub/user/removeTeam`,
            data: JSON.stringify(dissolutionJson),
            success (data) {
                if (data.code === 'true') {
                    self.parents('li.team-item').remove()
                    tipAlert(data.success)
                } else {
                    tipAlert(data.errorMessage)
                }
            }
        })
    })
    // 退出团队
    $(document).on('click', '.return-teams', function () {
        let self = $(this)
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: `${baseUrl}/gameHub/user/exitTeam`,
            dataType: "json",
            data: JSON.stringify({
                userId,
                teamId: self.attr('data-id')
            }),
            success (data) {
                if (data.code == 'true') {
                    self.parents('.team-item').remove()
                    tipAlert(data.success)
                } else {
                    tipAlert(data.errorMessage)
                }
                console.log(data)
            }
        })
    })
    // 获取消息列表
    let getMessage = (toJson) =>  {
        isLoad(toJson, '/gameHub/user/newsList').then(response => {
            let data = response.dataList
            let setHtml = ''
            console.log(data)
            let isMessageType = (item) => {
                if (item.mesType == 1) {
                    return `<a href="javascript:;" class="btn btn_small btn_blue inlineblock radius-5 mr5">回复</a>`
                } else if (item.mesType == 2) {
                    return ''
                } else if (item.mesType == 3) {
                    if (item.content.indexOf('加入团队成功') !== -1) {
                        return ''
                    } else {
                        return `<a href="javascript:;" class="btn btn_small btn_blue inlineblock radius-5 mr5 yes-add-team" data-id="${item.id}"">同意</a>
                            <a href="javascript:;" class="btn btn_small btn_red inlineblock radius-5 mr5 no-add-team" data-id="${item.inviteBy }" data-coverInvitee="${item.coverInvitee}">拒绝</a>
                            <a href="javascript:;" class="btn btn_small btn_gray inlineblock radius-5 mr5 ignore-add-team" data-id="${item.inviteBy }" data-coverInvitee="${item.coverInvitee}">忽略</a>`
                    }
                }
            }
            messagePages = response.totalPages
            messageJson.pageNo++
            messageLoad = true
            data.forEach(value => {
                setHtml+= `
                    <li class="message-item">
                        <div class="title">${value.messageTitle}</div>
                        <div class="desc">
                            ${value.content}
                        </div>
                        <div class="operation">
                           ${isMessageType(value)}
                        </div>
                    </li>`
            })
            $('#message-box').html(setHtml)
        })
    }
    // 同意加入团队
    $(document).on('click', '.yes-add-team', function() {
        let self = $(this)
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: `${baseUrl}/gameHub/user/joinTeam`,
            dataType: "json",
            data: JSON.stringify({
                userId,
                teamId: self.attr('data-id')
            }),
            success (data) {
                console.log(data)
                if (data.code == 'true') {
                    $(self).parents('.message-item').remove()
                    tipAlert(data.success)
                } else {
                    tipAlert(data.errorMessage)
                }
            }
        })

    })
    // 拒绝，忽略加入团队
    let delInviteTeam = (teamId, coverInvitee, state) => {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: `${baseUrl}/gameHub/user/editOwnerInfo`,
                dataType: "json",
                data: JSON.stringify({
                    teamId: teamId,
                    userId: coverInvitee,
                    state: state
                }),
                success() {
                    if (data.code == 'true') {
                        resolve(data)
                        tipAlert(data.success)
                    } else {
                        reject(data)
                        tipAlert(data.errorMessage)
                    }
                }
            })
        })
    }
    $(document).on('click', '.no-add-team', function () {
        let sef = $(this)
        delInviteTeam(sef.attr('data-id'), sef.attr('data-coverInvitee'), 2).then(() => {
            $(self).parents('.message-item').remove()
        })
    })
    $(document).on('click', '.ignore-add-team', function () {
        let sef = $(this)
        delInviteTeam(sef.attr('data-id'), sef.attr('data-coverInvitee'), '').then(() => {
            $(self).parents('.message-item').remove()
        })
    })
    // 获取点赞
    let getFabulous = (setJson) => {
        isLoad(setJson, '/gameHub/user/pointList').then(response => {
            let data = response.dataList
            let setHtml = ''
            fabulousPages = response.totalPages
            fabulousJson.pageNo++
            fabulousLoad = true
            data.map(value => {
                setHtml+= `<li class="clearfix praised-item">
                        <div class="title fl">${value.gameName}</div>
                        <div class="operation">
                            <a href="javascript:;" class="btn btn_small btn_blue inlineblock radius-5 mr5" data-id="${value.id}">取消</a>
                        </div>
                    </li>`
            })
            if (response.pageNumber == 1) {
                $('#praised').html(setHtml)
            } else {
                $('#praised').append(setHtml)
            }
        })
    }
    $(document).scroll((e) => {
        let isTable = $('.table-user.on').attr('data-no')
        if (isTable == 3) { // 团队
            if (scrollbars($('#teams'))) {
                if (teamsJson.pageNo <= teamsPages && teamsLoad) {
                    teamsLoad = false
                    gettingTeams(teamsJson)
                }
            }
        } else if (isTable == 1) { // 点赞
            if(scrollbars($('#praised'))) {
                if (fabulousJson.pageNo <= fabulousPages && fabulousLoad) {
                    fabulousLoad = false
                    getFabulous(fabulousJson)
                }
            }
        } else if (isTable == 2) { // 消息
            if(scrollbars($('#message-box'))) {
                if (messageJson.pageNo <= messagePages && messageLoad) {
                    messageLoad = false
                    getFabulous(fabulousJson)
                }
            }
        }
    })
    $('#team-select').change(function () {
        teamsJson.teamType = this.value
        teamsJson.pageNo = 1
        gettingTeams(teamsJson)
    })
    gettingTeams(teamsJson)
    getFabulous(fabulousJson)
    getMessage(messageJson)
//     $.ajax({
//         type: 'POST',
//         contentType: 'application/json',
//         dataType: 'json',
//         url: `${baseUrl}/gameHub/user/passShow`,
//         data: JSON.stringify({
//             id: userId,
//             isShow: 1
//         }),
//         success (data) {
//             console.log(data)
//         }
//     })
    // 打开关闭 发布类型
    $('.publication-positioning').click(function (event) {
        event.stopPropagation()
        console.log( $('.publication-tow'))
        $('.publication-tow').show()
    })
    $(document).click(function () {
        $('.publication-tow').hide()
    })
//切换
    $(".slide_personal_centre").slide({
        titCell: ".hd a",
        autoPage: false,  //是否使用自动显示分页
        mainCell:".bd",
        autoplay: false,
        onAutoplayStop: true,
        // autoplayDisableOnInteraction: true,
        trigger:"click",   //触发方式  mouseover,click
        // delayTime:500,  //延迟时间
        // interTime:2000,  //间隔时间
    });

    $('.radio_box input').each(function(){
        if($(this).attr('checked')){
            $(this).next().addClass('current');
        }
    })
    $('.radio_box .radio_item').click(function(){
        if($(this).hasClass('open')){
            $('#'+$(this).attr('open1')).show();
            $('#'+$(this).attr('open2')).show();
        }else{
            $('#'+$(this).attr('open1')).hide();
            $('#'+$(this).attr('open2')).hide();
        }
        $(this).prev().trigger('click');
        $(this).parent().parent().find('.radio_item').removeClass('current');
        $(this).addClass('current');
        return false;
    });
    /*icheck js*/
    $('input.icheck').iCheck({
        checkboxClass: 'icheckbox_flat-red',
        radioClass: 'iradio_flat-red'
    });
    // 修改密码
    $('#change-password').click((e) => {
        e.stopPropagation()
        e.preventDefault()
        let senJson = {
            userId: userId,
            password: $('#old-password').val(),
            newPassword: $('#new-password').val(),
            checkPassword: $('#new-password').val()
        }
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            url: `${baseUrl}/gameHub/user/editPass`,
            data: JSON.stringify(senJson),
            success (data) {
                if (data.code === 'false' || !data.code) {
                    tipAlert(data.success)
                } else {
                    $('#old-password').val("")
                    $('#new-password').val("")
                    tipAlert(data.success)
                }
            },
            error () {}
        })
    })
    // 取消点赞
    $(document).on('click', '.praised-item a', function () {
        praised(2, $(this).attr('data-id')).then(response => {
            $(this).parents('li.praised-item').remove()
        })
    })
    $('#praised-select').change(function () {
        fabulousJson.pageNo = 1
        fabulousJson.gameClassify = $(this).val()
        getFabulous(fabulousJson)
    })
})
