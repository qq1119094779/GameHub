
$(function () {
    /*icheck js*/
    $('input.icheck').iCheck({
        checkboxClass: 'icheckbox_flat-red',
        radioClass: 'iradio_flat-red'
    });
    $('.btn_submit').on('click', function () {
        var email = $('.email').val();
        var password = $('.password').val();
        var username = $('.username').val();
        if (email == '' || password == '' || username == '') {
            tipAlert('请将内容填写完整')
        } else if (!$("input[type='checkbox']").is(':checked')) {
            tipAlert('请勾选同意协议')
        } else {
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                url: 'http://106.14.206.226:8080/gameHub/user/register',
                data: JSON.stringify({
                    email: email,
                    password: password,
                    checkPassword: password,
                    nickName: username
                }),
                success: function (data) {
                    console.log(data)
                    if (data.code == "false") {
                        var msg = data.errorMessage;
                        tipAlert(data.errorMessage)
                    } else {
                        var msg = data.success;
                        tipAlert(msg)
                        setTimeout(function () {
                            window.location.href = '/login.html'
                        }, 3000)
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }

    })
    ;(() => {
    })();
    var x = "";
    $(".comImageValidate").ready(function () {
        validateImageInit();
        $(".refresh").click(function () {
            validateImageInit();
        })
        $(".hkinnerWrap").mouseover(function(){
            $(".imgBg").css("display","block");
            $(".refresh").css("display","block");
        }).mouseleave(function () {
            $(".imgBg").css("display","none");
            $(".refresh").css("display","none");
        });

        $(".imgBg").mouseover(function(){
            $(".imgBg").css("display","block");
            $(".refresh").css("display","block");
        }).mouseleave(function () {
            $(".imgBg").css("display","none");
            $(".refresh").css("display","none");
        });


        $('.v_rightBtn').on({
            mousedown: function(e) {
                // $(".huakuai").html('');
                $(".hkinnerWrap").removeClass("red green")
                var el = $(this);
                var os = el.offset();
                dx = e.pageX - os.left;
                //$(document)
                $(this).parents(".hkinnerWrap").off('mousemove');
                $(this).parents(".hkinnerWrap").on('mousemove', function(e) {
                    var newLeft=e.pageX - dx;
                    el.offset({
                        left: newLeft
                    });
                    var newL=parseInt($(".v_rightBtn").css("left"));
                    if(newL<=0){
                        newL=0;
                    }else if (newL>=298){
                        newL=306;
                    }
                    $(".v_rightBtn").css("left",newL+"px");
                    $(".imgBtn").offset({
                        left: newLeft
                    });
                    $(".imgBtn").css("left",newL+"px")
                }).on('mouseup', function(e) {
                    //$(document)
                    $(this).off('mousemove');
                })
            }
        }).on("mouseup",function () {
            $(this).parents(".hkinnerWrap").off('mousemove');
            var l=$(this).css("left");
            if(l.indexOf("px")!=-1){
                l=l.substring(0,l.length-2);
            }
            x = l;
            submitDate(l)
        })

    });
    /*图形验证*/
    function submitDate(x) {
        console.log(x);
        $.ajax({
            url:"http://106.14.206.226:8080/gameHub/verifiy/checkPhoto?X="+x,
            dataType:'json',
            type: "POST",
            success:function (data) {
                if(data==true){
                    $(".hkinnerWrap").addClass("green").removeClass("red");
                    $(".hkinnerWrap input[name='validX']").val(x);
                    $("#X").val(x);
                    //$("#Y").val(y);
                    alert("验证成功");
                    layer.msg("验证成功", {time:1000,icon:1})
                } else {
                    $(".hkinnerWrap").addClass("red").removeClass("green");
                    setTimeout(function(){
                        $(".hkinnerWrap").removeClass("red green");
                        $(".v_rightBtn").css("left",0);
                        $(".imgBtn").css("left",0);
                    },280)
                    validateImageInit();
                }
            }
        })
    }

    /*初始化图形验证码*/
    function validateImageInit() {
        $.ajax({
            url:"http://106.14.206.226:8080/gameHub/verifiy/get_img_verify",
            dataType:'json',
            cache:false,
            type: "get",
            success:function (data) {
                // $(".huakuai").html('向右滑动滑块填充拼图完成验证');
                $(".imgBg").css("background",'#fff url("data:image/jpg;base64,'+data.oriCopyImage+'")');
                $(".imgBtn").css('top','5px');
                $(".imgBtn").find("img").attr("src","data:image/png;base64,"+data.newImage)
                $(".hkinnerWrap").removeClass("red green");
                $(".v_rightBtn").css("left",0);
                $(".imgBtn").css("left",0);
            },error:function(err){
                validateImageInit();
            }
        })
    }
})
