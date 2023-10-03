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

  getReadableDate(date) {
    return this.getTimeOnly(date) + ' ' + moment(date).startOf('day').format('DD/MM/YYYY');
  }

  formatDateToISOString(date) {
    return moment(date).toISOString(true);
  }
  
}

export default new DateService();
