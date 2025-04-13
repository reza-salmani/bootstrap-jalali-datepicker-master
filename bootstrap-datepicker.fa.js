/**
 * Persian translation & Convert to Jalali Calendar for bootstrap-datepicker
 * Rahman Mousavian	<mousavian.rahman@gmail.com>
 *  Using jQuery Datepicker (Jalali Calendar) By:
 * 	Mahdi Hasheminezhad. email: hasheminezhad at gmail dot com (http://hasheminezhad.com)
 */
function mod(a, b) {
  return a - b * Math.floor(a / b);
}
/*
       JavaScript functions for the Fourmilab Calendar Converter

                  by John Walker  --  September, MIM
              http://www.fourmilab.ch/documents/calendar/

                This program is in the public domain.
*/

//#region islamic convertor
function leap_islamic(year) {
  return (year * 11 + 14) % 30 < 11;
}
var ISLAMIC_EPOCH = 1948439.5;
function islamic_to_jd(year, month, day) {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    ISLAMIC_EPOCH -
    1
  );
}
function jd_to_islamic(jd) {
  var year, month, day;

  jd = Math.floor(jd) + 0.5;
  year = Math.floor((30 * (jd - ISLAMIC_EPOCH) + 10646) / 10631);
  month = Math.min(
    12,
    Math.ceil((jd - (29 + islamic_to_jd(year, 1, 1))) / 29.5) + 1
  );
  day = jd - islamic_to_jd(year, month, 1) + 1;
  return new Array(year, month, day);
}
//#endregion

//#region gregorian convertor
function leap_gregorian(year) {
  return year % 4 == 0 && !(year % 100 == 0 && year % 400 != 0);
}
var GREGORIAN_EPOCH = 1721425.5;
function gregorian_to_jd(year, month, day) {
  return (
    GREGORIAN_EPOCH -
    1 +
    365 * (year - 1) +
    Math.floor((year - 1) / 4) +
    -Math.floor((year - 1) / 100) +
    Math.floor((year - 1) / 400) +
    Math.floor(
      (367 * month - 362) / 12 +
        (month <= 2 ? 0 : leap_gregorian(year) ? -1 : -2) +
        day
    )
  );
}
function jd_to_gregorian(jd) {
  var wjd,
    depoch,
    quadricent,
    dqc,
    cent,
    dcent,
    quad,
    dquad,
    yindex,
    dyindex,
    year,
    yearday,
    leapadj;

  wjd = Math.floor(jd - 0.5) + 0.5;
  depoch = wjd - GREGORIAN_EPOCH;
  quadricent = Math.floor(depoch / 146097);
  dqc = mod(depoch, 146097);
  cent = Math.floor(dqc / 36524);
  dcent = mod(dqc, 36524);
  quad = Math.floor(dcent / 1461);
  dquad = mod(dcent, 1461);
  yindex = Math.floor(dquad / 365);
  year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
  if (!(cent == 4 || yindex == 4)) {
    year++;
  }
  yearday = wjd - gregorian_to_jd(year, 1, 1);
  leapadj =
    wjd < gregorian_to_jd(year, 3, 1) ? 0 : leap_gregorian(year) ? 1 : 2;
  month = Math.floor(((yearday + leapadj) * 12 + 373) / 367);
  day = wjd - gregorian_to_jd(year, month, 1) + 1;

  return new Array(year, month, day);
}
//#endregion

//#region persian convertor
/**
 * this function calculate leap_years for persian calendar.
 *
 * @description it's changed by Reza.Salmani to manage special leap_year like 1403
 */
function leap_persian(year) {
  const leapYears = [1, 5, 9, 13, 17, 22, 26, 30];
  return leapYears.includes(year % 33);
}
function daysInMonth(year, month) {
  if (month <= 6) {
    return 31;
  } else if (month <= 11) {
    return 30;
  } else {
    // ماه ۱۲ (اسفند) - بررسی کبیسه بودن سال
    return leap_persian(year) ? 30 : 29;
  }
}
var PERSIAN_EPOCH = 1948320.5;

function persian_to_jd(year, month, day) {
  var base = year - (year >= 0 ? 474 : 473);
  var cycle = Math.floor(base / 2820);
  var v = 474 + (base % 2820);

  var leap_years = Math.floor((v * 683) / 2820);

  var days = day;
  if (month <= 7) {
    days += (month - 1) * 31;
  } else {
    days += 6 * 31 + (month - 7) * 30;
  }
  days += leap_years + (v - 1) * 365 + cycle * 1029983 + (1948320.5 - 1);
  return days;
}
function jd_to_persian(jd) {
  jd = Math.floor(jd) + 0.5;

  // تصحیح برای مبدأ تقویم شمسی
  var base = jd - persian_to_jd(475, 1, 1);
  var cycle = Math.floor(base / 1029983);
  var rem = base % 1029983;

  // محاسبه سال در چرخه جاری با روش دقیق‌تر
  var ycycle;
  if (rem == 1029982) {
    ycycle = 2820;
  } else {
    var years = Math.floor((2816 * rem + 1031337) / 1028522);
    ycycle = years;
  }

  var year = ycycle + 2820 * cycle + 474;
  if (year <= 0) year--;

  // محاسبه ماه و روز
  var days = jd - persian_to_jd(year, 1, 1) + 1;
  var month, day;

  if (days <= 186) {
    month = Math.ceil(days / 31);
    day = days % 31 || 31;
  } else {
    month = Math.ceil((days - 6) / 30);
    day = (days - 6) % 30 || 30;
  }

  return [year, month, day];
}

