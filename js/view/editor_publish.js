if (!userId) {
    window.location.href = 'login.html'
}
let gameUrl = ''
let isShowUpload = () => {
    if ($('#imgBox').children().length >= 7) {
        $('.upload-screenshot').hide()
    } else {
        $('.upload-screenshot').show()
    }
}
let uploadScreenshot = () => {
    $.ajaxFileUpload({
        url:`${baseUrl}/gameHub/file/upload`,
        secureuri:false,
        fileElementId:"fileImg",
        dataType:"json",
        success:function (data) {
            if (data.code || data.code == 'false') {
                tipAlert(data.errorMessage)
                $('#fileImg').val('')
            } else {
                $(".upload-screenshot").before(`
                            <div class="screenshot-item fl">
                                <i class="close-i"></i>
                                <img src="${fileUrl}${data.success}" alt="">
                            </div>`);
                isShowUpload()
                $('#fileImg').val('')
            }
        },
        error ()  {
            tipAlert('上传失败，请重试')
            $('#fileImg').val('')
        }
    });
}
let uploadGame = () => {
    tipAlert('上传中')
    $.ajaxFileUpload({
        url:`${baseUrl}/gameHub/file/upload`,
        secureuri:false,
        fileElementId:"fileGame",
        dataType:"json",
        success:function (data) {
            $('#fileGame').val('')
            if (data.code || data.code == 'false') {
                tipAlert(data.errorMessage)
            } else {
                gameUrl = data.success
                tipAlert('上传成功')
            }
        },
        error () {
            $('#fileGame').val('')
            tipAlert('上传失败请重试')
        }
    });
}
$(function () {
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: `${baseUrl}/gameHub/user/teamList`,
        data: JSON.stringify({
            pageNo: 1,
            pageSize: 100,
            teamType: '',
            userId: userId
        }),
        success (data) {
            let tameList = ''
            data.dataList.forEach(value => {
                tameList += `<option value="${value.id}">${value.teamName}</option>`
            })
            $('#tame-select-fabu').html(tameList)
        },
        error (err) {
        }
    })
    $('#time-or-type').change(function () {
        if ($(this).val() == 1) {
            $('#tame-select-fabu').hide()
        } else {
            $('#tame-select-fabu').show()
        }
    })
    let routerParams = getUrlkey(window.location.href)
    if (routerParams.game) {
        $('#edition-box').show()
        $('#upload-game').show()
    }
    getClassification().then(response => {
        let setHtml = ''
        let data = response.gameType
        data.forEach(value => {
            setHtml += `<li class="game-type-list">
                            <a href="javascript:void(0);" data-id="${value.id}" class="radio_item radius-5 ease-1 txt-666"><i class="icon inlineblock"></i><span>${value.gameType}</span></a>
                        </li>`
        })
        $('#game-classification').html(setHtml)
    })
    $(document).on('click', '.game-type-list', function () {
        $(this).children().addClass('current')
        $(this).find('i').addClass('man')
        $(this).siblings().children().removeClass('current')
    })
    $(document).on('click', '.screenshot-item .close-i', function () {
        $(this).parent('.screenshot-item').remove()
        isShowUpload()
    })
    $('#release-game').click(function () {
        let screenshotArr = []
        console.log($('.screenshot-item').find('img'))
        $('.screenshot-item').find('img').each(function () {
            screenshotArr.push($(this).attr('src'))
        })
        let senJson = {
            gameName: $('#gameName').val(),
            gameType: $('.radio_item.current').attr('data-id'),
            gamePicture: screenshotArr.toString(),
            briefIntroduction: $('#briefIntroduction').val(),
            detailedIntroduction: $('#detailedIntroduction').val(),
            specialIntroduction: $('#specialIntroduction').val(),
            versionNo: $('#versionNo').val(),
            versionIntroduction: $('#versionIntroduction').val(),
            userId: $(this).val() == 1 ? userId : $('#tame-select-fabu').val(),
            gameUrl: gameUrl
        }
        if (!senJson.gameUrl && routerParams.game) {
            tipAlert('请上传游戏')
            return
        }
        if (!senJson.versionNo && routerParams.game) {
            tipAlert('请输入版本号')
            return
        }
        //
        $.ajax({
            url:`${baseUrl}/gameHub/recreation/releaseGame`,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(senJson),
            success (data) {
                if (data.code == 'false') {
                    tipAlert(data.errorMessage)
                } else {
                    tipAlert(data.success)
                }
                console.log(data)
            }
        })
        console.log(senJson)
    })
})
