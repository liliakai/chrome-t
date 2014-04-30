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
    };

    input.on('input', function() { filterTabs(input.val()); });

    // "live" click handler binding since we dynamically add .tabs
    $(document).on('click', '.tab', function(e) {
      chrome.tabs.highlight({tabs: parseInt($(e.target).attr('data-id'))}, function(){});
    });
  });
});
