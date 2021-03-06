// Generated by CoffeeScript 1.7.1
(function() {
  var displayRibbon, hideRibbon;

  window.ScamDatabase = angular.module("ScamDatabase", []);

  ScamDatabase.controller('ScammerController', function($scope, $http) {
    return $http.get("/scammers").success(function(data) {
      $scope.scammers = data;
      $scope.recordsPerPage = 10;
      $scope.curPage = 0;
      $scope.numPages = function() {
        return Math.ceil($scope.scammers / $scope.recordsPerPage);
      };
    }).error(function(err) {
      return $scope.scammers = -1;
    });
  });

  ScamDatabase.filter("capitalize", function() {
    return function(input) {
      var words;
      if (input && isNaN(input)) {
        words = input.split(" ");
        $.each(words, function(index, word) {
          return words[index] = word.charAt(0).toUpperCase() + word.slice(1);
        });
        return words.join();
      }
    };
  });

  ScamDatabase.filter("startAt", function() {
    return function(input, start) {
      if (input instanceof Object) {
        return input.slice(parseInt(start));
      }
    };
  });

  displayRibbon = function(rib) {
    $(rib).show();
    return setTimeout(hideRibbon, 2500);
  };

  hideRibbon = function() {
    return $('#sub-success, #sub-failure').fadeOut('slow');
  };

  $(document).ready(function() {
    if (document.cookie.match(/action-result=(\w+)/)) {
      switch (RegExp.$1) {
        case "success":
          displayRibbon("#sub-success");
          break;
        case "failure":
          displayRibbon("#sub-failure");
      }
      document.cookie = "action-result=null";
    }
  });

}).call(this);
