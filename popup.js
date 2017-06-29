$(function() {
  $('#input').focus();
  var div = $('#tabs');

  function buildTab(tab) {
    var p = $("<p>").addClass('tab').
                     attr('data-tabId', tab.id).
                     attr('data-windowId', tab.windowId).
                     attr('data-title', tab.title.toLowerCase()).
                     attr('data-url', tab.url.toLowerCase());
    $('<img>').attr('src', tab.favIconUrl).appendTo(p);
    $('<span>').addClass('text').text(tab.title).appendTo(p);
    if (tab.title != tab.url) {
      $('<small>').addClass('url').
                  text(tab.url).
                  appendTo(p.find('.text'));
    }
    return p;
  }
  chrome.tabs.query({}, function getTabs(tabs) {
    $.each(tabs, function(i, tab) {
      div.append(buildTab(tab));
    });

    div.children().first().addClass('selected');
  });

  $('#input').on('input', function filterTabs() {
    var value = $(this).val().toLowerCase();
    div.children().each(function(idx, tab) {
      tab = $(tab);
      tab.toggle(tab.attr('data-title').match(value) !== null ||
                 tab.attr('data-url').match(value) !== null);
    })
    var selected = div.find('.selected');
    if (!selected.is(':visible')) {
      selected.removeClass('selected');
      div.children(':visible').first().addClass('selected');
    }
  });

  function switchToTab(element) {
    var tabId = parseInt(element.attr('data-tabId'));
    var windowId = parseInt(element.attr('data-windowId'));
    chrome.tabs.update(tabId, {active: true});
    chrome.windows.update(windowId, {focused: true});
  }

  // "live" click handler binding since we dynamically add .tabs
  $(document).on('click', '.tab', function(e) {
    switchToTab($(e.target).closest('.tab'));
  });
  $(document).on('keypress', function(e) {
    if (e.charCode == 13) {
      switchToTab($('.selected'));
    }
  });
  $(document).on('keydown', function(e) {
    if (
        e.keyCode === 40 || e.keyCode === 38 || // ARROWED
      ((e.keyCode == 74 || e.keyCode == 75) && e.ctrlKey) // ctrl + j/k
    ) {
      var visible = div.children(':visible');
      var current = div.find('.selected');
      var idx = visible.index(current);
      if ((e.keyCode == 74 || e.keyCode == 40) && idx < visible.length - 1) {
        // DOWN
        current.removeClass('selected');
        $(visible[idx+1]).addClass('selected');
      }
      else if ((e.keyCode == 38 || e.keyCode == 75) && idx > 0) {
        // UP
        current.removeClass('selected');
        $(visible[idx-1]).addClass('selected');
      }
      e.preventDefault();
    }
  });
});
