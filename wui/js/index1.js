$(document).ready(function () {
  // 图片列表的宽度，只有宽度，无内边距外边距等
  var listPicWidth =  $('#smallPic').width();
  // window.onresize = function () {
  //   listPicWidth = $('#smallPic').width();   
  // }
 // li标签的宽度，包括宽度，外边距，内边距，边框
  var liWidth = $('.smallListItem').outerWidth(true);
 
  var clickTimes = 0;
    //  图片列表可以一次可以存放的li标签数量
    var count = Math.floor(listPicWidth / liWidth);
    //  数量的半值
     var half = Math.floor(count / 2);
 // 图片列表的点击
  var lists = $('#smallPic .smallListItem');
  // 默认设置当前第一个元素放大显示，且左键无
  $(lists[0]).addClass('active');
  $('#smallImg-prev').hide();
  // $('#img-prev').hide();


  // 图片列表li标签的点击，大小图片同时改变
 for (var i = 0; i < lists.length; i++) {
   var element = lists[i];   
   element.onclick = function () {
    //  大图片自定义的属性data-id
     var id = $('.img-view img').data('id');
     // 当前点击的list列表图片，对应跳转到开始图片的位置，怎么设置居中且所有图片串连起来，不空
     // 下面的左右键还需要按照当前的图片位置设置偏移，而不仅仅是开始时配置的
    //  当前大图片对应着小图片的偏移值
     var imgViewLeft = $('.smallListItem')[id].offsetLeft;
    //  li标签的宽度，包括宽度，外边距，内边距，边框
     var listWidth = $(lists[0]).outerWidth(true);
    //  小图片自定义的属性data-list
     var listId = $(this).data('list');
    // 点击li标签的距离左边的偏移值
     var oof = (listId - id) * listWidth + imgViewLeft;
  
    // 判断当前的listId是否在半值和最大值减去半值的区间
     if (listId > half && listId <= (lists.length - half)) {
      //  设置列表的左右按钮显示和隐藏
       $('#smallImg-prev').show()
       $('#smallImg-next').show()
       
      //  最终当前li标签的偏移值，主要是设置在中间位置
       $('.smallList').css('left', -1 * (oof - half * liWidth));
      //  listId小于半值，就不用跳转的
     } else if (listId < half) {
       $('.smallList').css('left', 0);
      //  而且还需设置左键隐藏不能点击
       $('#smallImg-prev').hide();
       $('#smallImg-next').show()
     }
     else if (listId > (lists.length - half)) {
      $('#smallImg-prev').show()
       $('.smallList').css('left', -1 * (lists.length - count) * listWidth);
       $('#smallImg-next').hide();
     }
    //  修改大图片的自定义属性id
     $('.img-view img').data('id', listId);
    //  更换图片的路径
     $('.img-view img')[0].src = $(this).find('img')[0].src.replace(/images2/g, 'images1');
    //  更换图片的标题
     $('.img-view img').attr('title', $(this).attr('title'));
    //  点击li即选中的li标签加上类，其他的移除类
     lists.removeClass('active');
     $(this).addClass('active');
   }
  }
  
  // 根据所有的li，设置ul的宽度,需考虑选中的li的宽度不同
  var activeLi = $('.smallListItem.active').outerWidth(true);
  // 设置ul的width值
  $('.smallList').css('width', (lists.length - 1) * liWidth + activeLi);
  

  // 图片右键
  $('#img-next').click(function () {
    // 选中的小图片li标签的自定义属性list
    var active = $('.smallListItem.active').data('list');
    active++;
    var listWidth = $(lists[0]).outerWidth(true);
    // 判断当前图片列表是否有li选中，
    if (active) {
      // 当图片到达最后时是设置没有图片还是回到第一张图片重新开始的
     if (active == lists.length ) {
      wui.errorNotice('没有图片');
      return;   
   }
      // 当前选中的li标签的偏移值
      var imgViewLeft = $('.smallListItem')[active].offsetLeft;
      // 判断当前的li标签的值大小区间的
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
     $('.smallList').css('left', -1 * (lists.length - count) * liWidth);
     $('#smallImg-next').hide();
      } 
      var str = $(lists[active]).find('img')[0].src;
      lists.removeClass('active');
      $(lists[active]).addClass('active');
      $('.img-view img').data('id', active);
      // console.log($('.img-view img').data('index'));
      $('.img-view img')[0].src = str.replace(/images2/g, 'images1');
      $('.img-view img').attr('title', $(lists[active]).attr('title'));
    } else {
      var id = $('.img-view img').data('id');
      // 第二个li标签的偏移值
      // var offset = $('.smallListItem')[1].offsetLeft;
      id++;
      if (id < count) {
        $('.smallList').css('left', 0);
      } else {
        $('.smallList').css('left', -1*(id -Math.floor(count/2))* liWidth);
      }
      
      // 更改图片路径
      var str = $(lists[id]).find('img')[0].src;
      //
      lists.removeClass('active');
      $(lists[id]).addClass('active');
      $('.img-view img').data('id', id);
      // console.log($('.img-view img').data('index'));
      $('.img-view img')[0].src = str.replace(/images2/g, 'images1');
      $('.img-view img').attr('title', $(lists[id]).attr('title'));
    }
   

  })
  // 图片左键
  $('#img-prev').click(function () {
    
    var active = $('.smallListItem.active').data('list');

    active--;
   
    if (active||active==0) {
       // 当图片到达最后时是设置没有图片还是回到第一张图片重新开始的??
      if ((active) < 0) {
       wui.errorNotice('当前图片是第一张，请往后翻');  
      return;   
   }
   
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
     $('.smallList').css('left', -1 * (lists.length - count) * liWidth);
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
      // var offset = $('.smallListItem')[1].offsetLeft;
      id--;
      // var ssss = $('.smallList').css('left').split('px')[0];
 
      if (id >(lists.length-count)) {
        $('.smallList').css('left', (lists.length-count).liWidth);
      } else {
        $('.smallList').css('left', -1*(id -Math.floor(count/2))* liWidth);
      }
      
      var str = $(lists[id]).find('img')[0].src;
      // console.log(str)
      lists.removeClass('active');
      $(lists[id]).addClass('active');
      $('.img-view img').data('id', id);
      // console.log($('.img-view img').data('index'));
      $('.img-view img')[0].src = str.replace(/images2/g, 'images1');
      $('.img-view img').attr('title', $(lists[id]).attr('title'));
    }
   
  })

  

    // 两者都点击后转换的clickTimes的值都高1，怎么判定设置？？还有偏移量有点bug
  // 图片列表左键
    $('#smallImg-prev').click(function () {
      $('#smallImg-next').show();
      
    // 如果没有图片，即当前li存数不够,未填充li，重新从第一个开始
      var times = Math.ceil($('.smallListItem').length / count);
      clickTimes--;

    //   if (clickTimes < 0) {
    //     wui.errorNotice('已是第一页');
    //     return;
    //  }
      var active = $('.smallListItem.active').data('list');
      // 当前列表ul的偏移值数字
      var ssss = $('.smallList').css('left').split('px')[0];
      if (active) {
        if (active < (count+Math.floor(count/2))) {
          $('.smallList').css('left', 0);
        } else {
          $('.smallList').css('left', -1  * (liWidth * (active-count-Math.floor(count/2)) ))
        }
      } else {
        if (Math.abs(ssss) < liWidth * count) {
        $('.smallList').css('left', 0)          
        } else {
          // console.log(offset * count + ssss)
          $('.smallList').css('left', -1 * ( Math.abs(ssss)-liWidth * count));
        }
      }
      $('.smallListItem').removeClass('active');

  })

  // 图片列表的右键
  $('#smallImg-next').click(function () {
    $('#smallImg-prev').show();
   
    clickTimes++;
    
    var times = Math.ceil($('.smallListItem').length / count);
    
    var active = $('.smallListItem.active').data('list');
    var ssss = $('.smallList').css('left').split('px')[0];
    if (Math.abs(ssss) >= liWidth*(lists.length-count)) {
      wui.errorNotice('已到最后一页');
      return;
    }
    if (active) {
      if (active >(lists.length-count)) {
        $('.smallList').css('left', -1*liWidth*(lists.length-count));
      } else {
        $('.smallList').css('left', -1  * (liWidth * (active+Math.floor(count/2)) ))
      }
    } else {
      if (Math.abs(ssss) > liWidth*(lists.length-count)) {
      $('.smallList').css('left', liWidth*(lists.length-count))          
      } else {
        $('.smallList').css('left', -1 * ( Math.abs(ssss)+liWidth * count));
      }
    }
    $('.smallListItem').removeClass('active');

  })
})