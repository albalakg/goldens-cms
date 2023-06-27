import moment from "moment";

class DateService {
  getMonths() {
    return moment.months();
  }

  getLastMonth() {
    return moment().subtract(1, "month").startOf("month").format('MMMM');
  }

  getMonthByDate(date) {
    return moment(date).month();
  }
}

export default new DateService();
