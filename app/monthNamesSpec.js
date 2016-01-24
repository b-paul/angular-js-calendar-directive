describe('monthNames service', function () {
  beforeEach(module('calendarDemoApp'));

  beforeEach(module(function ($provide) {
    $provide.value('$locale', { id: 'en-US' });
  }));

  it('Has a monthNames object', inject(function (monthNames) {
    expect(monthNames).toEqual({
      long: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      short: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    });
  }));
});
