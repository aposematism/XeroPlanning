function testConnection(context) {
    // Step 1: Test connection to - api.xero.com (any interface)
    var url = 'https://api.xero.com/connections';
    var method = 'GET';
    // Setup request in body, sample is using xml, but could be json
    var body = '';
    var headers = {};
    // Step 2: Send request and receive response
    var response = null;
  
    try {
      response = ai.https.authorizedRequest(url, method, body, headers);
    }
    catch (exception) {
      // Example of logging to the CCDS log using the Error loglevel
      ai.log.logError('Test Connection HTTPS Request failed', ''+exception);
      return false;
    }
  
    // Step 3: Interrogate response to see if it was successful. Return true or false depending on the result.
    // Check that http communication was successful
    if (response.getHttpCode() == '200') {
      return true;
    } else {
      return false;
    }
  }
  function importStructure(context) {
    var builder = context.getStructureBuilder();
    var progressManager = context.getProgressManager();
  
    var progressIncrement = 100 / 12;
  
    var table = builder.addTable('PL');
    table.setDisplayName('PL');
    var i = 0;
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
    createColumn(table, "TenantId", "Tenant Id", i++, true, "string");
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
    createColumn(table, "CompanyName", "Company Name", i++, true, "string");
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
    createColumn(table, "Account", "Account", i++, true, "string");
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
    createColumn(table, "Period", "Period", i++, true, "string");
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
    createColumn(table, "Amount", "Amount", i++, true, "currency");
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
  
  
  
    table = builder.addTable('BS');
    table.setDisplayName('BS');
    i = 0;
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
    createColumn(table, "TenantId", "Tenant Id", i++, true, "string");
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
    createColumn(table, "CompanyName", "Company Name", i++, true, "string");
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
    createColumn(table, "Account", "Account", i++, true, "string");
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
    createColumn(table, "Period", "Period", i++, true, "string");
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
    createColumn(table, "Amount", "Amount", i++, true, "currency");
    progressManager.setProgress(progressManager.getProgress() + progressIncrement);
  }
  
  function createColumn(table, columnId, columnDisplayName, displayOrder, mandatoryForImports, dataType) {
    var column = table.addColumn(columnId);
    column.setDisplayName(columnDisplayName);
    column.setDisplayOrder(displayOrder);
    column.setMandatoryForImports(mandatoryForImports);
    switch (dataType) {
      case "integer":
        column.setIntegerColumnType();
        break;
      case "string":
      case "base64_encoded":
        column.setTextColumnType(150);
        break;
      case "date":
        column.setDateTimeColumnType();
        break;
      case "datetime":
        column.setDateTimeColumnType();
        break;
      case "boolean":
        column.setBooleanColumnType();
        break;
      case "number":
      case "currency":
        column.setFloatColumnType();
        break;
      default:
        // unknown type
        ai.log.logInfo('Unable to create a column. Its type is unknown.', 'Column ' + columnId + ' could not be created because its data type was not known. Its data type was ' + dataType +
          '.');
        break;
    }
  }
  
  
  function importData(context) {
    // Step 1: Make use of passed in contextual information to create a rowset object. Here, I am simply assigning tableId, maxRows and columnNames to variables to be used elsewhere in this script.
    var rowset = context.getRowset();
    rowset.setSmartParsingEnabled(true);
    var tableId = rowset.getTableId();
    var method = 'GET';
    var body = '';
  
    // retrieve list of tenant id
    var list = tenantIds(context);
    for (var i = 0; i < list.length; i++) {
      var value = list[i];
      var headers = {'xero-tenant-id': value };
  
      if (tableId === 'PL') {
        // Step 3: Send https request and receive response. Normally you would want to check that the response contains a success message first before looking at the rows.
        var response = ai.https.authorizedRequest(plUrl(context), method, body, headers);
        // Step 4: Parse the https response body.
        var data = JSON.parse(response.getBody());
        // Step 5: Process each row to extract the cell values for each column and add them as an array to the rowset in the expected column order.   
        // ai.log.logInfo('data: ', JSON.stringify(data));
        var periods = flattenPeriods(data['Reports'][0]['Rows']);
        addRows(rowset, data['Reports'][0]['Rows'], periods, value, data['Reports'][0]['ReportTitles'][1]);
      } else if (tableId === 'BS') {
        // Step 3: Send https request and receive response. Normally you would want to check that the response contains a success message first before looking at the rows.
        var response = ai.https.authorizedRequest(bsUrl(context), method, body, headers);
        // Step 4: Parse the https response body.
        var data = JSON.parse(response.getBody());
        // Step 5: Process each row to extract the cell values for each column and add them as an array to the rowset in the expected column order.   
        // ai.log.logInfo('data: ', JSON.stringify(data));
        var periods = flattenPeriods(data['Reports'][0]['Rows']);
        addRows(rowset, data['Reports'][0]['Rows'], periods, value, data['Reports'][0]['ReportTitles'][1]);
      }
    }
  }
  
  function flattenPeriods(rows) {
    var results = []
    for (var i = 0; i < rows.length; i++) {
      if (rows[i]['RowType'] == 'Header'){
        var header = rows[i]['Cells'];
        for (var k = 1; k < header.length; k++) {
          results.push(header[k]['Value']);
        }
        break;
      }
    }
    return results;
  }
  
  function addRows(rowset, rows, periods, id, cName) {
    // Step 5: Process each row to extract the cell values for each column 
    // and add them as an array to the rowset in the expected column order.
    // In this case, each 'row' is represented as a single JSON object, 
    // where each property is the name of the column and each value of each 
    // property is the cell value for the row's column.
  
    var cols = rowset.getColumns().map(function(value){
      return value.getDisplayName();
    });
  
    for (var i = 0; i < rows.length; i++) {
      if (rows[i]['RowType'] == 'Header' || rows[i]['RowType'] == 'SummaryRow') {
        continue;
      } else if (rows[i]['RowType'] == 'Section') {
        addRows(rowset, rows[i]['Rows'], periods, id, cName)
      } else if (rows[i]['RowType'] == 'Row') {
        var row = rows[i]
        // ai.log.logInfo('Row: ', JSON.stringify(row));
        for (var k = 1; k < row['Cells'].length; k++) {
          var cells = [];
          if(cName == 'Rockit Global Limited' && row['Cells'][0]['Value'] == 'Administration Expense (Internal)' ){ai.log.logInfo('row: ', JSON.stringify(row));}
          cells[cols.indexOf('Tenant Id')] = id;
          cells[cols.indexOf('Company Name')] = cName;
          cells[cols.indexOf('Period')] = reportDate(periods[k-1]);
          cells[cols.indexOf('Amount')] = parseFloat(row['Cells'][k]['Value']);
          // cells[cols.indexOf('Attributes')] = JSON.stringify(row['Cells'][k]['Attributes']) || '';
          cells[cols.indexOf('Account')] = row['Cells'][0]['Value'];
          rowset.addRow(cells);
        }
      } else {
        ai.log.logError('addRows Error: Unknown RowType Found: ', rows[i]['RowType'])
      }
    }
  }
  
  function previewData(context)
  {
    var rowset = context.getRowset();
    rowset.setSmartParsingEnabled(true);
    var tableId = rowset.getTableId();
   
    // Step 2: Create a https request that will return data - for this example, 
    var method = 'GET';
    // Setup request in body, sample is using xml, but could be json
    var body = '';
    var headers = { 'xero-tenant-id': dataSource.getSetting('tenant-id-1').getValue() };
    var date = new Date();
    var toDate = date.toISOString().replace(/T.*/, '');
    date.setMonth(date.getMonth()-1 , 1);
    var fromDate = date.toISOString().replace(/T.*/, '');
    
      if (tableId === 'PL') {
      var response = ai.https.authorizedRequest(plUrl(context, `?fromDate=${fromDate}&periods=1&timeframe=MONTH`), method, body, headers);
  
      var data = JSON.parse(response.getBody());
      // Step 5: Process each row to extract the cell values for each column and add them as an array to the rowset in the expected column order.   
      // ai.log.logInfo('data: ', JSON.stringify(data));
      addRows(rowset, data['Reports'][0]['Rows'], 1, dataSource.getSetting('tenant-id-1').getValue(), data['Reports'][0]['ReportTitles'][1]);
    }
  }
  
  function plUrl(context, period) {
    var dataSource = context.getDataSource();
    var url = 'https://api.xero.com/api.xro/2.0/Reports/ProfitAndLoss'
    if (period != null) {
      url += period
    } else {
      var dateRange = dataSource.getSetting('date-range').getValue();
      var fromDate = dateRange.getFromPeriodStartDateTime().replace(/T.*/, '');
      var toDate = dateRange.getFromPeriodEndDateTime().replace(/T.*/, '');
      var toDateDate = new Date(toDate);
      var toDateM1 = new Date();
      toDateM1 = toDateDate.getTime() - (1000*60 *60*24);
      var toDate3 = new Date(toDateM1);
      var toDateM1s = toDate3.toISOString().replace(/T.*/, '');
      url += `?fromDate=${fromDate}&toDate=${toDateM1s}`
       }
  
    ai.log.logInfo('URL: ', url);
    return url
  }
  
  function bsUrl(context, period) {
    var dataSource = context.getDataSource();
    var url = 'https://api.xero.com/api.xro/2.0/Reports/BalanceSheet'
    if (period != null) {
      url += period
    } else {
      var dateRange = dataSource.getSetting('date-range').getValue();
      var fromDate = dateRange.getFromPeriodStartDateTime().replace(/T.*/, '');
      url += `?date=${fromDate}`
     //url += `?fromDate=2021-08-21&toDate=2021-08-23`
    }
  
    ai.log.logInfo('URL: ', url);
    return url
  }
  
  function reportDate(dateString) {
    var date = new Date(dateString);
    date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }
  
  function tenantIds(context) {
    return context.getDataSource().getSettings().filter(function(setting){
    return setting.getDisplayName().match(/tenant-id-\d+/);
    }).map(function(value){
    return value.getValue();
    });
  }
  
