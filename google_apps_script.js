// =====================================================
// INSTRUCCIONES DE SETUP (5 minutos):
// =====================================================
// 1. Andá a https://script.google.com y creá un nuevo proyecto
// 2. Borrá todo el contenido y pegá este código
// 3. Hacé click en "Ejecutar" > seleccioná la función "setup" > Autorizá los permisos
// 4. Después andá a "Implementar" > "Nueva implementación"
//    - Tipo: "Aplicación web"
//    - Ejecutar como: "Yo"
//    - Quién tiene acceso: "Cualquier persona"
// 5. Copiá la URL que te da (algo como https://script.google.com/macros/s/XXXX/exec)
// 6. Pegá esa URL en los dos HTMLs donde dice PEGAR_URL_ACA
// =====================================================

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    ss = SpreadsheetApp.create('Encuesta Engagement & EXE - Respuestas');
    Logger.log('Spreadsheet creada: ' + ss.getUrl());
  }
  var sheet = ss.getActiveSheet();
  sheet.setName('Respuestas');
  sheet.getRange(1, 1, 1, 19).setValues([[
    'timestamp', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10',
    'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'comentario'
  ]]);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Respuestas');

    var row = [
      new Date().toISOString(),
      data.e1 || '', data.e2 || '', data.e3 || '', data.e4 || '', data.e5 || '',
      data.e6 || '', data.e7 || '', data.e8 || '', data.e9 || '', data.e10 || '',
      data.x1 || '', data.x2 || '', data.x3 || '', data.x4 || '', data.x5 || '',
      data.x6 || '', data.x7 || '',
      data.comentario || ''
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Respuestas');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var responses = [];

  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    responses.push(obj);
  }

  return ContentService.createTextOutput(JSON.stringify(responses))
    .setMimeType(ContentService.MimeType.JSON);
}
