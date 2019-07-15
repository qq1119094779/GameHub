if (!userId) {
    window.location.href = '/login.html'
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
                $('#imgHeadPhoto_1').attr('src',data.success);
            }
        }
    });
}
$(function () {
    let senJson = {
        id: userId
    }
    let innitUserData = () => {
        console.log(senJson)
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: `${baseUrl}/gameHub/user/showOwnerData`,
            dataType: "json",
            data: JSON.stringify(senJson),
            success (data) {
                $('#imgHeadPhoto_1').attr('src', data.headUrl)
                $('#user-name').text(data.nickName)
                if (data.Sex) {
                    $(`.user-sex[value=${1}]`).attr('checked', 'checked').next().addClass('current')
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
                console.log('data', data)
            },
            error (err) {

            }
        })
    }
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
            id: userId,
            headUrl: '',
            nickName: $('#user-name').text(),
            Sex: $(`.current`).prev().val(),
            brith: `${$('#birthday-year').val()}-${$('#birthday-month').val()}-${$('#birthday-day').val()}`,
            qq: $('#user-qq').val(),
            firstrGame: $('#play-paragraph-one').val(),
            favoiteGame: $('#favorite-games').val(),
            gameTypeId: $('#game-type').val(),
            developerId:  $('#self-orientation').find('.current').prev().val(),
            startTime: `${$('#development-year').val()}-${$('#development-month').val()}-${$('#development-day').val()}`,
            choiceType: $('#is-development').children('.checked').length ? 1 : 2
        }
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: `${baseUrl}/gameHub/user/editOwnerInfo`,
            dataType: "json",
            data: JSON.stringify(preservation),
            success (data) {
                if (data.code || data.code === false) {
                    tipAlert(data.errorMessage)
                } else {
                    tipAlert('保存成功')
                }
                console.log(data)
            }
        })
        console.log(preservation)
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
