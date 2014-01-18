$(function() {

  var doc;
  var device;
  var platformToggle;
  var windowWidth;
  var windowHeight;
  var pageHeight;
  var contentPadding;
  var footerHeight;
  var noticeBanner;
  var componentsList;
  var navComponentLinks;
  var contentSection;
  var currentActive;
  var topCache;
  var eventListeners;

  var initialize = function  () {
    currentActive        = 0;
    topCache             = [];
    win                  = $(window);
    doc                  = $(document);
    bod                  = $(document.body)
    device               = device || $('.device');
    platformToggle       = $('.platform-toggle');
    noticeBanner         = $('.notice-banner');
    navComponentLinks    = $('.docs-nav');
    componentsList       = $('.components-list');
    componentLinks       = $('.component-example a');
    contentSection       = $('.component');
    topCache             = contentSection.map(function () { return $(this).offset().top })
    windowHeight         = $(window).height() / 3
    pageHeight           = $(document).height();
    contentPadding       = parseInt($('.docs-content').css('padding-bottom'));
    footerHeight         = $('.docs-footer').outerHeight(false);

    device.initialLeft   = device.offset().left;
    device.initialTop    = device.initialTop || device.offset().top;
    device.dockingOffset = ($(window).height() - device.height())/2;
    checkDesktopContent();
    calculateScroll();

    if (!eventListeners) addEventListeners();
  }

  var addEventListeners = function () {
    eventListeners = true;

    noticeBanner.on('click', function () {
      $(this).hide();
    });

    device.on('click', function (e) {
      e.preventDefault();
    });

    navComponentLinks.click(function(e) {
      e.stopPropagation();
      e.preventDefault();
      componentsList.toggleClass('active');
    })

    doc.on('click', function () {
      componentsList.removeClass('active');
    })

    // Platform switcher
    $('.platform-switch').on('click', function () {
      var components = $('.docs-components');
      var platform   = $(this).attr('data-platform');

      // Set platform
      if (components.hasClass('platform-ios')) {
        components.removeClass('platform-ios');
        components.addClass(platform);
      } else if (components.hasClass('platform-android')) {
        components.removeClass('platform-android');
        components.addClass(platform);
      } else {
        components.addClass(platform);
      }

      // Deal with selected states
      $(this).siblings('.selected').removeClass('selected');
      $(this).addClass('selected');
    });

    win.on('scroll', calculateScroll);
  }

  var checkDesktopContent = function () {
    windowWidth = $(window).width();
    if (windowWidth <= 768) {
      var content = $('.content')
      if (content.length > 1) {
        $(content[0]).remove()
      }
    }
  }

  var calculateScroll = function() {
    // if small screen don't worry about this
    if (windowWidth <= 768) return

    // Save scrollTop value
    var contentSectionItem;
    var currentTop = win.scrollTop();

    if((device.initialTop - currentTop) <= device.dockingOffset + 113) {
      device[0].className = "device device-fixed";
      device.css({top: device.dockingOffset})
    } else {
      device[0].className = "device"
      device[0].setAttribute('style','')
    }

    if(currentTop >= $('.docs-masthead').outerHeight()) {
      platformToggle.addClass('fixed');
      $('.docs-components').css('padding-top', platformToggle.outerHeight());
    } else {
      platformToggle.removeClass('fixed');
      $('.docs-components').css('padding-top', 0);
    }

    // Injection of components into device
    for (var l = contentSection.length; l--;) {
      if ((topCache[l] - currentTop) < windowHeight) {
        if (currentActive == l) return;
        currentActive = l;
        bod.find('.component.active').removeClass('active');
        contentSectionItem = $(contentSection[l])
        contentSectionItem.addClass('active')
        if(contentSectionItem.attr('id')) {
          device.attr("id", contentSectionItem.attr('id') + "InDevice");
        } else {
          device.attr("id", "")
        }
        if (!contentSectionItem.hasClass('informational')) {
          updateContent(contentSectionItem.find('.highlight .html').text())
        }
        break
      }
    }

    function updateContent(content) {
      $('#iwindow').html(content);
    }
  }

  $(window).on('load resize', initialize);
  $(window).on('load', function () { new FingerBlast('.device-content'); });
});
