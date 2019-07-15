if (!userId) {
    window.location.href = '/login.html'
}
function giveTheThumbsUp (id, self) {
    // praised(2, id).then(() => {
    // })
}
$(function () {
    // 获取团队
    let teamsJson = {
        pageNo: 1,
        pageSize: 10,
        teamType: '',
        userId: userId
    }
    let teamsPages = null
    let teamsLoad = true
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
    // 创建团队
    //     $.ajax({
    //         type: 'POST',
    //         contentType: 'application/json',
    //         dataType: 'json',
    //         url: `${baseUrl}/gameHub/user/createTeam`,
    //         data: JSON.stringify({
    //             userId: userId,
    //             teamName: `测试${i + 4}`
    //         }),
    //         success (data) {
    //             console.log(data)
    //         }
    //     })
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
                    <li>
                        <div class="title">${value.teamName}</div>
                        <div class="desc"></div>
                        <div class="operation">
                            <a href="found_friend_edit.html?id=${value.id}" class="btn btn_small btn_blue inlineblock radius-5 mr5">编辑</a>
                            <a href="javascript:;" class="btn btn_small btn_red inlineblock radius-5" data-id="${value.id}">解散</a>
                            <a href="javascript:;" class="btn btn_small btn_red inlineblock radius-5">退出</a>
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
            if (fabulousJson.pageNo <= fabulousPages && fabulousLoad) {
                fabulousLoad = false
                getFabulous(fabulousJson)
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
