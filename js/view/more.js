$(function () {
    let sendJson = {
        pageNo: 1,
        pageSize: 16,
        classify: 1
    }
    let isLoad = true
    let pageAll = null
    let render = () => {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            url: `${baseUrl}/gameHub/home/findGameList`,
            data: JSON.stringify(sendJson),
            success (data) {
                let setHtml = ''
                pageAll = data.totalPages
                sendJson.pageNo++
                isLoad = true
                data.dataList.forEach(value => {
                    // classify=1
                    setHtml += `<li>
                        <div class="item ease-3 clearfix">
                            <a href="trial_details.html?&id=${value.id}">
                                <div class="pic"><img src="${fileUrl}${value.gamePic}" alt="${value.gameName}"></div>
                                <div class="txt">
                                    <div class="title" title="${value.gameName}">${value.gameName}</div>
                                    <p class="des txt-666 mb10" title="${value.briefIntroduction}" style="height: 38px; overflow:hidden;">${value.briefIntroduction}</p>
                                    <p class="date txt-999">${formatTime(new Date(value.createTime))}</p>
                                </div>
                            </a>
                        </div>
                    </li>`
                })
                $('#game-List').append(setHtml)
                console.log(data)
            },
            error (err) {
            }
        })
    }
    render()
    $(document).scroll(function () {
        if (scrollbars($('#game-List'))) {
            if (isLoad && sendJson.pageNo<=pageAll) {
                isLoad = false
                render()
            }
        }
    })
})
