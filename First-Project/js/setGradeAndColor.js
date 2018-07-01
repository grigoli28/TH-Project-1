'use strict';

/* setGradeBoxColor function sets background color for a grade box according to student's grade */
function setGradeAndColor(number) {
    this.textContent = number;
    let backgrColors = ['backgr-darker-red', 'backgr-orange', 'backgr-green', 'backgr-darker-green'];
    for (let color of backgrColors) {
        // if user edited student's grade, remove old color to replace it with new color according to new grade
        if (this.classList.contains(color)) this.classList.remove(color);
    }
    if (number == 0) this.classList.add('backgr-darker-red');
    else if (number < 3) this.classList.add('backgr-orange');
    else if (number < 4) this.classList.add('backgr-green');
    else this.classList.add('backgr-darker-green');
}