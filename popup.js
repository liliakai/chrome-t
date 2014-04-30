$(function() {
  var all_tabs = [];
  var input = $('#input');
  var div = $('#tabs');

  function switchToTab(element) {
    chrome.tabs.update(parseInt(element.attr('data-id')), {active: true});
  }

  chrome.tabs.query({}, function (tabs) {
    var matched = [];

    for (i=0; i < tabs.length; ++i) {
      var tab = tabs[i];
      div.append($("<p class='tab' data-id="+ tab.id + " data-str='"+ tab.title.toLowerCase() +"'>").text(tab.title));
      div.append($("<p class='tab' data-id="+ tab.id + " data-str='"+ tab.url.toLowerCase() +"'>").text(tab.url));
    }

    div.children().first().addClass('selected');
    input.on('input', function() {
      var value = input.val().toLowerCase();
      div.children().each(function(idx, tab) {
        tab = $(tab);
        tab.toggle(tab.attr('data-str').match(value) !== null);
      })
    });

    // "live" click handler binding since we dynamically add .tabs
    $(document).on('click', '.tab', function(e) {
      switchToTab($(e.target));
    });
    $(document).on('keypress', function(e) {
      if (e.charCode == 13) {
        switchToTab($('.selected'));
      }
    });
    $(document).on('keydown', function(e) {
      if (e.keyCode === 40 || e.keyCode === 38) { // ARROWED
        var visible = div.children(':visible');
        var current = div.find('.selected');
        var idx = visible.index(current);
        if (e.keyCode == 40 && idx < visible.length - 1) {
          // DOWN
          current.removeClass('selected');
          $(visible[idx+1]).addClass('selected');
        }
        else if (e.keyCode == 38 && idx > 0) {
          // UP
          current.removeClass('selected');
          $(visible[idx-1]).addClass('selected');
        }
        e.preventDefault();
      }
    });
  });
});
