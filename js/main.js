'use strict';

let techubStudents = [];

let totalDays = document.querySelector('#tot-days'),
    missedLessons = document.querySelector('#miss-less'),
    totalGrade = document.querySelector('#avg-grade'),
    totalStudents = document.querySelector('#tot-stud');

totalStudents.dataset.count = techubStudents.length; // update student statistics
totalStudents.textContent = totalStudents.dataset.count;


/* ==================== Statistics animation section ==================== */

let options = { childList: true };

let daysObserver = new MutationObserver(mutationCB),
    lessonsObserver = new MutationObserver(mutationCB),
    gradesObserver = new MutationObserver(mutationCB),
    studentsObserver = new MutationObserver(mutationCB);

daysObserver.observe(totalDays, options);
lessonsObserver.observe(missedLessons, options);
gradesObserver.observe(totalGrade, options);
studentsObserver.observe(totalStudents, options);


function mutationCB([{ target }]) {
    target.classList.toggle('animator');
    setTimeout(() => { // remove class so that elements animate on every change when class is added again
        target.classList.toggle('animator');
    }, 150);
}


/* ========================== Add/Remove student section ============================= */

let newStudRow = {
    mainSelector: '.students',
    parent: {
        element: 'div',
        attributes: {
            'class': 'student__item'
        }
    }
}

let newAvgGradeRow = {
    mainSelector: '.avg-grades',
    parent: {
        element: 'div',
        content: '0',
        attributes: {
            'class': 'avg-grade__item',
        }
    }
}

let studentsColumn = document.querySelector('.students');
let avgGradeColumn = document.querySelector('.avg-grades');

let addStudBtn = document.querySelector('#add-stud');
addStudBtn.addEventListener('click', function addStudCB() {
    customPrompt(`Enter a Student's Name`, 'string');
});


function addNewStudent(name) {
    if (studentsColumn.children.length == 1) removeStudBtn.classList.toggle('hidden');

    techubStudents.push(new Student(name));
    for (let i = 0; i < totalDays.dataset.count; i++) {
        techubStudents[techubStudents.length - 1].pushGrade(0);
    }
    totalStudents.dataset.count = Number(totalStudents.dataset.count) + 1;
    totalStudents.textContent = totalStudents.dataset.count;

    newStudRow.parent.attributes.id = `student-${techubStudents.length - 1}`; // add id
    newAvgGradeRow.parent.attributes.id = `stud-${techubStudents.length - 1}`;
    generateHTML(newStudRow);
    generateHTML(newAvgGradeRow);

    studentsColumn.lastChild.innerHTML = name;

    missedLessons.dataset.count = Number(missedLessons.dataset.count) + Number(totalDays.dataset.count);
    missedLessons.textContent = missedLessons.dataset.count;

    for (let column of gradeTable.children) { // add new row for current student (add new grade box at the end of each column)
        generateHTML({
            mainSelector: `[data-index="${column.dataset.index}"]`,
            parent: {
                element: 'div',
                content: '0',
                attributes: {
                    'class': 'grade__item',
                    'data-id': `${totalStudents.dataset.count - 1}`,
                    'data-missed': 'true'
                }
            }
        })
    }
    addPromptWindows();
    updateTotalGradeAvg();
}


let removeStudBtn = document.querySelector('#rm-stud');
removeStudBtn.addEventListener('click', removeLastStudent);


function removeLastStudent() {
    if (studentsColumn.children.length == 2) removeStudBtn.classList.toggle('hidden');

    techubStudents.pop();
    Student.decreaseCount();
    totalStudents.dataset.count = Number(totalStudents.dataset.count) - 1;
    totalStudents.textContent = totalStudents.dataset.count;

    // decrease missed lessons count if we removed days that were marked as missed
    for (let column of gradeTable.children) {
        if (column.lastElementChild.dataset.missed == "true")
            missedLessons.dataset.count = Number(missedLessons.dataset.count) - 1;
    }
    missedLessons.textContent = missedLessons.dataset.count;

    // remove last grade box from each column
    for (let column of gradeTable.children)
        column.removeChild(column.lastElementChild);

    studentsColumn.removeChild(studentsColumn.lastElementChild);
    avgGradeColumn.removeChild(avgGradeColumn.lastElementChild);

    updateTotalGradeAvg();
}


/* ==================== Prompt window section ==================== */

const enterKeyCode = 13;
const escKeyCode = 27;

let promptBackgr = document.querySelector('.prompt'),
    promptMessage = document.querySelector('.prompt__message'),
    promptInput = document.querySelector('.prompt__input'),
    promptOk = document.querySelector('#ok'),
    promptCancel = document.querySelector('#cancel');


