const GoogleSpreadsheet = require('google-spreadsheet');
const credentials = require('./../../client_secret.json');

module.exports = (reports, testPath) => {
  const { sheetId } = require(`./../../${testPath}/.metrics.js`);
  const doc = new GoogleSpreadsheet(sheetId);
  doc.useServiceAccountAuth(credentials, () =>
    doc.getInfo((_, info) => {
      const amountOfWorksheets = info.worksheets.length;
      doc.addWorksheet(
        {
          title: `Revision #${amountOfWorksheets}`,
          colCount: 3,
          rowCount: reports.length + 1,
          headers: ['metric', 'description', 'value']
        },
        () => {
          const sheet = info.worksheets[amountOfWorksheets];
          reports.forEach(async elem => await sheet.addRow(elem, () => {}));
        }
      );
    })
  );
};
