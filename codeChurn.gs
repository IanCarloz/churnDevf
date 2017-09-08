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

  for (var i = 2; i < data.length; i++) {
    var student = new Object();
    var asistances = new Array();

    student.name = data[i][1];
    student.lastname = data[i][2];
    student.program = data[i][3];
    student.number = i - 1;

    var n = 8;
    for (var j = 0; j < 20; j++) {
      var asist = data[i][n];
      if (asist === 0 || asist == 1) {
        asistances.push(asist);
      }
      n++;
    }

    student.asistances = asistances;
    student.active = new Boolean(true);

    function getChurn() {
      if (data[i][34]) {
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
    if (count > 3) {
      students[s].active = false;
    }
  }
}

function selectStudents2Notify(all) {
  var selected = [];

  for (var i = 0; i<all.length; i++) {
    if (!all[i].active && !all[i].churn) {
      selected.push(all[i]);
    }
  }
  return selected;
}

function notify(alumns) {
  var emailAddress = "iancarloz27g@gmail.com";
  var subject = "Daily Churn System";

  function createMessage() {
    var text = new Array();

    for (var n = 0; n<alumns.length; n++ ) {
      text += "<div style='padding: 0.5cm 3cm;'><h4>"+alumns[n].number+'. <span style="text-transform: capitalize; color: blue;">'+alumns[n].name +"</h4></span>"+'of '+alumns[n].program+'<br><br>churn: '+alumns[n].churn+ "</div>";
    }
    return text;
  }

  MailApp.sendEmail({
    to: emailAddress,
    subject: "new Churn",
    htmlBody: createMessage()
  });
}
