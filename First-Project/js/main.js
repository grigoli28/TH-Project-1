'use strict';


let studentNames = [
    'Jano Bokuchava',
    'Grigol Tchkoidze',
    'Mamuka Anjaparidze',
    'Nino Matskepladze',
    'Otiko Pocxoraia',
    'Mari Jananashvili',
    'Temo Kiknadze',
    'Dea Samniashvili',
    'Nikoloz Asatiani',
    'Nino Grigalashvili'
];

let techubStudents = [];

// fill array with student objects and display students in HTML
/*
for (let i = 0; i < studentNames.length; i++) {
    techubStudents.push(new Student(studentNames[i], i));
    document.querySelector(`#student-${i}`).innerHTML = studentNames[i];
}*/

let totalDays = document.querySelector('#tot-days'),
    missedLessons = document.querySelector('#miss-less'),
    totalGrade = document.querySelector('#avg-grade'),
    totalTechubStudents = document.querySelector('#tot-stud');

// add number of students in statistics
totalTechubStudents.dataset.count = techubStudents.length;
totalTechubStudents.textContent = totalTechubStudents.dataset.count;


/* ==================== Student Statistics Section ==================== */


// options for mutation observers to observe
let options = { childList: true };

// create mutation observers to watch and animate elements on change
let daysObserver = new MutationObserver(mutationCB),
    lessonsObserver = new MutationObserver(mutationCB),
    gradesObserver = new MutationObserver(mutationCB);

daysObserver.observe(totalDays, options);
lessonsObserver.observe(missedLessons, options);
gradesObserver.observe(totalGrade, options);

function mutationCB([{ target }]) {
    target.classList.toggle('animator');
    // remove class after a while so that elements animate on every change when class is added again
    setTimeout(() => {
        target.classList.toggle('animator');
    }, 150);
}


/* ========================== Add New Student Section ============================= */

let newStudRow = {
    mainSelector: '.students',
    parent: {
        element: 'div',
        index: 0,
        attributes: {
            'class': 'student__item',
        }
    }
}

let newAvgGradeRow = {
    mainSelector: '.avg-grades',
    parent: {
        element: 'div',
        index: 0,
        content: '0',
        attributes: {
            'class': 'avg-grade__item',
        }
    }
}


let studentsColNode = document.querySelector('.students');
let avgGradeColNode = document.querySelector('.avg-grades');


let addStudBtn = document.querySelector('#add-stud');
addStudBtn.addEventListener('click', function addStudCB() {
    customPrompt(`Enter a Student's Name`, 'string');
});


function addNewStudent(name) {
    techubStudents.push(new Student(name));
    newStudRow.parent.attributes['id'] = `student-${Student.count}`;
    newAvgGradeRow.parent.attributes['id'] = `stud-${Student.count}`;
    generateHTML(newStudRow);
    generateHTML(newAvgGradeRow);
    newStudRow.parent.index += 1;
    newAvgGradeRow.parent.index += 1;

    studentsColNode.lastChild.innerHTML = name;

}













/* ==================== Prompt on mouse click section ==================== */

const enterKeyCode = 13;
const escKeyCode = 27;

let promptBackgr = document.querySelector('.prompt'),
    promptMessage = document.querySelector('.prompt__message'),
    promptInput = document.querySelector('.prompt__input'),
    promptOk = document.querySelector('#ok'),
    promptCancel = document.querySelector('#cancel');


