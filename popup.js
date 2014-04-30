$(function() {
  var all_tabs = [];
  var input = $('#input');
  var div = $('#tabs');
  chrome.tabs.query({}, function (tabs) {
    all_tabs = tabs;
    var matched = [];

    function filterTabs(str) {
      matched = [];
      div.html("");
      for (i=0; i < all_tabs.length; ++i) {
        var tab = all_tabs[i];
        if (tab.title.match(str)) {
          div.append($("<p class='tab' data-id="+ tab.id + ">").text(tab.title));
        }
        if (tab.url.match(str)) {
          div.append($("<p class='tab' data-id="+ tab.id + ">").text(tab.url));
        }
      }
      div.children().first().addClass('selected');
    };

    input.on('input', function() { filterTabs(input.val()); });

    // "live" click handler binding since we dynamically add .tabs
    $(document).on('click', '.tab', function(e) {
      chrome.tabs.update(parseInt($(e.target).attr('data-id')), {active: true}, function(){});
    });
    $(document).on('keypress', function(e) {
      if (e.charCode == 13) {
        chrome.tabs.update(parseInt($('.selected').attr('data-id')), {active: true}, function(){});
      }
    });
    $(document).on('keydown', function(e) {
      if (e.keyCode == 40) { // DOWN ARROW
        var current = $('.selected');
        if (current.next().length > 0) {
          current.removeClass('selected');
          current.next().addClass('selected');
        }
      }
      if (e.keyCode == 38) { // UP ARROW
        var current = $('.selected');
        if (current.prev().length > 0) {
          current.removeClass('selected');
          current.prev().addClass('selected');
        }
      }
    });
  });
});
