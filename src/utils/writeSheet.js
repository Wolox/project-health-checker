const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const credentials = require('./sheetConfig');
const { green } = require('../constants/colors');

const ten = 10;
const lapseConstant = 300;

module.exports = async (reports, testPath) => {
  const { sheetId } = require(`./../../${testPath}/.metrics.js`);
  const doc = new GoogleSpreadsheet(sheetId);
  await promisify(doc.useServiceAccountAuth)(credentials);
  const response = await promisify(doc.getInfo)();
  const amountOfWorksheets = response.worksheets.length;
  doc.addWorksheet(
    {
      title: `Revision #${amountOfWorksheets}`,
      colCount: 3,
      rowCount: reports.length + 1,
      headers: ['metric', 'description', 'value']
    },
    () => {
      const requests = reports.map(
        (elem, index) =>
          new Promise(resolve => {
            const sheet = response.worksheets[amountOfWorksheets];
            setTimeout(
              () => sheet.addRow(elem, resolve),
              (index % ten) * lapseConstant // eslint-disable-line no-extra-parens
            );
          })
      );
      Promise.all(requests).then(() => {
        console.log(green, 'Auditoria terminada con exito');
        process.exit();
      });
    }
  );
};
