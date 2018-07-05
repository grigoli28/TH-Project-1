'use strict';

/* setGradeBoxColor function sets background color for a grade box according to student's grade */
function setGradeAndColor(number) {
    this.textContent = number;
    let backgrColors = ["back-dark-red", "back-orange", "back-yellow", "back-limegreen", "back-light-green", "back-dark-green"];
    for (let color of backgrColors) {
        // if user edited student's grade, remove old color to replace it with new color according to new grade
        if (this.classList.contains(color)) this.classList.remove(color);
    }
    if (number == 0) this.classList.add('back-dark-red');
    else if (number < 2) this.classList.add('back-orange');
    else if (number < 3) this.classList.add('back-yellow');
    else if (number < 4) this.classList.add('back-limegreen');
    else if (number < 5) this.classList.add('back-light-green');
    else this.classList.add('back-dark-green');
}