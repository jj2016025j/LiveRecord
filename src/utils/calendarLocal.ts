import { PickerLocale } from "antd/es/date-picker/generatePicker";

const en = {
  lang: {
    locale: "en_US",
    placeholder: "Select date",
    rangePlaceholder: ["Start date", "End date"],
    today: "Today",
    now: "Now",
    backToToday: "Back to today",
    ok: "OK",
    clear: "Clear",
    month: "Month",
    year: "Year",
    timeSelect: "Select time",
    dateSelect: "Select date",
    monthSelect: "Choose a month",
    yearSelect: "Choose a year",
    decadeSelect: "Choose a decade",
    yearFormat: "YYYY",
    dateFormat: "M/D/YYYY",
    dayFormat: "D",
    dateTimeFormat: "M/D/YYYY HH:mm:ss",
    monthFormat: "MMMM",
    monthBeforeYear: true,
    previousMonth: "Previous month (PageUp)",
    nextMonth: "Next month (PageDown)",
    previousYear: "Last year (Control + left)",
    nextYear: "Next year (Control + right)",
    previousDecade: "Last decade",
    nextDecade: "Next decade",
    previousCentury: "Last century",
    nextCentury: "Next century",
    shortWeekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    shortMonths: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  timePickerLocale: {
    placeholder: "Select time",
  },
  dateFormat: "YYYY-MM-DD",
  dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
  weekFormat: "YYYY-wo",
  monthFormat: "YYYY-MM",
};

const tw = {
  lang: {
    locale: "ch_tw",
    placeholder: "選擇日期",
    rangePlaceholder: ["起始日期", "結束日期"],
    today: "今天",
    now: "現在",
    backToToday: "返回今天",
    ok: "確定",
    clear: "清除",
    month: "月",
    year: "年",
    timeSelect: "選擇時間",
    dateSelect: "選擇日期",
    monthSelect: "選擇月份",
    yearSelect: "選擇年份",
    decadeSelect: "選擇年代",
    yearFormat: "YYYY",
    dateFormat: "M/D/YYYY",
    dayFormat: "D",
    dateTimeFormat: "M/D/YYYY HH:mm:ss",
    monthFormat: "MMMM",
    monthBeforeYear: true,
    previousMonth: "上個月 (PageUp)",
    nextMonth: "下個月 (PageDown)",
    previousYear: "上一年 (Ctrl + ←)",
    nextYear: "下一年 (Ctrl + →)",
    previousDecade: "上個年代",
    nextDecade: "下個年代",
    previousCentury: "上個世紀",
    nextCentury: "下個世紀",
    shortWeekDays: ["日", "一", "二", "三", "四", "五", "六"],
    shortMonths: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
  },
  timePickerLocale: {
    placeholder: "選擇時間",
  },
  dateFormat: "YYYY-MM-DD",
  dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
  weekFormat: "YYYY-wo",
  monthFormat: "YYYY-MM",
} as PickerLocale;

export { en, tw };
