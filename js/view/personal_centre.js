$(function () {
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
})
