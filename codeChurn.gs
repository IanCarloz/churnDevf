// Email address where to send the results of the churn.
var NOTIFY_EMAIL = "EMAIL ADDRESS TO NOTIFY";

// Numbers of columns containing the needed information.
// Numbers start at 0 (column A). For example, column C would be 2.
var COL_NAME = 1;
var COL_PROGRAM = 2;
var COL_PHONE = 3;
var COL_EMAIL = 4;
var COL_CHURN_NOTE = 8;
var COL_FIRST_DAY_ATTENDANCE = 9;

// The number of frozen header rows that don't contain information
// about students. We assume that every row below this corresponds
// to a student.
var NUM_HEADER_ROWS = 2;

// Number of consecutive misses to trigger an alert.
var ALERT_NUM_MISSES = 3;


/*
 * Master function that calculates churn and sends email.
 */
function churn() {
  var jsonStudents = createJson();
  checkStatus(jsonStudents);

  var nonActive = selectStudents2Notify(jsonStudents);
  notify(nonActive);
}

function createJson() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();

  var students = new Array();

  for (var i = NUM_HEADER_ROWS; i < data.length; i++) {
    var student = new Object();
    var asistances = new Array();

    student.name = data[i][COL_NAME];
    student.program = data[i][COL_PROGRAM];
    student.phone = data[i][COL_PHONE]
    student.email = data[i][COL_EMAIL]
    student.number = i - 1;

    for (var j = COL_FIRST_DAY_ATTENDANCE; j < data[i].length; j++) {
      var asist = data[i][j];
      if (asist === 0 || asist == 1) {
        asistances.push(asist);
      }
    }

    student.asistances = asistances;
    student.active = new Boolean(true);

    function getChurn() {
      if (data[i][COL_CHURN_NOTE]) {
        return true
      } else {
        return false;
      }
    }

    churn = getChurn();
    student.churn = churn;
    students.push(student);
  }
  return students;
}

function checkStatus(students) {
  for (var s = 0; s < students.length; s++) {
    var count = 0;

    for (var day = 0; day < students[s].asistances.length; day++) {
      if (students[s].asistances[day] == 1) {
        count = 0;
      } else if (students[s].asistances[day] == 0) {
        count++;
      }
    }
    students[s].misses = count;
    if (count >= ALERT_NUM_MISSES) {
      students[s].active = false;
    }
  }
}

function selectStudents2Notify(all) {
  var selected = [];

  for (var i = 0; i < all.length; i++) {
    if (!all[i].active && !all[i].churn) {
      selected.push(all[i]);
    }
  }
  return selected;
}

function notify(alumns) {
  function createMessage() {
    var text = new Array();


    for (var n = 0; n < alumns.length; n++ ) {
      text += '<div style="padding: 0.5cm 3cm;">' + alumns[n].number
              + '. <span style="text-transform: capitalize; color: blue;">' + alumns[n].name
              + '</span> (' + alumns[n].email + ', ' + alumns[n].phone + ') of '
              + alumns[n].program + ' -- ' + alumns[n].misses + ' misses</div>';
    }
    return text;
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: "Daily Churn System",
    htmlBody: createMessage()
  });
}
