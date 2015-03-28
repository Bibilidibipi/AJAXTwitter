$.FollowToggle = function (el) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id");
  this.followState = this.$el.data("initial-follow-state");
  this.$el.on("click", this.handleClick.bind(this));
  this.render();
};

$.FollowToggle.prototype.render = function () {
  if(this.followState === 'following' || this.followState === 'unfollowing') {
    this.$el.prop('disabled', true);
  } else if(this.followState === "unfollowed") {
    this.$el.prop('disabled', false);
    this.$el.html("Follow!");
  } else if(this.followState === "followed") {
    this.$el.prop('disabled', false);
    this.$el.html("Unfollow!");
  }
};

$.FollowToggle.prototype.handleClick = function (event) {
  event.preventDefault();
  if (this.followState === "unfollowed") {
    this.followState = "following";
    $.ajax({
      url: "/users/" + this.userId + "/follow",
      method: "post",
      dataType: "json",
      success: function(){
        this.followState = "followed";
        this.render();
      }.bind(this)
    });
  } else {
    this.followState = "unfollowing";
    $.ajax({
      url: "/users/" + this.userId + "/follow",
      method: "delete",
      dataType: "json",
      success: function(){
        this.followState = "unfollowed";
        this.render();
      }.bind(this)
    });
  }
  this.render();
};

$.fn.followToggle = function () {
  return this.each(function () {
    new $.FollowToggle(this);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});
