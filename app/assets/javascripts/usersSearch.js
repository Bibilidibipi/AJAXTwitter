$.UsersSearch = function(el) {
  this.$el = $(el);
  this.$ul = this.$el.find("ul.users");
  this.$input = this.$el.find("input");
  this.$input.on("input", this.handleInput.bind(this));
};

$.UsersSearch.prototype = {
  handleInput: function (event) {
    $.ajax({
      url: "/users/search",
      data: { 'query' : event.currentTarget.value },
      dataType: "json",
      success: this.renderResults.bind(this)
    });
  },

  renderResults: function (users) {
    var that = this;
    this.$ul.empty();
    users.forEach(function (user) {
      var state = (user.followed ? "followed" : "unfollowed");
      var child = "<li>" +
        "<a href='/users/" + user.id + "'>" + user.username + "</a>" +
        "<button " +
          "type='button' data-initial-follow-state='" + state + "' data-user-id='" + user.id + "' class='follow-toggle'>" +
        "</button>" +
      "</li>";
      that.$ul.append(child);
    });
    $("button.follow-toggle").followToggle();
  }
};

$.fn.usersSearch = function () {
  return this.each(function () {
    new $.UsersSearch(this);
  });
};

$(function () {
  $("div.users-search").usersSearch();
});
