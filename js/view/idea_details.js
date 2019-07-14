$(function () {
  let sendJson = {classify: 2}
  $.ajax({
    type: "POST",
    contentType: 'application/json',
    url: baseUrl + "/gameHub/recreation/gameDetails",
    dataType: "json",
    data: JSON.stringify(sendJson),
    success (data) {
      console.log('data', data)
    },
    error (err) {

    }
  })
})
