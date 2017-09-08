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

  for (var i = 2; i < data.length; i++) {
    var asistances = new Array();
    var student = new Object();

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
//      var empty = new Boolean(false);
      if (data[i][34]) {
        return true
      } else {
        return false;
      }
    }
    churn = getChurn();
    student.churn = churn;
//    Logger.log(data[i][1]);
//    Logger.log(data[i][34]);
    for (var e = 0; e<data[i].length; e++) {
//      Logger.log(e+data[i][e]);
    }
    if (data[i][34]) {
//      Logger.log(data[i][34]+'is true');
    } else {
//      Logger.log(data[i][34]+'is false');
    }
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
//    Logger.log(all[i].number+', '+all[i].name+', '+all[i].churn);
    if (!all[i].active && !all[i].churn) {
      selected.push(all[i]);
    }
  }
  Logger.log(selected)
  return selected;
}

function notify(alumns) {
  var emailAddress = "iancarloz27g@gmail.com";
  var subject = "Churn System";

  function createMessage() {
    var text = new Array();

    for (var n = 0; n<alumns.length; n++ ) {
      text += "<h4 style='text-transform: capitalize; margin-bottom: 0'>"+alumns[n].name +"</h4><div>"+'of '+alumns[n].program+'!'+ "</div>";
    }
    return text;
  }

  MailApp.sendEmail({
    to: emailAddress,
    subject: "new Churn",
    htmlBody: createMessage()
  });
//  MailApp.sendEmail(emailAddress, subject, message);
}
