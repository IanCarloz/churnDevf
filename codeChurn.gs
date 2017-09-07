function churn() {
  var jsonStudents = createJson();
  checkAsistances(jsonStudents);

  var nonActive = selectStudents2Notify(jsonStudents);
  notify(nonActive);
}

function createJson() {
  var students = new Array();
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var totCells = 0;

  for (var i = 2; i < data.length-2; i++) {
    var n = 8;
    var asistances = new Array();
    var student = new Object();

    student.name = data[i][1];
    student.lastname = data[i][2];
    student.program = data[i][3];

    for (var j = 0; j < 20; j++) {
      var asist = data[i][n];
      if (asist === 0 || asist == 1) {
        asistances.push(asist);
      }
      n++;
    }
    student.asistances = asistances;
    student.active = new Boolean(true);
    students.push(student);
  }
  return students;
}

function checkAsistances (students) {
  for (var s = 0; s<students.length; s++) {
    var day = 0;
    var count = 0;

    for (var day = 0; day < students[s].asistances.length; day++) {
      if (students[s].asistances[day] == 1) {
        count = 0;
      } else if (students[s].asistances[day] == 0) {
        count++;
      }
    }
    if (count > 3) {
      students[s].active = false;
    }
  }
}

function selectStudents2Notify(all) {
  var selected = [];

  for (var i = 0; i<all.length; i++) {
    if (!all[i].active) {
      selected.push(all[i].name);
    }
  }
  return selected;
}

function notify(alumns) {
  var emailAddress = "iancarloz27g@gmail.com";
  var subject = "Churn System";
  var message = alumns;

  MailApp.sendEmail(emailAddress, subject, message);
}