function customPrompt(message, type = 'number') {
    promptInput.value = ''; // reset input value to an empty string
    promptBackgr.classList.add('show'); // display prompt window
    promptInput.focus(); // auto focus input when prompt is shown
    promptMessage.innerHTML = message; // insert given message
    promptInput.oninput = () => validate(promptInput.value, type); // show popup to users if they enter invalid number/string
    promptInput.onkeyup = inputCB; // allow user to use ESC and Enter on input
    promptOk.onclick = okCB; // continue when OK button is pressed
    promptCancel.onclick = cancelCB; // cancel when Cancel button is pressed
    let self = this;

    function okCB() {
        if (validate(promptInput.value, type) && type == 'number') { // continue ONLY if entered number is valid
            editGrade.call(self, promptInput.value); // insert given grade in grade table
            hidePrompt();
            return;
        }
        if (validate(promptInput.value, type) && type == 'string') {
            addNewStudent(promptInput.value);
            hidePrompt();
            return;
        }
    }

    function cancelCB() {
        // reset all popups
        invalidNumPopup.classList.remove('show');
        invalidNamePopup.classList.remove('show');
        emptyFieldPopup.classList.remove('show');
        hidePrompt();
    }

    function inputCB(event) {
        if (event.keyCode == enterKeyCode) // if Enter was pressed
            okCB();
        if (event.keyCode == escKeyCode) // if ESC was pressed
            hidePrompt();
    }
}











/* ========================= Popups ============================= */


let invalidNumPopup = document.querySelector('.prompt__popup--grade'), // popup when a number is invalid
    invalidNamePopup = document.querySelector('.prompt__popup--name'), // popup when string is invalid
    emptyFieldPopup = document.querySelector('.prompt__popup--empty'); // popup when input is empty


function validate(value, type) {
    if (type == 'number') { // if we want validation for a number
        if (value == '') { // if input is empty
            invalidNumPopup.classList.remove('show'); // remove invalid number popup and add empty field popup
            emptyFieldPopup.classList.add('show');
            return false;
        }
        emptyFieldPopup.classList.remove('show'); // remove popup if user entered a number

        if (isNaN(value)) { // if entered number is invalid
            invalidNumPopup.classList.add('show');
            return false;
        }
        invalidNumPopup.classList.remove('show'); // remove popup if a number is valid
        return true;
    }
    if (type == 'string') { // if we want validation for a string
        if (value == '') { // if input is empty
            // separateNamePopup.classList.remove('show');
            invalidNamePopup.classList.remove('show'); // remove invalid name popup and add empty field popup
            emptyFieldPopup.classList.add('show');
            return false;
        }
        emptyFieldPopup.classList.remove('show'); // remove popup if user entered a name

        if (!isNaN(value)) { // if user includes digits in name
            // separateNamePopup.classList.remove('show');
            invalidNamePopup.classList.add('show');
            return false;
        }
        invalidNamePopup.classList.remove('show'); // remove popup if a string is valid
        return true;
    }
}


function hidePrompt() {
    promptBackgr.classList.remove('show');
}


function editGrade(studentGrade) {
    studentGrade = Math.round(Number(studentGrade)); // round student's grade
    // make sure grade is between 0 and 5;
    studentGrade = (studentGrade < 0) ? 0 : ((studentGrade > 5) ? 5 : studentGrade);
    setGradeAndColor.call(this, studentGrade); // set box color according to grade
    // add student grade in corresponding student's grade array
    techubStudents[Number(this.dataset.id)]
        .setGrade(studentGrade, Number(this.parentElement.dataset.index));
    // if user entered any number exept 0, it means student was present on that lesson and we need to update table accordingly
    if (studentGrade != 0) {
        if (this.dataset.missed == 'true') {
            missedLessons.dataset.count = Number(missedLessons.dataset.count) - 1;
            missedLessons.textContent = missedLessons.dataset.count;
            this.dataset.missed = false; // mark that student was present on that day
        }
    }
    // if user edited previous grade and entered 0 instead of it, we need to mark this day as missed and update table 
    else {
        if (this.dataset.missed == 'false') {
            missedLessons.dataset.count = Number(missedLessons.dataset.count) + 1;
            missedLessons.textContent = missedLessons.dataset.count;
            this.dataset.missed = true; // mark that student was absent on that day
        }
    }
    // update given student's grade average
    document.querySelector(`#stud-${this.dataset.id}`).textContent =
        techubStudents[Number(this.dataset.id)].getGradeAvg();

    updateTotalGradeAvg(); // update total grade average
}


/* ==================== Add/Remove Day Section ==================== */