function customPrompt(message, type = 'number') {
    promptInput.value = ''; // reset input value
    promptBackgr.classList.add('show');
    promptInput.focus();
    promptMessage.innerHTML = message;
    promptInput.oninput = () => validate(promptInput.value, type); // show popup if user enters invalid number/string
    promptInput.onkeyup = inputCB; // add ESC and Enter actions
    promptOk.onclick = okCB;
    promptCancel.onclick = cancelCB;
    let self = this;

    function okCB() {
        if (validate(promptInput.value, type) && type == 'number') { // if we validated a number
            editGrade.call(self, promptInput.value);
            hidePrompt();
            return;
        }
        if (validate(promptInput.value, type) && type == 'string') { // if we validated a string
            addNewStudent(promptInput.value);
            hidePrompt();
            return;
        }
    }

    function cancelCB() {
        invalidNumPopup.classList.remove('show'); // reset all popups
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


/* ========================= Number/String validation section ============================= */

let invalidNumPopup = document.querySelector('.prompt__popup--grade'),
    invalidNamePopup = document.querySelector('.prompt__popup--name'),
    emptyFieldPopup = document.querySelector('.prompt__popup--empty');


function validate(value, type) {
    if (type == 'number') { // if we want validation for a number
        if (value == '') {
            invalidNumPopup.classList.remove('show');
            emptyFieldPopup.classList.add('show');
            return false;
        }
        emptyFieldPopup.classList.remove('show');

        if (isNaN(value)) { // if entered number is invalid
            invalidNumPopup.classList.add('show');
            return false;
        }
        invalidNumPopup.classList.remove('show');
        return true;
    }
    if (type == 'string') { // if we want validation for a string
        if (value == '') {
            invalidNamePopup.classList.remove('show');
            emptyFieldPopup.classList.add('show');
            return false;
        }
        emptyFieldPopup.classList.remove('show');

        if (!isNaN(value)) { // if user enteres only digits
            invalidNamePopup.classList.add('show');
            return false;
        }
        invalidNamePopup.classList.remove('show');
        return true;
    }
}


function hidePrompt() {
    promptBackgr.classList.remove('show');
}


/* ========================= Add/Edit grade section ================================ */

function editGrade(studentGrade) {
    studentGrade = Math.round(Number(studentGrade));
    // make sure grade is between 0 and 5;
    studentGrade = (studentGrade < 0) ? 0 : ((studentGrade > 5) ? 5 : studentGrade);
    setGradeAndColor.call(this, studentGrade);
    // replace old grade in the array at a corresponding index
    techubStudents[Number(this.dataset.id)]
        .setGrade(studentGrade, Number(this.parentElement.dataset.index));
    // if user entered a grade, mark this lesson as not missed and update table
    if (this.dataset.missed == 'true' && studentGrade != 0) {
        this.dataset.missed = false;
        missedLessons.dataset.count = Number(missedLessons.dataset.count) - 1;
        missedLessons.textContent = missedLessons.dataset.count;
    }
    // if user changed previous grade to 0, mark this day as missed and update table 
    if (this.dataset.missed == 'false' && studentGrade == 0) {
        this.dataset.missed = true;
        missedLessons.dataset.count = Number(missedLessons.dataset.count) + 1;
        missedLessons.textContent = missedLessons.dataset.count;
    }
    // update current student's grade average
    document.querySelector(`#stud-${this.dataset.id}`).textContent =
        techubStudents[Number(this.dataset.id)].getGradeAvg();

    updateTotalGradeAvg(); // update total grade average
}


function horizScroll(event) {
    if (gradeTable.scrollWidth > gradeTable.clientWidth) { // if we have horizontal scroll
        gradeTable.scrollLeft += ((event.deltaY > 0 ? 1 : -1) * 50); // determine whether we scroll horizontally left or right
        event.preventDefault();
    }
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


let addDayBtn = document.querySelector("#add-day");
addDayBtn.addEventListener('click', createNewDay);
addDayBtn.addEventListener('click', addPromptWindows);


/* adds prmopt window on each grade box in newly added column */
function addPromptWindows() {
    let gradeBoxes = Array.from(document.querySelectorAll('.grade__item'));
    for (let node of gradeBoxes) {
        node.onclick = promptCB;
    }
}


function promptCB({ target }) {
    customPrompt.call(target, "Enter a Student's Grade");
}


let removeDayBtn = document.querySelector("#rm-day");
removeDayBtn.addEventListener('click', removeLastDay);

let gradeTable = document.querySelector('.grades');
gradeTable.addEventListener('wheel', horizScroll); // enable horizontal scrolling


function createNewDay() {
    if (gradeTable.children.length == 0) // if remove button was hidden, display it
        removeDayBtn.classList.toggle('hidden');

    // create a new Techubdate object in new column every time user adds new day
    newColumnObj.firstChild.content = new Techubdate().toString();
    newColumnObj.otherChilds.count = techubStudents.length;
    generateHTML(newColumnObj);

    newColumnObj.parent.index += 1;

    totalDays.dataset.count = Number(totalDays.dataset.count) + 1;
    totalDays.textContent = totalDays.dataset.count;

    missedLessons.dataset.count = Number(missedLessons.dataset.count) + techubStudents.length;
    missedLessons.textContent = missedLessons.dataset.count;

    for (let student of techubStudents) {
        student.pushGrade(0);
        // update grade average
        document.querySelector(`#stud-${student.getID()}`).textContent =
            student.getGradeAvg();
    }
    updateTotalGradeAvg();
}


function removeLastDay() {
    Techubdate.resetToPrevDate();
    newColumnObj.parent.index -= 1; // decrease column index

    for (let item of gradeTable.lastElementChild.children)
        if (item.dataset.missed == "true")
            missedLessons.dataset.count = Number(missedLessons.dataset.count) - 1;
    missedLessons.textContent = missedLessons.dataset.count;

    gradeTable.removeChild(gradeTable.lastElementChild); // removes last column (day) from grade table

    // if all days are removed, hide remove day button
    if (gradeTable.children.length == 0) removeDayBtn.classList.toggle('hidden');

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
    if (techubStudents.length) {
        let gradesTotal = 0;
        techubStudents.forEach((student) => {
            gradesTotal += student.getGradeAvg();
        })
        document.querySelector('#avg-grade').textContent =
            Math.round(gradesTotal / techubStudents.length * 100) / 100;
    } else // if no student was added yet display 0
        document.querySelector('#avg-grade').textContent = 0;
}