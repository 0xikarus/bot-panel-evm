export default function formatDateTime(date) {
    if (typeof date != "object") {
        date = new Date(date);
    }
    const addLeadingZeros = (number) => (number < 10 ? `0${number}` : number);
  
    const day = addLeadingZeros(date.getDate());
    const month = addLeadingZeros(date.getMonth() + 1); // JavaScript months are 0-based.
    const year = date.getFullYear().toString().substr(-2); // Get last two digits of year.
    
    const hours = addLeadingZeros(date.getHours());
    const minutes = addLeadingZeros(date.getMinutes());
    const seconds = addLeadingZeros(date.getSeconds());
  
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
  