/* newColumnObj is template for new column added by "Add Day" button */
let newColumnObj = {
    mainSelector: '.grades',
    parent: {
        element: 'div',
        index: 0,
        attributes: {
            'class': 'grade__col'
        }
    },
    firstChild: {
        element: 'div',
        content: '',
        attributes: {
            'class': 'grade__date'
        }
    },
    otherChilds: {
        element: 'div',
        IDs: true,
        content: '0',
        attributes: {
            'class': 'grade__item',
            'data-missed': 'true'
        }
    }
}


// Add event on mouse click to create new day in table
let addDayBtn = document.querySelector("#add-day");
addDayBtn.addEventListener('click', createNewDay);
addDayBtn.addEventListener('click', addPromptWindows);


/* adds prmopt window on each grade box in newly added column*/
function addPromptWindows() {
    let gradeBoxes = Array.from(document.querySelectorAll('.grade__item'));
    for (let node of gradeBoxes) {
        node.addEventListener('click', promptCB);
    }
}


function promptCB({ target }) {
    customPrompt.call(target, "Enter a Student's Grade");
}


// Add event on mouse click to remove last day from table
let removeDayBtn = document.querySelector("#rm-day");
removeDayBtn.addEventListener('click', removeLastDay);

let gradeTable = document.querySelector('.grades'); // gets grade table reference node
gradeTable.addEventListener('wheel', horizScroll); // enables user to scroll horizontally with a mouse wheel


function createNewDay() {
    // if remove button was hidden, display it
    if (gradeTable.children.length == 0) removeDayBtn.classList.toggle('hide');
    // add this property to create a new Techubdate in new column every time user adds new day
    newColumnObj.firstChild.content = new Techubdate().getFullDate();
    newColumnObj.otherChilds.count = Student.count + 1;
    generateHTML(newColumnObj);

    // increase column index by one every time new day is created
    newColumnObj.parent.index += 1;

    totalDays.dataset.count = Number(totalDays.dataset.count) + 1;
    totalDays.textContent = totalDays.dataset.count;

    // increase missed lessons count by student number
    missedLessons.dataset.count = Number(missedLessons.dataset.count) + techubStudents.length;
    missedLessons.textContent = missedLessons.dataset.count;

    // add 0 to every student's grade array
    for (let student of techubStudents) {
        student.pushGrade(0);
        document.querySelector(`#stud-${student.getID()}`).textContent =
            student.getGradeAvg();
    }
    updateTotalGradeAvg();
}


function removeLastDay() {
    Techubdate.resetToPrevDate(); // reset date by to a previous one
    newColumnObj.parent.index -= 1; // decrease column index count

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // it has symbol.iterator but still gives error in microsoft edge !!!review
    // count how many missed lessons was on that day and decrease missed lessons number accordingly
    for (let item of gradeTable.lastChild.children)
        if (item.dataset.missed == "true")
            missedLessons.dataset.count = Number(missedLessons.dataset.count) - 1;
    missedLessons.textContent = missedLessons.dataset.count;

    gradeTable.removeChild(gradeTable.lastChild); // removes last column (day) from grade table

    // if all days are removed, hide remove day button
    if (gradeTable.children.length == 0) removeDayBtn.classList.toggle('hide');

    totalDays.dataset.count = Number(totalDays.dataset.count) - 1;
    totalDays.textContent = totalDays.dataset.count;

    // remove last grade from every student's grade array
    for (let student of techubStudents) {
        student.popGrade();
        document.querySelector(`#stud-${student.getID()}`).textContent =
            student.getGradeAvg();
    }
    updateTotalGradeAvg();
}


function updateTotalGradeAvg() {
    let gradesTotal = 0;
    techubStudents.forEach((student) => {
        gradesTotal += student.getGradeAvg();
    })

    // display average grade in decimal number
    document.querySelector('#avg-grade').textContent =
        Math.round(gradesTotal / techubStudents.length * 100) / 100;
}


function horizScroll(event) {
    if (gradeTable.scrollWidth > 950) { // if we have horizontal scroll
        let sign = (event.deltaY > 0) ? 1 : -1; // sign determines whether we scroll horizontally left or right
        gradeTable.scrollLeft += (sign * 50); // if sign > 0 add 50, if not subtract 50
        event.preventDefault();
    }
}