//#endregion

function JalaliDate(p0, p1, p2) {
  var gregorianDate;
  var jalaliDate;

  if (!isNaN(parseInt(p0)) && !isNaN(parseInt(p1)) && !isNaN(parseInt(p2))) {
    var g = jalali_to_gregorian([
      parseInt(p0, 10),
      parseInt(p1, 10),
      parseInt(p2, 10),
    ]);
    setFullDate(new Date(g[0], g[1], g[2]));
  } else {
    setFullDate(p0);
  }

  function jalali_to_gregorian(d) {
    var adjustDay = 0;
    if (d[1] < 0) {
      adjustDay = leap_persian(d[0] - 1) ? 30 : 29;
      d[1]++;
    }
    var gregorian = jd_to_gregorian(
      persian_to_jd(d[0], d[1] + 1, d[2]) - adjustDay
    );
    gregorian[1]--;

    return gregorian;
  }

  function gregorian_to_jalali(d) {
    var jalali = jd_to_persian(gregorian_to_jd(d[0], d[1] + 1, d[2]));
    jalali[1]--;
    return jalali;
  }

  function setFullDate(date) {
    if (date && date.getGregorianDate) date = date.getGregorianDate();
    gregorianDate = new Date(date);
    gregorianDate.setHours(
      gregorianDate.getHours() > 12 ? gregorianDate.getHours() + 2 : 0
    );
    if (
      !gregorianDate ||
      gregorianDate == "Invalid Date" ||
      isNaN(gregorianDate || !gregorianDate.getDate())
    ) {
      gregorianDate = new Date();
    }
    jalaliDate = gregorian_to_jalali([
      gregorianDate.getFullYear(),
      gregorianDate.getMonth(),
      gregorianDate.getDate(),
    ]);
    return this;
  }

  this.getGregorianDate = function () {
    return gregorianDate;
  };

  this.setFullDate = setFullDate;

  this.setMonth = function (e) {
    jalaliDate[1] = e;
    var g = jalali_to_gregorian(jalaliDate);
    gregorianDate = new Date(g[0], g[1], g[2]);
    jalaliDate = gregorian_to_jalali([g[0], g[1], g[2]]);
  };

  this.setDate = function (e) {
    jalaliDate[2] = e;
    var g = jalali_to_gregorian(jalaliDate);
    gregorianDate = new Date(g[0], g[1], g[2]);
    jalaliDate = gregorian_to_jalali([g[0], g[1], g[2]]);
  };

  this.getFullYear = function () {
    return jalaliDate[0];
  };
  this.getMonth = function () {
    return jalaliDate[1];
  };
  this.getDate = function () {
    return jalaliDate[2];
  };
  this.toString = function () {
    return jalaliDate.join(",").toString();
  };
  this.getDay = function () {
    return gregorianDate.getDay();
  };
  this.getHours = function () {
    return gregorianDate.getHours();
  };
  this.getMinutes = function () {
    return gregorianDate.getMinutes();
  };
  this.getSeconds = function () {
    return gregorianDate.getSeconds();
  };
  this.getTime = function () {
    return gregorianDate.getTime();
  };
  this.getTimeZoneOffset = function () {
    return gregorianDate.getTimeZoneOffset();
  };
  this.getYear = function () {
    return jalaliDate[0] % 100;
  };
  this.setHours = function (e) {
    gregorianDate.setHours(e);
  };
  this.setMinutes = function (e) {
    gregorianDate.setMinutes(e);
  };
  this.setSeconds = function (e) {
    gregorianDate.setSeconds(e);
  };
  this.setMilliseconds = function (e) {
    gregorianDate.setMilliseconds(e);
  };
}

jQuery(function ($) {
  $.datepicker.regional["fa"] = {
    calendar: JalaliDate,
    closeText: "بستن",
    prevText: "قبل",
    nextText: "بعد",
    currentText: "امروز",
    monthNames: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
    monthNamesShort: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
    dayNames: [
      "یکشنبه",
      "دوشنبه",
      "سه شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه",
      "شنبه",
    ],
    dayNamesShort: ["یک", "دو", "سه", "چهار", "پنج", "جمعه", "شنبه"],
    dayNamesMin: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
    weekHeader: "ه",
    dateFormat: "dd/mm/yy",
    firstDay: 6,
    isRTL: true,
    showMonthAfterYear: false,
    yearSuffix: "",
    calculateWeek: function (date) {
      var checkDate = new JalaliDate(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + (date.getDay() || 7) - 3
      );
      return (
        Math.floor(
          Math.round(
            (checkDate.getTime() -
              new JalaliDate(checkDate.getFullYear(), 0, 1).getTime()) /
              86400000
          ) / 7
        ) + 1
      );
    },
  };
  $.datepicker.setDefaults($.datepicker.regional["fa"]);
});
