angular.module('calendarDemoApp', [])
  .factory('monthNames', [
    '$locale',
    function ($locale) {
      var date = new Date();
      var names = {
        long: [],
        short: []
      };
      for (var i = 0; i < 12; i++) {
        date.setMonth(i);
        names.long.push(date.toLocaleString($locale.id, { month: 'long' }));
        names.short.push(date.toLocaleString($locale.id, { month: 'short' }));
      }
      return names;
    }
  ])
  .factory('weekdayNames', [
    '$locale',
    function ($locale) {
      var date = new Date();
      var dateNumber = date.getDate();
      var names = {
        long: [],
        short: [],
        narrow: []
      };
      var weekday;
      for (var i = 0; i < 7; i++) {
        date.setDate(dateNumber++);
        weekday = date.getDay();
        names.long[weekday]
          = date.toLocaleString($locale.id, {weekday: 'long'});
        names.short[weekday]
          = date.toLocaleString($locale.id, {weekday: 'short'});
        names.narrow[weekday]
          = date.toLocaleString($locale.id, {weekday: 'narrow'});
      }
      return names;
    }
  ])
  .directive('calendarGrid', [
    function () {
      return {
        restrict: 'E',
        scope: true,
        replace: true,
        templateUrl: 'templates/calendar-grid.html',
        controller: [
          '$scope', 'monthNames', 'weekdayNames',
          function ($scope, monthNames, weekdayNames) {
            var date = new Date();

            $scope.monthNames = monthNames.long;
            $scope.weekdayAbbrvs = weekdayNames.narrow;
            $scope.currentYear = date.getFullYear();
            $scope.currentMonth = date.getMonth();
            $scope.currentDate = date.getDate();
            $scope.calendar = {
              month: $scope.currentMonth,
              year: $scope.currentYear
            };

            var dateFromCal = function (cal) {
              return new Date(cal.year, cal.month);
            };

            $scope.setWeeks = function () {
              var weeks = [];
              var date = dateFromCal($scope.calendar);
              var range = CalendarRange.getMonthlyRange(date);
              var days = range.days;
              var startOfNextWeek;
              for (var startOfWeek = 0;
                   startOfWeek < days.length;
                   startOfWeek += 7) {
                startOfNextWeek = startOfWeek + 7;
                weeks.push(days.slice(startOfWeek, startOfNextWeek));
              }

              this.weeks = weeks;
            };

            $scope.setWeeks();
            $scope.$watchCollection('calendar', function () {
              $scope.setWeeks();
            });
          }
        ]
      };
    }
  ])
  .directive('calendarChooser', [
    function () {
      return {
        restrict: 'E',
        scope: {
          monthValue: '=',
          yearValue: '='
        },
        replace: true,
        templateUrl: 'templates/calendar-chooser.html',
        controller: [
          '$scope', 'monthNames',
          function ($scope, monthNames) {
            $scope.monthNames = monthNames.short;
          }
        ]
      };
    }
  ]);
