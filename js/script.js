$(function () {

  var RSSReader = function () {
    this.navigation = $('.page-header__navigation');
    this.posts = $('.page-posts');
    this.template = $('.page-posts__post-tmpl');
    this.feedUrl = 'http://node.dev.puzankov.com/rss/data';

    this.init();
  }

  RSSReader.prototype.init = function () {
    this.navigation.bind('click', this.onLinkClicked.bind(this));
  }

  RSSReader.prototype.onLinkClicked = function (e) {
    e.preventDefault();
    var feedID = e.target.getAttribute('href');

    this.makeRSSRequest(feedID)
  };

  RSSReader.prototype.makeRSSRequest = function (feedID) {
    $.ajax({
          type: 'GET',
          url: this.feedUrl,
          data: {kind: feedID},
          dataType: 'JSON'
        })
        .success(this.parseData.bind(this))
        .error(function(error) {
          console.log(error);
        });
  }

  RSSReader.prototype.parseData = function (data) {
    var __self = this;
    var tmpl = '<article class="page-posts__post"><header class="post__header"><time class="post__header__date" datetime="{{datetime-attr}}"><span class="datetime__day">{{datetime-day}}</span><span class="datetime__monyear">{{datetime-month-year}}</span></time><div class="post__header__headline"><div class="post__header__title">{{post-title}}</div><div class="post__header__written-by">Written by {{post-written-by}}</div></div></header><div class="post__text">{{post-text}}</div><a href="{{post-readmore}}" class="post__read-more">Read More</a><footer class="post__footer"><div class="post__footer__category">Standart</div><div class="post__footer__category">Status</div><div class="post__footer__category">Comments</div><i class="post__icon fa fa-thumb-tack"></i></footer></article>',
        dataItems = data.items,
        resultHtml = [];
    //datetime-attr
    //datetime-day
    //{{datetime-month-year}}
    //{{post-title}}
    //{{post-written-by}}
    //{{post-img}}
    //{{post-text}}
    //{{post-readmore}}

    console.log(data);

    dataItems.forEach(function (item) {
      resultHtml.push(__self.parseItem(item));
    });

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

    console.log(item);

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

  window.rssreader = new RSSReader();
});