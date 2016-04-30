angular.module('calendarDemoApp')
  .controller('randomMonth', [
    '$scope',
    function ($scope) {
      $scope.spin = function () {
        return Math.floor(Math.random() * 12);
      };
    }
  ]);
