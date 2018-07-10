/* Techubdate() is a date constructor according to TechHub's curriculum */

function Techubdate() {
    let startDate = new Date(2018, 3, 28); // we set start from 28 April so that first created date will be 30 April

    if (Techubdate.counter == undefined) { // Enable counter for every new date object created
        Techubdate.counter = 1;
        Techubdate.prevDate = startDate; // for the very first object, set its previous date to startDate
    } else Techubdate.counter += 1;

    let newDate;

    if (Techubdate.counter % 4 == 0)
    // for every new 4th object created, increase date by one, otherwise increase date by two
        newDate = new Date(Techubdate.prevDate.getFullYear(),
        Techubdate.prevDate.getMonth(),
        Techubdate.prevDate.getDate() + 1);
    else
        newDate = new Date(Techubdate.prevDate.getFullYear(),
            Techubdate.prevDate.getMonth(),
            Techubdate.prevDate.getDate() + 2);

    // remember new date as previous for a next new object that will be created
    Techubdate.prevDate = newDate;

    // reset date to a previous one
    Techubdate.resetToPrevDate = function() {
        // if this date was 4th one, reset it by one, otherwise reset it by two
        if (Techubdate.prevDate - startDate != 0) {
            if (Techubdate.counter % 4 == 0)
                Techubdate.prevDate = new Date(Techubdate.prevDate.getFullYear(),
                    Techubdate.prevDate.getMonth(),
                    Techubdate.prevDate.getDate() - 1);
            else
                Techubdate.prevDate = new Date(Techubdate.prevDate.getFullYear(),
                    Techubdate.prevDate.getMonth(),
                    Techubdate.prevDate.getDate() - 2);

            Techubdate.counter -= 1;
        }
    }

    // get full date as a string
    this.getFullDate = function() {
        let day, month;
        switch (newDate.getDay()) {
            default: alert(`This day doesn't exist!`); break;
            case 1: day = 'Mon'; break;
            case 2: day = 'Thu'; break;
            case 3: day = 'Wed'; break;
            case 4: day = 'Thur'; break;
            case 5: day = 'Fri'; break;
            case 6: day = 'Sat'; break;
            case 7: day = 'Sun'; break;
        }
        switch (newDate.getMonth()) {
            default: alert(`This month doesn't exist!`); break;
            case 0: month = 'Jan'; break;
            case 1: month = 'Feb'; break;
            case 2: month = 'Mar'; break;
            case 3: month = 'Apr'; break;
            case 4: month = 'May'; break;
            case 5: month = 'Jun'; break;
            case 6: month = 'Jul'; break;
            case 7: month = 'Aug'; break;
            case 8: month = 'Sep'; break;
            case 9: month = 'Oct'; break;
            case 10: month = 'Nov'; break;
            case 11: month = 'Dec'; break;
        }
        return `${day} ${newDate.getDate()} ${month}`;
    }
}