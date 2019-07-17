if (!userId) {
    window.location.href = 'login.html'
}
let uploadHeader = () => {
    $.ajaxFileUpload({
        url:`${baseUrl}/gameHub/file/upload`,
        secureuri:false,
        fileElementId:"file",
        dataType:"json",
        success:function (data) {
            if (data.code || data.code === false) {
                tipAlert(data.errorMessage)
            } else {
                $('#imgHeadPhoto_1').attr('src',`${fileUrl}${data.success}`);
            }
        }
    });
}
$(function () {
    // 设置地区
    let setRegionSelect = (id, ele) => {
        let pid = id || 0
        if (ele) {
            ele.html('')
        }
        return new Promise(function (resolve, reject) {
            getRegion(pid).then(response => {
                if (response[0].code == 'false') {
                    tipAlert(response[0].errorMessage)
                } else {
                    let setHtml = ''
                    response.forEach(value => {
                        setHtml +=  `<option value="${value.id}">${value.areaName}</option>`
                    })
                    if (ele){
                        ele.html(setHtml)
                    }
                    resolve({setHtml: setHtml, response: response})
                }
            })
        })
    }
    // 选择第一个进行联动
    $('#region-1').change(function () {
        $('#region-3').html('')
        setRegionSelect($(this).val(), $('#region-2')).then(() => {
            setRegionSelect($('#region-2').val(), $('#region-3'))
        })
    })
    $('#region-2').change(function () {
        setRegionSelect($(this).val(), $('#region-3'))
    })
    let senJson = {
        id: userId
    }
    let innitUserData = () => {
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: `${baseUrl}/gameHub/user/showOwnerData`,
            dataType: "json",
            data: JSON.stringify(senJson),
            success (data) {
                $('#imgHeadPhoto_1').attr('src', `${fileUrl}${data.headUrl}`)
                $('#user-name').text(data.nickName)
                $('#set_user_name').val(data.nickName)
                if (data.sex) {
                    $(`.user-sex[value=${data.sex}]`).attr('checked', 'checked').next().addClass('current')
                }
                if (data.areaPath) {
                    let regionArr =  data.areaPath.split(',')
                    // setRegionSelect($('#region-1').val(), $('#region-2')).then(() => {
                    //     setRegionSelect($('#region-2').val(), $('#region-3'))
                    // })
                    // 根据用户所选设置地区
                    setRegionSelect(0, $('#region-1')).then((dataJson) => {
                        let nowOne = dataJson.response.filter(item => item.id  == regionArr[0])[0]
                        $('#region-1').val(nowOne.id)
                        setRegionSelect(nowOne.id, $('#region-2')).then((slectTowJson) => {
                            let nowTow = slectTowJson.response.filter(item => item.id  == regionArr[1])[0]
                            $('#region-2').val(nowTow.id)
                            setRegionSelect(nowTow.id, $('#region-3')).then((slectThreeJson) => {
                                let nowtThree = slectThreeJson.response.filter(item => item.id  == regionArr[2])[0]
                                $('#region-3').val(nowtThree.id)
                            })
                        })
                    })
                }  else {
                    // 初始化设置
                    setRegionSelect(0, $('#region-1')).then(() => {
                        setRegionSelect($('#region-1').val(), $('#region-2')).then(() => {
                            setRegionSelect($('#region-2').val(), $('#region-3'))
                        })
                    })
                }
                if (data.brith) {
                    let brithArr = data.brith.split('-')
                    $('#birthday-year').val(brithArr[0])
                    $('#birthday-month').val(brithArr[1])
                    $('#birthday-day').val(brithArr[2])
                }
                if (data.startTime) {
                    let startTimeArr = data.startTime.split('-')
                    $('#development-year').val(startTimeArr[0])
                    $('#development-month').val(startTimeArr[1])
                    $('#development-day').val(startTimeArr[2])
                }
                $('#user-qq').val(data.qq || '')
                $('#play-paragraph-one').val(data.firstGame || '')
                $('#favorite-games').val(data.favoriteGame || '')
                $('#game-type').val(data.gameTypeId || '')
                if (data.choiceType == 1) {
                    $('#is-development').children('.icheckbox_flat-red').addClass('checked')
                }
                if (data.developerId) {
                    $('#self-orientation').find(`input[value=${data.developerId}]`).attr('checked', 'checked"').next().addClass('current')
                }
            },
            error (err) {

            }
        })
    }
    $('#set_user_name_btn').click(function () {
        $('#user-name').hide()
        $('#set_user_name').show().focus()
    })
    $('#set_user_name').blur(function () {
        if (!$(this).val()) {
            tipAlert('昵称不可为空')
            $(this).focus()
        } else {
            $('#user-name').text($(this).val()).show()
            $(this).hide()
        }
    })
    getClassification().then((data) => {
        let setHtml = ''
        let orientationHtml = ''
        data.gameType.forEach(value => {
            setHtml += `<option value="${value.id}">${value.gameType}</option>`
        })
        // checked="checked" man
        data.location.forEach(value => {
            orientationHtml += `<li>
                            <input type="radio" name="hobby" value="${value.id}" />
                            <a href="javascript:void(0);" class="radio_item radius-5 ease-1 txt-666"><i class="icon inlineblock"></i><span>${value.gameType}</span></a>
                        </li>`
        })
        $('#game-type').html(setHtml)
        $('#self-orientation').html(orientationHtml)
        innitUserData()
    })
    // 保存
    $('#preservation').click(() => {
        let preservation = {
            // fileUrl
            // /group1/M00/00/01/rBEpz10uz4SAT3mWAAGuw0orYHI588.png
            // firstGame firstrGame
            id: userId,
            headUrl: $('#imgHeadPhoto_1').attr('src').replace(fileUrl,''),
            nickName: $('#user-name').text(),
            sex: $(`.current`).prev().val(),
            brith: `${$('#birthday-year').val()}-${$('#birthday-month').val()}-${$('#birthday-day').val()}`,
            qq: $('#user-qq').val(),
            firstGame: $('#play-paragraph-one').val(),
            favoriteGame: $('#favorite-games').val(),
            gameTypeId: $('#game-type').val(),
            developerId:  $('#self-orientation').find('.current').prev().val(),
            startTime: `${$('#development-year').val()}-${$('#development-month').val()}-${$('#development-day').val()}`,
            choiceType: $('#is-development').children('.checked').length ? 1 : 2,
            areaPath: `${$('#region-1').val()},${$('#region-2').val()},${$('#region-3').val()}`
        }
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: `${baseUrl}/gameHub/user/editOwnerInfo`,
            dataType: "json",
            data: JSON.stringify(preservation),
            success (data) {
                if (!data.code || data.code == 'false') {
                    tipAlert(data.errorMessage)
                } else {
                    tipAlert('保存成功')
                }
            }
        })
    })
})

