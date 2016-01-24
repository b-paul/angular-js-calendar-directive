describe('calendarDemoApp directives', function () {
  var $compile;
  var $rootScope;
  var $httpBackend;
  var element;
  var scope;

  beforeEach(module('calendarDemoApp'));

  beforeEach(inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
  }));

  function compile(snippet, routes) {
    // Mock date for all directives compiled by this function. Should be safe to
    // use normal dates otherwise.
    var NativeDate = window.Date;

    window.Date = function MyDate(a, b, c, d, e, f, g) {
      if (this instanceof MyDate) {
        switch (arguments.length) {
          case 0: return new NativeDate(1993, 8, 1);
          case 1: return new NativeDate(a);
          case 2: return new NativeDate(a, b);
          case 3: return new NativeDate(a, b, c);
          case 4: return new NativeDate(a, b, c, d);
          case 5: return new NativeDate(a, b, c, d, e);
          case 6: return new NativeDate(a, b, c, d, e, f);
          case 7: return new NativeDate(a, b, c, d, e, f, g);
        }
      } else if (!arguments.length) {
        return new NativeDate(1993, 8, 1);
      } else {
        return NativeDate.apply(this, arguments);
      }
    };

    routes.forEach(function (route) {
      $httpBackend.whenGET(route[0]).respond(route[1]);
    });

    element = $compile(snippet)($rootScope);
    $httpBackend.flush();
    $rootScope.$digest();
    scope = element.scope();

    window.Date = NativeDate;
  };

  describe('calendarChooser directive', function () {
    beforeEach(function () {
      compile('<calendar-chooser></calendar-chooser>', [
        ['templates/calendar-chooser.html', '<div>Something Something</div>']
      ]);
    });

    it('should replace the element with the returned template', function () {
      expect(element[0].tagName).toBe('DIV');
      expect(element.html()).toContain('Something Something');
    });

    it('should have a monthNames scope property', function () {
      expect(scope.monthNames.length).toBe(12);
    });
  });

  describe('calendarGrid directive', function () {
    beforeEach(function () {
      compile('<calendar-grid></calendar-grid>', [
        ['templates/calendar-grid.html', '<div>Something Something</div>']
      ]);
    });

    it('should replace the element with the returned template', function () {
      expect(element[0].tagName).toBe('DIV');
      expect(element.html()).toContain('Something Something');
    });

    it('should have a monthNames scope property', function () {
      expect(scope.monthNames.length).toBe(12);
    });

    it('should have a weekdayNames scope property', function () {
      expect(scope.weekdayNames.length).toBe(7);
    });

    it('should have a weekdayNames scope property', function () {
      expect(scope.weekdayNames.length).toBe(7);
    });

    it('should have a boolean property: arrows', function () {
      expect(scope.arrows).toBe(false);
    });

    it('should have a calendar property', function () {
      expect(scope.calendar.month).toBeDefined();
      expect(scope.calendar.year).toBeDefined();
    });

    describe('date math', function () {
      it('should have incYear', function () {
        scope.incYear();
        expect(scope.calendar.year).toBe(1994);
      });

      it('should allow incYear argument', function () {
        scope.incYear(5);
        expect(scope.calendar.year).toBe(1998);
      });

      it('should have incMonth', function () {
        scope.incMonth();
        expect(scope.calendar.month).toBe(9);
      });

      it('should allow incMonth argument', function () {
        scope.incMonth(5);
        expect(scope.calendar.month).toBe(1);
        expect(scope.calendar.year).toBe(1994);
      });

      it('should have decYear', function () {
        scope.decYear();
        expect(scope.calendar.year).toBe(1992);
      });

      it('should have decMonth', function () {
        scope.decMonth();
        expect(scope.calendar.month).toBe(7);
      });
    });

    it('should have a weeks scope property', function () {
      expect(scope.weeks[0].length).toBe(7);
    });
  });
});
