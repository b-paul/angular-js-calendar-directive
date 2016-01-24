describe('weekdayNames service', function () {
  beforeEach(module('calendarDemoApp'));

  beforeEach(module(function ($provide) {
    $provide.value('$locale', { id: 'en-US' });
  }));

  it('Has a weekdayNames object', inject(function (weekdayNames) {
    expect(weekdayNames).toEqual({
      long: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      short: [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
      ],
      narrow: [
        'S', 'M', 'T', 'W', 'T', 'F', 'S'
      ]
    });
  }));
});
