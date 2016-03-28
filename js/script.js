$(function () {

  var RSSReader = function () {
    this.navigation = $('.page-header__navigation');
    this.posts = $('.page-posts');
    this.template = $('.page-posts__post-tmpl');
    this.feedUrl = 'http://node.dev.puzankov.com/rss/data';
    this.postsOnPage = 5;
    this.pagination = $('.widget-tags__tags');
    this.paginationNumber = 1;
    this.feedList = [];

    this.init();
  }

  RSSReader.prototype.init = function () {
    this.navigation.bind('click', this.onLinkClicked.bind(this));
    this.pagination.bind('click', this.onPaginationClick.bind(this));

    $('#navigation__habr').trigger('click');
  }

  RSSReader.prototype.onLinkClicked = function (e) {
    e.preventDefault();
    var feedID = e.target.getAttribute('href');

    this.makeRSSRequest(feedID)
    this.setUrlHash(feedID);
  };

  RSSReader.prototype.makeRSSRequest = function (feedID) {
    $.ajax({
          type: 'GET',
          url: this.feedUrl,
          data: {kind: feedID},
          dataType: 'JSON'
        })
        .success(this.getFeedList.bind(this))
        .error(function(error) {
          console.log(error);
        });
  }

  RSSReader.prototype.getFeedList = function (data) {
    this.feedList = data.items;

    this.render();
  }

  RSSReader.prototype.render = function () {
    var resultHtml = [],
        start = (this.paginationNumber - 1) * this.postsOnPage;

    this.makePagination(this.feedList);

    for(var i = start; i < start + this.postsOnPage; i++) {
      resultHtml.push(this.parseItem(this.feedList[i]));
    }

    this.posts.html('');
    this.posts.html(resultHtml);

  }

  RSSReader.prototype.parseItem = function (item) {
    var newItem = this.template.clone().removeClass('page-posts__post-tmpl'),
        date = new Date(item.pubDate),
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var summary = item.summary.replace('Читать дальше &rarr;', ''),
        year = date.getFullYear(),
        month = months[date.getMonth()];
        day = date.getDate();

    newItem
        .find('.post__header__title')
        .html(item.title);
    newItem
        .find('.post__text')
        .html(summary);
    newItem
        .find('.post__read-more')
        .attr('href', item.guid);
    newItem
        .find('.datetime__day')
        .html(day);
    newItem
        .find('.datetime__monyear')
        .html(month.toUpperCase() + ' ' + year);
    newItem
        .find('.post__header__written-by')
        .html('Written by ' + item.author);

    return newItem;
  }

  RSSReader.prototype.makePagination = function (data) {
    var paginationList = [];
    for(var i = 1; i <= (this.feedList.length / this.postsOnPage); i++) {
      paginationList.push('<a href="' + i + '" class="tag">' + i + '</a>')
    }

    this.pagination.html(paginationList);
  }

  RSSReader.prototype.onPaginationClick = function (e) {
    e.preventDefault();

    this.paginationNumber = e.target.getAttribute('href');

    this.render()
  }

  RSSReader.prototype.setUrlHash = function (hash) {
    window.location.hash = '#' + hash;
  }

  window.rssreader = new RSSReader();
});