/*单选js*/
$(function(){
    $('.radio_box input').each(function(){
        if($(this).attr('checked')){
            $(this).next().addClass('current');
        }
    })
    $(document).on('click', '.radio_box .radio_item', function(){
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
    })

    /*icheck js*/
    $('input.icheck').iCheck({
        checkboxClass: 'icheckbox_flat-red',
        radioClass: 'iradio_flat-red'
    });

    /*头像上传*/
    // $('#header-file').click(function(){
    //     IsPicture()
    //     var num = $(this).attr('filenum');
    //     var nextnum = parseInt(num) +1;
    //     $(this).localResizeIMG({
    //         width: 100,
    //         quality:1,
    //         success:function(result){
    //             var img = new Image();
    //             img.src = result.base64;
    //             $.ajax({
    //                 type: "POST",
    //                 url: ``,
    //                 dataType: "json",
    //                 processData : false,         // 告诉jQuery不要去处理发送的数据
    //                 contentType : false,        // 告诉jQuery不要去设置Content-Type请求头
    //                 data: JSON.stringify({
    //                     file: result.base64
    //                 }),
    //                 success (data) {
    //                     console.log(data)
    //                 }
    //             })
    //             $('#imgHeadPhoto_'+num).attr('src',img.src);
    //             console.log(result);
    //         }
    //     })
    // })
});
