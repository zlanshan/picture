$(document).ready(function () {

  wui.ajax({
    method: 'get',
    url: '../json/pic.json',
    onSuccess: function (res) {
      var html = template('picList', {
        rows: res.rows
      });
      $('.pic-smallList').html(html);
    },
    onError: function (res) {
      console.error(res);
    },
    dataType: 'json'
  })
  // 图片列表的宽度，只有宽度，无内边距外边距等
  var listPicWidth = $('#smallPic').width();
  // window.onresize = function () {
  //   listPicWidth = $('#smallPic').width();   
  // }
  // li标签的宽度，包括宽度，外边距，内边距，边框
  // var liWidth = $('.smallListItem').outerWidth(true);
  // console.log(liWidth, listPicWidth);
  var clickTimes = 0;

  // 图片列表的点击
  var lists = $('#smallPic .pic-smallListItem');

  // 默认设置当前第一个元素放大显示，且左键无
  $(lists[0]).addClass('pic-active');
  $('#img-prev').hide();
  $('#smallImg-prev').hide();
  // $('#img-prev').hide();

  function imgHover($) {
    $.hover(function () {
      // $('#smallImg-prev').show();
      $[0].style.opacity = 1;
    }, function () {
      // $('#img-prev').hide();
      $[0].style.opacity = 0;
  
    })
  }

  imgHover($('#img-prev'));
  imgHover($('#img-next'));

  // $('#img-prev').hover(function () {
  //   // $('#smallImg-prev').show();
  //   $('#img-prev')[0].style.opacity = 1;
  // }, function () {
  //   // $('#img-prev').hide();
  //   $('#img-prev')[0].style.opacity = 0;

  // })
  // $('#img-next').hover(function () {
  //   // $('#smallImg-prev').show();
  //   $('#img-next')[0].style.opacity = 1;
  // }, function () {
  //   // $('#img-prev').hide();
  //   $('#img-next')[0].style.opacity = 0;

  // })

  function imgView( el,lists,listId) {
    var str = el.find('img')[0].src;
    $('.pic-img-view img').data('id', listId);
    //  更换图片的路径
    $('.pic-img-view img')[0].src = str.replace(/images2/g, 'images1');
    //  更换图片的标题
    $('.pic-img-view img').attr('title', el.attr('title'));
    $('.pic-contentBottom').text(el.attr('title'));
    //  点击li即选中的li标签加上类，其他的移除类
    // lists.removeClass('active');
    lists.removeClass('pic-active');
    el.addClass('pic-active');
}


  $('.pic-smallList').on('click', 'li', function () {
    $('#img-prev').show()
    $('#img-next').show()
    // var liWidth = $('.smallListItem').outerWidth(true);
    var lists = $('#smallPic .pic-smallListItem');

    var liWidth = $('.pic-smallListItem').outerWidth(true);
    //  图片列表可以一次可以存放的li标签数量
    var count = Math.floor(listPicWidth / liWidth);
    //  数量的半值
    var half = Math.floor(count / 2);
    //  大图片自定义的属性data-id
    var id = $('.pic-img-view img').data('id');
    // 当前点击的list列表图片，对应跳转到开始图片的位置，怎么设置居中且所有图片串连起来，不空
    // 下面的左右键还需要按照当前的图片位置设置偏移，而不仅仅是开始时配置的
    //  当前大图片对应着小图片的偏移值
    var imgViewLeft = $('.pic-smallListItem')[id].offsetLeft;
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
      $('.pic-smallList').css('left', -1 * (oof - half * liWidth));
      //  listId小于半值，就不用跳转的
    } else if (listId < half) {
      $('.pic-smallList').css('left', 0);
      //  而且还需设置左键隐藏不能点击
      $('#smallImg-prev').hide();
      $('#smallImg-next').show()
    } else if (listId > (lists.length - half)) {
      $('#smallImg-prev').show()
      $('.pic-smallList').css('left', -1 * (lists.length - count) * listWidth);
      $('#smallImg-next').hide();
    }

    imgView( $(this), $(lists),listId);
    //  修改大图片的自定义属性id
    // $('.pic-img-view img').data('id', listId);
    // //  更换图片的路径
    // $('.pic-img-view img')[0].src = $(this).find('img')[0].src.replace(/images2/g, 'images1');
    // //  更换图片的标题
    // $('.pic-img-view img').attr('title', $(this).attr('title'));
    // $('.pic-contentBottom').text($(this).attr('title'));
    // //  点击li即选中的li标签加上类，其他的移除类
    // // lists.removeClass('active');
    // $(lists).removeClass('pic-active');
    // $(this).addClass('pic-active');
  })

  // // 图片列表li标签的点击，大小图片同时改变
  // for (var i = 0; i < lists.length; i++) {

  // }

  // 根据所有的li，设置ul的宽度,需考虑选中的li的宽度不同
  var activeLi = $('.pic-smallListItem.pic-active').outerWidth(true);
  // 设置ul的width值
  // $('.smallList').css('width', (lists.length - 1) * liWidth + activeLi);


  // 图片右键
  $('#img-next').click(function () {
    $('#img-prev').show();
    var lists = $('#smallPic .pic-smallListItem');

    var liWidth = $('.pic-smallListItem').outerWidth(true);
    //  图片列表可以一次可以存放的li标签数量
    var count = Math.floor(listPicWidth / liWidth);
    //  数量的半值
    var half = Math.floor(count / 2);
    // 选中的小图片li标签的自定义属性list
    var active = $('.pic-smallListItem.pic-active').data('list');
    active++;
    var listWidth = $(lists[0]).outerWidth(true);
    // 判断当前图片列表是否有li选中，
    if (active) {
      // 当图片到达最后时是设置没有图片还是回到第一张图片重新开始的
      if (active == lists.length) {
        var options = {
          time: 2 * 1000, //设置最大等待时长
          icon: 0
        };
        wui.message("已是最后一张图片", options);
        $('#img-next').hide();
        $('#img-prev').show();
        return;
      }
      $('#img-next').show();

      // 当前选中的li标签的偏移值
      var imgViewLeft = $('.pic-smallListItem')[active].offsetLeft;
      // 判断当前的li标签的值大小区间的
      if (active > half && active <= (lists.length - half)) {
        $('#img-next').show();
        $('#img-prev').show();

        //  设置列表的左右按钮显示和隐藏
        $('#smallImg-prev').show()
        $('#smallImg-next').show()

        //  $('.smallList').css('left', -1 * oof);
        $('.pic-smallList').css('left', -1 * (imgViewLeft - half * liWidth));
        // console.log($('.pic-smallList'));
      } else if (active < half) {
        $('#img-next').show();
        $('.pic-smallList').css('left', 0);
        //  而且还需设置左键隐藏不能点击
        $('#smallImg-prev').hide();
        $('#img-prev').show();
        $('#smallImg-next').show()
      } else if (active > (lists.length - half)) {
        $('#img-next').show();
        $('#smallImg-prev').show()
        $('.pic-smallList').css('left', -1 * (lists.length - count) * liWidth);
        $('#img-prev').show();
        $('#smallImg-next').hide();
      }
      // var str = $(lists[active]).find('img')[0].src;
      // $(lists).removeClass('pic-active');
      // $(lists[active]).addClass('pic-active');
      // $('.pic-img-view img').data('id', active);
      // // console.log($('.img-view img').data('index'));
      // $('.pic-img-view img')[0].src = str.replace(/images2/g, 'images1');
      // $('.pic-img-view img').attr('title', $(lists[active]).attr('title'));
      // $('.pic-contentBottom').text($(lists[active]).attr('title'));
      imgView( $(lists[active]), $(lists),active);

    } else {
      var id = $('.pic-img-view img').data('id');
      // 第二个li标签的偏移值
      // var offset = $('.smallListItem')[1].offsetLeft;
      id++;
      if (id < count) {
        $('.pic-smallList').css('left', 0);
      } else {
        $('.pic-smallList').css('left', -1 * (id - Math.floor(count / 2)) * liWidth);
      }
      imgView( $(lists[id]), $(lists),id);

      // 更改图片路径
      // console.log($(lists[id]).find('img')[0]);
      // var str = $(lists[id]).find('img')[0].src;
      // //
      // lists.removeClass('pic-active');
      // $(lists[id]).addClass('pic-active');
      // $('.pic-img-view img').data('id', id);
      // // console.log($('.img-view img').data('index'));
      // $('.pic-img-view img')[0].src = str.replace(/images2/g, 'images1');
      // $('.pic-img-view img').attr('title', $(lists[id]).attr('title'));
      // $('.pic-contentBottom').text($(lists[id]).attr('title'));

    }


  })
  // 图片左键
  $('#img-prev').click(function () {
    $('#img-next').show();
    var lists = $('#smallPic .pic-smallListItem');

    var liWidth = $('.pic-smallListItem').outerWidth(true);
    //  图片列表可以一次可以存放的li标签数量
    var count = Math.floor(listPicWidth / liWidth);
    //  数量的半值
    var half = Math.floor(count / 2);
    var active = $('.pic-smallListItem.pic-active').data('list');

    active--;

    if (active || active == 0) {
      // 当图片到达最后时是设置没有图片还是回到第一张图片重新开始的??
      if ((active) < 0) {

        var options = {
          time: 2 * 1000, //设置最大等待时长
          icon: 0
        };
        wui.message("已是第一张图片", options);
        $('#img-next').show();
        $('#img-prev').hide();
        return;
      }

      var imgViewLeft = $('.pic-smallListItem')[active].offsetLeft;
      if (active > half && active <= (lists.length - half)) {
        //  设置列表的左右按钮显示和隐藏
        $('#smallImg-prev').show()
        $('#smallImg-next').show()

        //  $('.smallList').css('left', -1 * oof);
        $('.pic-smallList').css('left', -1 * (imgViewLeft - half * liWidth));
      } else if (active < half) {
        $('.pic-smallList').css('left', 0);
        //  而且还需设置左键隐藏不能点击
        $('#smallImg-prev').hide();
        $('#smallImg-next').show()
      } else if (active > (lists.length - half)) {
        $('#smallImg-prev').show()
        $('.pic-smallList').css('left', -1 * (lists.length - count) * liWidth);
        $('#smallImg-next').hide();
      }
    imgView( $(lists[active]), $(lists),active);

      // var str = $(lists[active]).find('img')[0].src;

      // $('.pic-img-view img')[0].src = str.replace(/images2/g, 'images1');
      // lists.removeClass('pic-active');
      // $(lists[active]).addClass('pic-active');
      // $('.pic-img-view img').data('id', active);
      // $('.pic-img-view img').attr('title', $(lists[active]).attr('title'));
      // $('.pic-contentBottom').text($(lists[active]).attr('title'));

    } else {
      var id = $('.img-view img').data('id');
      // var offset = $('.smallListItem')[1].offsetLeft;
      id--;
      // var ssss = $('.smallList').css('left').split('px')[0];

      if (id > (lists.length - count)) {
        $('.pic-smallList').css('left', (lists.length - count).liWidth);
      } else {
        $('.pic-smallList').css('left', -1 * (id - Math.floor(count / 2)) * liWidth);
      }
      imgView( $(lists[id]), $(lists),id);

      // var str = $(lists[id]).find('img')[0].src;
      // // console.log(str)
      // lists.removeClass('active');
      // $(lists[id]).addClass('active');
      // $('.pic-img-view img').data('id', id);
      // // console.log($('.img-view img').data('index'));
      // $('.pic-img-view img')[0].src = str.replace(/images2/g, 'images1');
      // $('.pic-img-view img').attr('title', $(lists[id]).attr('title'));
      // $('.pic-contentBottom').text($(lists[id]).attr('title'));

    }

  })



  // 两者都点击后转换的clickTimes的值都高1，怎么判定设置？？还有偏移量有点bug
  // 图片列表左键
  $('#smallImg-prev').click(function () {
    var lists = $('#smallPic .pic-smallListItem');

    var liWidth = $('.pic-smallListItem').outerWidth(true);
    //  图片列表可以一次可以存放的li标签数量
    var count = Math.floor(listPicWidth / liWidth);
    //  数量的半值
    var half = Math.floor(count / 2);
    $('#smallImg-next').show();

    // 如果没有图片，即当前li存数不够,未填充li，重新从第一个开始
    var times = Math.ceil($('.pic-smallListItem').length / count);
    clickTimes--;
    //   if (clickTimes == 0) {
    //     // wui.errorNotice('已是第一页');
    //     $('#smallImg-prev').hide();
    //     return;
    //  }

    var active = $('.pic-smallListItem.pic-active').data('list');
    // 当前列表ul的偏移值数字
    var ssss = $('.pic-smallList').css('left').split('px')[0];
    if (active) {
      $('#smallImg-prev').show();
      if (active < (count + Math.floor(count / 2))) {
        $('.pic-smallList').css('left', 0);
      } else {
        $('.pic-smallList').css('left', -1 * (liWidth * (active - count - Math.floor(count / 2))))
      }
    } else {
      if (Math.abs(ssss) < liWidth * count) {
        $('#smallImg-prev').hide();

        $('.pic-smallList').css('left', 0)
      } else {
        // console.log(offset * count + ssss)
        $('.pic-smallList').css('left', -1 * (Math.abs(ssss) - liWidth * count));
      }
    }
    $('.pic-smallListItem').removeClass('pic-active');

  })

  // 图片列表的右键
  $('#smallImg-next').click(function () {
    var lists = $('#smallPic .pic-smallListItem');

    var liWidth = $('.pic-smallListItem').outerWidth(true);
    //  图片列表可以一次可以存放的li标签数量
    var count = Math.floor(listPicWidth / liWidth);
    //  数量的半值
    var half = Math.floor(count / 2);
    $('#smallImg-prev').show();

    clickTimes++;

    var times = Math.ceil($('.pic-smallListItem').length / count);
    // if (clickTimes == times) {
    //   wui.errorNotice('已到最后一页');
    //   $('#smallImg-next').hide();
    //   return;
    // }
    var active = $('.pic-smallListItem.pic-active').data('list');
    var ssss = $('.pic-smallList').css('left').split('px')[0];

    if (Math.abs(ssss) >= liWidth * (lists.length - count)) {
      wui.errorNotice('已到最后一页');
      $('#smallImg-next').hide();
      return;
    }
    if (active) {
      $('#smallImg-next').show();

      if (active > (lists.length - count)) {
        $('.pic-smallList').css('left', -1 * liWidth * (lists.length - count));
      } else {
        $('.pic-smallList').css('left', -1 * (liWidth * (active + Math.floor(count / 2))))
      }
    } else {
      if (Math.abs(ssss) > liWidth * (lists.length - count)) {
        $('.pic-smallList').css('left', liWidth * (lists.length - count))
      } else {
        $('.pic-smallList').css('left', -1 * (Math.abs(ssss) + liWidth * count));
      }
    }
    $('.pic-smallListItem').removeClass('pic-active');

  })
})