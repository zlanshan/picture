$(document).ready(function () {

    // 计算可视环境下的li存放数量
  // 存放这些li的宽度-padding值，除以li的宽度
  // console.log($('#smallPic').width(), $('#smallPic').css('padding-right'));
  // console.log($('.smallListItem').css('width'),$('.smallListItem').css('margin-right'))
  // console.log($('#smallPic').css('width'));
  // 图片列表的右键
  // 存放列表图片的宽度，只有宽度，无内边距外边距等
  var listPicWidth = $('#smallPic').width();
  // li标签的宽度，包括宽度，外边距，内边距，边框
  var liWidth = $('.smallListItem').outerWidth(true);
  var clickTimes = 0;
 // 图片列表的点击
  var lists = $('#smallPic .smallListItem');
  // 默认设置当前第一个元素放大显示，且左键无
  $(lists[0]).addClass('active');
  $('#smallImg-prev').hide();
  // $('#img-prev').hide();

 // var currentSrc = $('.img-view img')[0].src;
 
 var indexL = 0;
 for (var i = 0; i < lists.length; i++) {
   var element = lists[i];
   // console.log(lists[i]);
   
   element.onclick = function () {
     var aa = $('.img-view img').data('id');
     // 当前点击的list列表图片，对应跳转到开始图片的位置，怎么设置居中且所有图片串连起来，不空
     // 下面的左右键还需要按照当前的图片位置设置偏移，而不仅仅是开始时配置的
     var imgViewLeft = $('.smallListItem')[aa].offsetLeft;
     var listWidth = $(lists[0]).outerWidth(true);
     var bb = $(this).data('list');

     var oof = (bb - aa) * listWidth + imgViewLeft;
     var count = Math.floor(listPicWidth / liWidth);

     var countLi = Math.floor(listPicWidth / liWidth);
     var half = Math.floor(count / 2);
     console.log(aa, bb, imgViewLeft, listWidth, -1 * oof);
     if (bb > half && bb <= (lists.length - half)) {
      //  设置列表的左右按钮显示和隐藏
       $('#smallImg-prev').show()
       $('#smallImg-next').show()
       
       //  $('.smallList').css('left', -1 * oof);
     $('.smallList').css('left', -1 *( oof-half * liWidth));
     } else if (bb < half) {
       $('.smallList').css('left', 0);
      //  而且还需设置左键隐藏不能点击
       $('#smallImg-prev').hide();
       $('#smallImg-next').show()
     }
     else if (bb > (lists.length - half)) {
      $('#smallImg-prev').show()
       $('.smallList').css('left', -1 * (lists.length - count) * listWidth);
       $('#smallImg-next').hide();
     }
    
     // 并使该元素居中，即整体平移？？
     // 获取当前点击的和正在展示的元素，
     $('.img-view img').data('id', bb);
     $('.img-view img')[0].src = $(this).find('img')[0].src.replace(/images2/g, 'images1');
     $('.img-view img').attr('title', $(this).attr('title'));
     lists.removeClass('active');
     $(this).addClass('active');
   }
 }
  // 根据所有的li，设置ul的宽度,需考虑选中的li的宽度不同
  var activeLi = $('.smallListItem.active').outerWidth(true);
  
  $('.smallList').css('width', (lists.length - 1) * liWidth + activeLi);
  
  // console.log($(".smallList").css('width'),lists.length,liWidth);
  // 图片右键
  $('#img-next').click(function () {
    var lists = $('#smallPic .smallListItem');
    var active = $('.smallListItem.active').data('list');
    
    active++;
    var listWidth = $(lists[0]).outerWidth(true);
    
    var count = Math.floor(listPicWidth / liWidth);

    var countLi = Math.floor(listPicWidth / liWidth);
    var half = Math.floor(count / 2);
    if (active) {
      // 当图片到达最后时是设置没有图片还是回到第一张图片重新开始的
     if (active == lists.length ) {
      wui.errorNotice('没有图片');
      return;   
   }
   // var oof = (bb - aa) * listWidth + imgViewLeft;
   var imgViewLeft = $('.smallListItem')[active].offsetLeft;
   if (active > half && active <=(lists.length - half)) {
    //  设置列表的左右按钮显示和隐藏
     $('#smallImg-prev').show()
     $('#smallImg-next').show()
     
     //  $('.smallList').css('left', -1 * oof);
   $('.smallList').css('left', -1 *( imgViewLeft-half * liWidth));
   } else if (active < half) {
     $('.smallList').css('left', 0);
    //  而且还需设置左键隐藏不能点击
     $('#smallImg-prev').hide();
     $('#smallImg-next').show()
   }
   else if (active > (lists.length - half)) {
    $('#smallImg-prev').show()
     $('.smallList').css('left', -1 * (lists.length - count) * listWidth);
     $('#smallImg-next').hide();
      } 
      var str = $(lists[active]).find('img')[0].src;
      console.log(str)
      lists.removeClass('active');
      $(lists[active]).addClass('active');
      $('.img-view img').data('id', active);
      // console.log($('.img-view img').data('index'));
      $('.img-view img')[0].src = str.replace(/images2/g, 'images1');
      $('.img-view img').attr('title', $(lists[active]).attr('title'));
    } else {
      var id = $('.img-view img').data('id');
      var offset = $('.smallListItem')[1].offsetLeft;
      id++;
      if (id < count) {
        $('.smallList').css('left', 0);
      } else {
        $('.smallList').css('left', -1*(id -Math.floor(count/2))* offset);
      }
      console.log((id-1) * offset,id)
      
      var str = $(lists[id]).find('img')[0].src;
      // console.log(str)
      lists.removeClass('active');
      $(lists[id]).addClass('active');
      $('.img-view img').data('id', id);
      // console.log($('.img-view img').data('index'));
      $('.img-view img')[0].src = str.replace(/images2/g, 'images1');
      $('.img-view img').attr('title', $(lists[id]).attr('title'));
    }
    
    // var index = 0;
    // for (var i = 0; i < lists.length; i++) {
    //   // console.log($('.img-view img').attr('title'),$(lists[i]).attr('title'))
    //   if ($('.img-view img').attr('title') == $(lists[i]).attr('title')) {
    //     index = i;
    //     index++;
    //     if (index == lists.length) {
    //       index = 0;
    //     }
    //     break;
    //   }
    // }
    // find
   

  })
  // 图片左键
  $('#img-prev').click(function () {
    var lists = $('#smallPic .smallListItem');
    var active = $('.smallListItem.active').data('list');
    active--;
    var listWidth = $(lists[0]).outerWidth(true);
    
    var count = Math.floor(listPicWidth / liWidth);

    var countLi = Math.floor(listPicWidth / liWidth);
    var half = Math.floor(count / 2);
    if (active) {
       // 当图片到达最后时是设置没有图片还是回到第一张图片重新开始的
     if (active < 0 ) {
      wui.errorNotice('当前图片是第一张，请往后翻');
      return;   
   }
   // var oof = (bb - aa) * listWidth + imgViewLeft;
   var imgViewLeft = $('.smallListItem')[active].offsetLeft;
   if (active > half && active <= (lists.length - half)) {
    //  设置列表的左右按钮显示和隐藏
     $('#smallImg-prev').show()
     $('#smallImg-next').show()
     
     //  $('.smallList').css('left', -1 * oof);
   $('.smallList').css('left', -1 *( imgViewLeft-half * liWidth));
   } else if (active < half) {
     $('.smallList').css('left', 0);
    //  而且还需设置左键隐藏不能点击
     $('#smallImg-prev').hide();
     $('#smallImg-next').show()
   }
   else if (active > (lists.length - half)) {
    $('#smallImg-prev').show()
     $('.smallList').css('left', -1 * (lists.length - count) * listWidth);
     $('#smallImg-next').hide();
      } 
      var str = $(lists[active]).find('img')[0].src;

      $('.img-view img')[0].src = str.replace(/images2/g, 'images1');
      lists.removeClass('active');
      $(lists[active]).addClass('active');
      $('.img-view img').data('id', active);
      $('.img-view img').attr('title', $(lists[active]).attr('title'));
    } else {
      var id = $('.img-view img').data('id');
      var offset = $('.smallListItem')[1].offsetLeft;
      id--;
      var ssss = $('.smallList').css('left').split('px')[0];
      console.log((lists.length - count));
      if (id >(lists.length-count)) {
        $('.smallList').css('left', (lists.length-count).offset);
      } else {
        $('.smallList').css('left', -1*(id -Math.floor(count/2))* offset);
      }
      console.log((id-1) * offset,id)
      
      var str = $(lists[id]).find('img')[0].src;
      // console.log(str)
      lists.removeClass('active');
      $(lists[id]).addClass('active');
      $('.img-view img').data('id', id);
      // console.log($('.img-view img').data('index'));
      $('.img-view img')[0].src = str.replace(/images2/g, 'images1');
      $('.img-view img').attr('title', $(lists[id]).attr('title'));
    }
   
    // var index = 0;
    // for (var i = 0; i < lists.length; i++) {
    //   // console.log($('.img-view img').attr('title'),$(lists[i]).attr('title'))
    //   if ($('.img-view img').attr('title') == $(lists[i]).attr('title')) {
    //     index = i;
    //     index--;
    //     if (index < 0) {
    //       index = lists.length - 1;
    //     }
    //     break;
    //   }
    // }
    // find
   
  })

  




    // 两者都点击后转换的clickTimes的值都高1，怎么判定设置？？还有偏移量有点bug
  // 图片列表左键
    $('#smallImg-prev').click(function () {
      $('#smallImg-next').show();
      
    var count = Math.floor(listPicWidth / liWidth);
 
    // 如果没有图片，即当前li存数不够,未填充li，重新从第一个开始
      var times = Math.ceil($('.smallListItem').length / count);
      clickTimes--;

    //   if (clickTimes < 0) {
    //     wui.errorNotice('已是第一页');
    //     return;
    //  }
     var offset = $('.smallListItem')[1].offsetLeft;
      var active = $('.smallListItem.active').data('list');
      var ssss = $('.smallList').css('left').split('px')[0];
      if (active) {
        if (active < (count+Math.floor(count/2))) {
          $('.smallList').css('left', 0);
        } else {
          $('.smallList').css('left', -1  * (offset * (active-count-Math.floor(count/2)) ))
        }
      } else {
        if (Math.abs(ssss) < offset * count) {
        $('.smallList').css('left', 0)          
        } else {
          console.log(offset * count + ssss)
          $('.smallList').css('left', -1 * ( Math.abs(ssss)-offset * count));
        }
      }
      $('.smallListItem').removeClass('active');
    // if (clickTimes <0) {
    //   clickTimes = times - 1;
    //   $('.smallList').css('left', -1 * (clickTimes) * (offset * count ));
    //   return;
    // }

    // $('.smallList').css('left',clickTimes = 0 ? (-1 *clickTimes  * ($('.smallListItem')[count].offsetLeft - 30)):30);
    // if (clickTimes == 0) {
    //   $('.smallList').css('left', 30);
    //   return;
    // }
    // $('.smallList').css('left', -1 * clickTimes  * ($('.smallListItem')[count].offsetLeft - clickTimes * 30));
    // if (clickTimes == 0) {
    //   clickTimes = times - 1;
    //   $('.smallList').css('left', -1 * (clickTimes-1) * (offset * count ));
    //   // $('.smallList').css('left', 0);
    // } else {
    // $('.smallList').css('left', -1 * (clickTimes-1) * (offset * count ));
      
    // }
    // $('.smallList').css('left', -1 * (clickTimes) * (offset * count ));

  })

  // 图片列表的右键
  $('#smallImg-next').click(function () {
    $('#smallImg-prev').show();
    var lists = $('#smallPic .smallListItem');

    var count = Math.floor(listPicWidth / liWidth);
    clickTimes++;
    console.log(clickTimes);
    // 怎么一下展示后面的所有项
    // count = count + 1;
    var times = Math.ceil($('.smallListItem').length / count);
    
    var offset = $('.smallListItem')[1].offsetLeft;

    var active = $('.smallListItem.active').data('list');
    var ssss = $('.smallList').css('left').split('px')[0];
    if (Math.abs(ssss) >= offset*(lists.length-count)) {
      wui.errorNotice('已到最后一页');
      return;
    }
    if (active) {
      if (active >(lists.length-count)) {
        $('.smallList').css('left', -1*offset*(lists.length-count));
      } else {
        $('.smallList').css('left', -1  * (offset * (active+Math.floor(count/2)) ))
      }
    } else {
      if (Math.abs(ssss) > offset*(lists.length-count)) {
      $('.smallList').css('left', offset*(lists.length-count))          
      } else {
        // console.log(offset * count + ssss)
        $('.smallList').css('left', -1 * ( Math.abs(ssss)+offset * count));
      }
    }
    $('.smallListItem').removeClass('active');
    console.log(count, times);

    // if (clickTimes == (times-1)) {
    //   clickTimes = 0;
    // $('.smallList').css('left', 0);
    //   return;
    // }
    

    // // if (clickTimes == (times-1)) {
    // //   $('.smallList').css('left', -1 * (clickTimes) * (offset*count + 30));
    // //   return;
    // // }
    // $('.smallList').css('left', -1 * (clickTimes) * (offset * count));
     
    // console.log(times,clickTimes);

  })
})