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

  getDateOnly(date) {
    return moment(date).startOf('day').format('YYYY-MM-DD');
  }

  getTimeOnly(date) {
    return moment(date).format('HH:mm');
  }

  formatDateToISOString(date) {
    return moment(date).toISOString(true);
  }
  
}

export default new DateService();
