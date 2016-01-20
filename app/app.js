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
    'monthNames', 'weekdayNames',
    function (monthNames, weekdayNames) {
      return {
        restrict: 'E',
        scope: {},
        replace: true,
        transclude: true,
        templateUrl: 'templates/calendar-grid.html',
        link: function (scope, element, attrs, _noController_, transclude) {
          scope.monthNames = monthNames[attrs.monthNames || 'long'];
          scope.weekdayNames = weekdayNames[attrs.weekdayNames || 'narrow'];

          // if 'arrows' attribute is specified on the element
          scope.arrows = 'arrows' in attrs;

          var initialDate = new Date(attrs.date)
          if (!isNaN(initialDate)) {
            scope.calendar.month = initialDate.getMonth();
            scope.calendar.year = initialDate.getFullYear();
          } else {
            // if no date attr. or date is invalid, use month and year attrs
            // with fallback to current date.
            initialDate = new Date();
            // Directive user sets the month according to traditional/ISO-8601
            // sequence (i.e., starting at 1)
            scope.calendar.month = +attrs.month - 1 || initialDate.getMonth();
            scope.calendar.year = +attrs.year || initialDate.getFullYear();
          }

          // add calendar into transcluded scope
          transclude(function (clonedHtml, transcludedScope) {
            transcludedScope.calendar
              || (transcludedScope.calendar = scope.calendar);
            element.find('ng-transclude').replaceWith(clonedHtml);
          });
        },
        controller: [
          '$scope',
          function ($scope) {
            var date = new Date();

            $scope.currentYear = date.getFullYear();
            $scope.currentMonth = date.getMonth();
            $scope.currentDate = date.getDate();
            $scope.calendar = {};

            $scope.incMonth = function (amt) {
              if (!arguments.length) { amt = 1; }
              if (isNaN(amt)) { return; }
              // current calendar.month may be set to a string
              var month = +this.calendar.month + amt;
              this.incYear(Math.floor(month / 12));
              this.calendar.month = (month % 12 + 12) % 12;
            };

            $scope.decMonth = function () {
              return this.incMonth(-1);
            };

            $scope.incYear = function (amt) {
              if (!arguments.length) { amt = 1; }
              if (isNaN(amt)) { return; }
              // current calendar.year may be set to a string
              this.calendar.year = +this.calendar.year + amt;
            }

            $scope.decYear = function () {
              return this.incYear(-1);
            };

            $scope.setWeeks = function () {
              var weeks = [];
              var cal = $scope.calendar;
              var date = new Date(cal.year, cal.month);
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
    'monthNames',
    function (monthNames) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/calendar-chooser.html',
        link: function (scope, element, attrs) {
          scope.monthNames = monthNames[attrs.monthNames || 'long'];
        }
      };
    }
  ]);
