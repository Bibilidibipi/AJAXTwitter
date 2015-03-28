$.TweetCompose = function (el) {
  this.$el = $(el);
  this.$el.on("submit", this.submit.bind(this));
  this.$feed = $(this.$el.data("tweets-ul"));
  this.$el.find("textarea").on("input", this.updateCharsLeft.bind(this));
  this.$el.find("a.add-mentioned-user").on("click", this.addMentionedUser.bind(this));
  this.$el.on("click", "a.remove-mentioned-user", this.removeMentionedUser.bind(this));
};

$.TweetCompose.prototype = {
  submit: function (event){
    event.preventDefault();
    var contents = $(event.currentTarget).serializeJSON();
    $(event.currentTarget).children().filter(":input").prop("disabled", true);
    $.ajax({
      url: "/tweets",
      method: "post",
      data: contents,
      dataType: "json",
      success: this.handleSuccess.bind(this)
    });
  },

  handleSuccess: function (tweet) {
    this.clearInput();
    this.$el.children().filter(":input").prop("disabled", false);

    var content = tweet.content;
    var username = tweet.user.username;
    var url = "/users/" + tweet.user.id;
    var date = tweet.created_at;
    var link = "<a href='" + url + "'>" + username + "</a>";
    var htmlContent = content + " -- " + link + " -- " + date;
    var newTweet = $("<li>").html(htmlContent);

    this.$feed.append(newTweet);
  },

  clearInput: function () {
    this.$el.children().filter(":input").val("");
    this.$el.find("div.mentioned-users").empty();
  },

  updateCharsLeft: function (event) {
    var currentChars = event.currentTarget.value;
    this.$el.find("strong").html("Characters Left: " + (140 - currentChars.length));
  },

  addMentionedUser: function () {
    var script = $(this.$el.find("script")).html();
    this.$el.find("div.mentioned-users").append(script);
  },

  removeMentionedUser: function (event) {
    event.currentTarget.parentElement.remove();
  }
};

$.fn.tweetCompose = function () {
  return this.each(function () {
    new $.TweetCompose(this);
  });
};

$(function () {
  $("form.tweet-compose").tweetCompose();
});
