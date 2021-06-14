export function getTimeDifference(when){
    const dateTime = String(when);

    let dateTimeParts= dateTime.split(/[- T]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
    const time=dateTimeParts[dateTimeParts.length-1].split(/[.]/)[0]
    const date=`${dateTimeParts[0]}/${dateTimeParts[1]}/${dateTimeParts[2]}`
    const dateObject = new Date(`${date} ${time}`); // our Date object
    const TimeNow=new Date() 
    const DateNow=`${TimeNow.getFullYear()}/${TimeNow.getMonth()+1}/${TimeNow.getDate()} ${TimeNow.getHours()}:${TimeNow.getMinutes()}:${TimeNow.getSeconds()}`
    const difference=timeDiffCalc(dateObject,new Date(DateNow))
    return difference
}

// src : https://bearnithi.com/2019/11/10/how-to-calculate-the-time-difference-days-hours-minutes-between-two-dates-in-javascript/
function timeDiffCalc(dateFuture, dateNow) {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    let difference = '';
    if (days > 0) {
      difference += (days === 1) ? `${days} day, ` : `${days} days, `;
    }

    difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours-5} hours, `;

    difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes-30} minutes`; 

    return difference;
  }
