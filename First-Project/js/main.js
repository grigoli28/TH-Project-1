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
for (let i = 0; i < studentNames.length; i++) {
    techubStudents.push(new Student(studentNames[i], i));
    document.querySelector(`#student-${i}`).innerHTML = studentNames[i];
}

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


/* ==================== Prompt on mouse click section ==================== */

const enterKeyCode = 13;
const escKeyCode = 27;

let promptBackgr = document.querySelector('.prompt'),
    promptMessage = document.querySelector('.prompt__message'),
    promptInput = document.querySelector('.prompt__input'),
    promptOk = document.querySelector('#ok'),
    promptCancel = document.querySelector('#cancel');


function customPrompt(message) {
    promptInput.value = ''; // reset input value to an empty string
    promptBackgr.classList.add('show'); // display prompt window
    promptInput.focus(); // auto focus input when prompt is shown
    promptMessage.innerHTML = message; // insert given message
    promptInput.oninput = () => validateString(promptInput.value); // show popup to users if they enter invalid string
    promptInput.onkeyup = inputCB; // allow user to use ESC and Enter on input
    promptOk.onclick = okCB; // continue when OK button is pressed
    promptCancel.onclick = () => hidePrompt(); // cancel when Cancel button is pressed
    let self = this;

    function okCB() {
        if (validateString(promptInput.value)) { // continue ONLY if entered string is valid
            editGrade.call(self, promptInput.value); // insert given grade in grade table
            hidePrompt();
        }
    }

    function inputCB(event) {
        if (event.keyCode == enterKeyCode) // if Enter was pressed
            okCB();
        if (event.keyCode == escKeyCode) // if ESC was pressed
            hidePrompt();
    }
}


function validateString(val) {
    let invalidNumPopup = document.querySelector('.prompt__popup'); // popup when string is invalid
    let emptyStringPopup = document.querySelector('.prompt__popup--empty'); // popup when input is empty

    if (val == '') { // if input is empty
        emptyStringPopup.classList.add('show');
        return false;
    }
    emptyStringPopup.classList.remove('show'); // remove popup if user entered a number

    if (isNaN(Number(val))) { // if entered string is invalid
        invalidNumPopup.classList.add('show');
        return false;
    }
    invalidNumPopup.classList.remove('show'); // remove popup if string is valid
    return true;
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
        .setGrade(studentGrade, Number(this.parentElement.dataset.colIndex));
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
        count: 10,
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


function createNewDay() {
    // if remove button was hidden, display it
    if (gradeTable.children.length == 0) removeDayBtn.classList.toggle('hide');
    // add this property to create a new Techubdate in new column every time user adds new day
    newColumnObj.firstChild.content = new Techubdate().getFullDate();
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
    for (let student of techubStudents) {
        gradesTotal += student.getGradeAvg();
    }
    // display average grade in decimal number
    document.querySelector('#avg-grade').textContent =
        Math.round(gradesTotal / techubStudents.length * 100) / 100;
}