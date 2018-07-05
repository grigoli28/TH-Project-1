function Techubdate() {
    let startDate = new Date(2018, 3, 28);
    if (Techubdate.counter == undefined) {
        Techubdate.counter = 1;
        Techubdate.prevDate = startDate;
    } else {
        Techubdate.counter += 1;
    }
    let newDate;

    if (Techubdate.counter % 4 == 0) {
        newDate = new Date(Techubdate.prevDate.getFullYear(), Techubdate.prevDate.getMonth(), Techubdate.prevDate.getDate() + 1);
    } else {
        newDate = new Date(Techubdate.prevDate.getFullYear(), Techubdate.prevDate.getMonth(), Techubdate.prevDate.getDate() + 2);
    }
    Techubdate.prevDate = newDate;

    Techubdate.resetToPrevDate = function() {
        if (Techubdate.prevDate - startDate != 0) {
            if (Techubdate.counter % 4 == 0) {
                Techubdate.prevDate = new Date(Techubdate.prevDate.getFullYear(), Techubdate.prevDate.getMonth(), Techubdate.prevDate.getDate() - 1);
            } else {
                Techubdate.prevDate = new Date(Techubdate.prevDate.getFullYear(), Techubdate.prevDate.getMonth(), Techubdate.prevDate.getDate() - 2);
            }
            Techubdate.counter -= 1;
        }
    }
    this.getFullDate = function() {
        let day, month;
        switch (newDate.getDay()) {
            case 1:
                day = 'Mon';
                break;
            case 2:
                day = 'Thu';
                break;
            case 3:
                day = 'Wed';
                break;
            case 4:
                day = 'Thur';
                break;
            case 5:
                day = 'Fri';
                break;
            case 6:
                day = 'Sat';
                break;
            case 7:
                day = 'Sun';
                break;
            default:
                alert(`This day doesn't exist!`);
                break;
        }
        switch (newDate.getMonth()) {
            case 0:
                month = 'Jan';
                break;
            case 1:
                month = 'Feb';
                break;
            case 2:
                month = 'Mar';
                break;
            case 3:
                month = 'Apr';
                break;
            case 4:
                month = 'May';
                break;
            case 5:
                month = 'Jun';
                break;
            case 6:
                month = 'Jul';
                break;
            case 7:
                month = 'Aug';
                break;
            case 8:
                month = 'Sep';
                break;
            case 9:
                month = 'Oct';
                break;
            case 10:
                month = 'Nov';
                break;
            case 11:
                month = 'Dec';
                break;
            default:
                alert(`This month doesn't exist!`);
                break;
        }
        return `${day} ${month} ${newDate.getDate()}`;
    }
}