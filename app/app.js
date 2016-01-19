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
  .directive('directUpdate', [
    // This directive is an experiment to see if one controller could avoid
    // adding a watcher to recalculate the values changed by another controller.
    // Guessing it might be worth a performance gain if there's a lot of digest
    // activity, but it adds to the complexity because both the update receiver
    // and the update creator have to explicitly choose to cooperate through
    // this.
    function () {
      return {
        restrict: 'A',
        scope: false,
        controller: [
          '$scope', '$timeout',
          function ($scope, $timeout) {
            this.update = function (name) {
              // $timeout gets us to the end of the current $digest, which
              // allows the changes made by the updating controller to be
              // propogated, if they are on an isolate scope.
              $timeout(function () {
                $scope.$broadcast('direct-update:' + name);
              }, 0);
            }
          }
        ]
      }
    }
  ])
  .directive('calendarGrid', [
    function () {
      return {
        restrict: 'E',
        scope: true,
        replace: true,
        require: '?directUpdate',
        templateUrl: 'templates/calendar-grid.html',
        link: function (scope, element, attrs, directUpdateController) {
          if (directUpdateController) {
            // Uses a (probably) more performant change notification;
            scope.$on('direct-update:calendar', function () {
              scope.setWeeks();
            });
          } else {
            // Fallback if we didn't add the direct-update attribute
            scope.$watchCollection('calendar', function () {
              scope.setWeeks();
            });
          }
        },
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
        require: '^?directUpdate',
        templateUrl: 'templates/calendar-chooser.html',
        link: function (scope, element, attrs, directUpdateController) {
          scope.parentControl = directUpdateController;
        },
        controller: [
          '$scope', 'monthNames',
          function ($scope, monthNames) {
            $scope.monthNames = monthNames.short;
            $scope.month = function (value) {
              if (!arguments.length) { return $scope.monthValue; }
              $scope.monthValue = +value;
              $scope.parentControl && $scope.parentControl.update('calendar');
            };

            $scope.year = function (value) {
              if (!arguments.length) { return $scope.yearValue; }
              $scope.yearValue = +value;
              $scope.parentControl && $scope.parentControl.update('calendar');
            };
          }
        ]
      };
    }
  ]);
