$.InfiniteTweets = function (el) {
  this.$el = $(el);
  this.$feed = this.$el.find("#feed");
  this.$moreLink = this.$el.find("a.fetch-more");
  this.maxCreatedAt = null;
  this.$moreLink.on("click", this.fetchTweets.bind(this));
};

$.InfiniteTweets.prototype = {
  fetchTweets: function (event) {
    if(this.maxCreatedAt === null) {
      $.ajax({
        url: "/feed",
        dataType: 'json',
        success: this.insertTweets.bind(this)
      });
    } else {
      $.ajax({
        url: "/feed",
        dataType: 'json',
        data: {'max_created_at': this.maxCreatedAt},
        success: this.insertTweets.bind(this)
      });
    }
  },

  insertTweets: function (tweets) {
    var $feed = this.$feed;
    $(tweets).each(function () {
      $feed.append("<li>" + JSON.stringify(this) + "</li>");
    });
    if(tweets.length > 0) {
      this.maxCreatedAt = tweets[tweets.length - 1].created_at;
    }
    if(tweets.length < 20) {
      this.$moreLink.remove();
      this.$el.append("<p>No more tweets!</p>");
    }
  }
};

$.fn.infiniteTweets = function () {
  return this.each(function (){
    new $.InfiniteTweets(this);
  });
};

$(function () {
  $("div.infinite-tweets").infiniteTweets();
});
