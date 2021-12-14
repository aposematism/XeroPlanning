/**  
 * The complexity is we can't use the external xero api's reporting functionality to produce these daily account balance reports.
 * Instead, we need to provide it by requesting the bank transactions in each account, summing it for the balance each day.
 * 
 * So we need to retrieve a list of all the accounts, 
 * then retrieve the balance in those accounts each day as the sum of the previous total plus all transactions.
 * **/
/** Simple test connection function, built for utilizing Adaptive Insight's API**/
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

/** This is a special function defined within Adaptive Insight's API for the structure of the table we want to fill with info. **/
function importStructure(context) {
  var builder = context.getStructureBuilder();
  var progressManager = context.getProgressManager();
  
  var progressIncrement = 100/41;
  
  var accountTable = builder.addTable('Accounts');
  accountTable.setDisplayName('Accounts');

  var i = 0;
  
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//1
  createColumn(accountTable, "TenantId", "Tenant Id", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//2
  createColumn(accountTable, "AccountID", "Account ID", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//3
  createColumn(accountTable, "Name", "Account Name", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//4
  createColumn(accountTable, "Status", "Account Status", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//5
  createColumn(accountTable, "AccountNumber", "Bank Account Number", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//6
  createColumn(accountTable, "CurrencyCode", "Currency Code", i++, true, "string");

  var transactionTable = builder.addTable('Bank_Transactions');
  transactionTable.setDisplayName('Transactions');
  i = 0;
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//7
  createColumn(transactionTable, "TenantId", "Tenant ID", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//8
  createColumn(transactionTable, "TransactionID", "Transaction ID", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//9
  createColumn(transactionTable, "AccountID", "Account ID", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//10
  createColumn(transactionTable, "ContactID", "Contact ID", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//11
  createColumn(transactionTable, "DateString", "Date", i++, true, "date");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//12
  createColumn(transactionTable, "TransactionStatus", "Transaction Status", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//13
  createColumn(transactionTable, "TaxInclusive", "Tax Inclusive", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//14
  createColumn(transactionTable, "SubTotal", "Sub Total", i++, true, "currency");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//15
  createColumn(transactionTable, "TotalTax", "Total Tax", i++, true, "currency");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//16
  createColumn(transactionTable, "Total", "Total", i++, true, "currency");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//17
  createColumn(transactionTable, "CurrencyCode", "Currency Code", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//18
  createColumn(transactionTable, "Reconciled", "Reconciled", i++, true, "boolean");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//19
  createColumn(transactionTable, "Reference", "Reference", i++, true, "string");

  var balanceTable = builder.addTable('AccountBalances');
  balanceTable.setDisplayName('Account Balance');
  i = 0;
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//20
  createColumn(balanceTable, "TenantId", "Tenant ID", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//21
  createColumn(balanceTable, "AccountID", "Account ID", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//22
  createColumn(balanceTable, "DateString", "Date", i++, true, "date");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//23
  createColumn(balanceTable, "OpenBalance", "Opening Balance", i++, true, "currency");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//24
  createColumn(balanceTable, "CashIn", "Cash Received", i++, true, "currency");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//25
  createColumn(balanceTable, "CashOut", "Cash Spent", i++, true, "currency");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//26
  createColumn(balanceTable, "CloseBalance", "Closing Balance", i++, true, "currency");

  var contactTable = builder.addTable('Contacts');
  contactTable.setDisplayName('Contacts');
  i = 0;
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//27
  createColumn(contactTable, "TenantId", "Tenant ID", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//28
  createColumn(contactTable, "ContactID", "Contact ID", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//29
  createColumn(contactTable, "AccountNumber", "Account Number", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//30
  createColumn(contactTable, "ContactStatus", "Contact Status", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//31
  createColumn(contactTable, "ContactName", "Contact Name", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//32
  createColumn(contactTable, "FirstName", "First Name", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//33
  createColumn(contactTable, "LastName", "Last Name", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//34
  createColumn(contactTable, "Email", "Email", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//35
  createColumn(contactTable, "Skype", "Skype Name", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//36
  createColumn(contactTable, "ContactBankAccount", "Contact Bank Account", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//37
  createColumn(contactTable, "TaxNumber", "Tax Number", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//38
  createColumn(contactTable, "AccountsReceivable", "Accounts Receivable Tax Type", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//39
  createColumn(contactTable, "AccountsPayable", "Accounts Payable Tax Type", i++, true, "string");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//40
  createColumn(contactTable, "Supplier", "Supplier", i++, true, "boolean");
  progressManager.setProgress(progressManager.getProgress() + progressIncrement);//41
  createColumn(contactTable, "Customer", "Customer", i++, true, "boolean");
}

/** 
 * This is a special function defined with Adaptive Insight's API to fill the table with data. 
 * NOTE: Xero Date inputs are totally fucked. You have to search by the specific Date String rather than a Date range due to this.
 * @parameter - context - A variable provided by Adaptive Planning (originally called Adaptive Insights).
 * **/
function importData(context) {
  var rowset = context.getRowset();
  rowset.setSmartParsingEnabled();
  var tableId = rowset.getTableId();
  var method = 'GET';
  var body = '';
  var startDate = periodStartDate(context);
  var endDate = periodEndDate(context);
  /** Date Range generation **/
  var dateRange = generateDateRange(startDate, endDate);
  //ai.log.logInfo("Date Generated! ", dateRange.toString());
  //List of tenant IDs (Xero Accounts).
  var list = tenantIds(context);
  ai.log.logInfo(tableId);
  for (var i = 0; i < list.length; i++) {//This is our bank account table filling section.
    var headers = {'xero-tenant-id': list[i] };
    if(tableId === 'Accounts'){
      accountProcess(rowset, method, body, headers, list[i]);
    }
    if(tableId === 'Bank_Transactions'){
      bankTransactionProcess(rowset, method, body, headers, list[i], startDate, endDate);
    }
    if(tableId === 'AccountBalances'){
      accountBalanceProcess(rowset, method, body, headers, list[i], dateRange);
    }
    if(tableId === 'Contacts'){
      contactsProcess(rowset, method, body, headers, list[i]);
    }
  }
}

/** This is a special function defined with Adaptive Insight's API to prepare data. **/
function previewDate(context){

}

/** 
 * 
 * Table Loading and Importing functions.
 * 
 * **/

/** 
 * This function is the primary controller for the account table loading methods.
 * @parameter - rowset - the Table object we interact with to add transactions.
 * @parameter - method - The type of HTTP request we want to make - GET, POST, PUT, DELETE etc
 * @parameter - body - Body of the JSON we are sending. We aren't using this since we are querying by the URL parameters.
 * @parameter - headers - Contains our tenant ID for the HTTP request.
 * @parameter - tenantID - Xero tenant ID. Used for the table as a foreign key.
 * **/
function accountProcess(rowset, method, body, headers, tenantID){
  try{
    var accountData = retrieveBankAccounts(method, body, headers);
    var processedAccounts = processBankAccounts(accountData);
    addBankAccountRows(rowset, processedAccounts, tenantID);
  }
  catch(err){
    ai.log.logError(err);
  }
}

/** 
 * This function is the primary controller for the bank transaction table loading methods.
 * @parameter - rowset - the Table object we interact with to add transactions.
 * @parameter - method - The type of HTTP request we want to make - GET, POST, PUT, DELETE etc
 * @parameter - body - Body of the JSON we are sending. We aren't using this since we are querying by the URL parameters.
 * @parameter - headers - Contains our tenant ID for the HTTP request.
 * @parameter - tenantID - Xero tenant ID. Used for the table as a foreign key.
 * @parameter - fromDate - Start Date of the time period of transactions we want to load. Inclusive of this Date.
 * @parameter - toDate - End Date of the time period of transactions we want to load. Inclusive of this Date.
 * **/
function bankTransactionProcess(rowset, method, body, headers, tenantID, fromDate, toDate){
  var accountData = retrieveBankAccounts(method, body, headers);
  var processedAccounts = processBankAccounts(accountData);
  for(var j = 0; j < processedAccounts.length; j++){
    var transactions = [];
    var requestMore = true;
    for(var page = 1; requestMore; page++){
      transactions = retrieveTransactions(method, body, headers, processedAccounts[j].AccountID, page, fromDate, toDate);
      var processedTrans = processTransactions(transactions);
      addTransactionRows(rowset, processedTrans, tenantID);
      requestMore = requestPage(transactions.BankTransactions.length);
    }
  }
}

/** 
 * This function is the primary controller for the account balance table loading methods.
 * @parameter - rowset - the Table object we are interacting with to add current account balances at some date.
 * @parameter - method - The type of HTTP request we want to make - GET, POST, PUT, DELETE etc
 * @parameter - body - Body of the JSON we are sending. We aren't using this since we are querying by the URL parameters.
 * @parameter - headers - Contains our tenant ID for the HTTP request.
 * @parameter - tenantID - Xero tenant ID. Used for the table as a foreign key.
 * @parameter - fromDate - Start Date of the time period of transactions we want to load. Inclusive of this Date.
 * @parameter - toDate - End Date of the time period of transactions we want to load. Inclusive of this Date.
 * **/
function accountBalanceProcess(rowset, method, body, headers, tenantID, dateRange){
  //ai.log.logInfo("FromDate: ", fromDate.toISOString());
  //ai.log.logInfo("ToDate: ", toDate.toISOString());
  var currentDate = new Date(dateRange[0]);
  for(var i = 0; i < dateRange.length; i++){
    currentDate = new Date(dateRange[i]);
    //ai.log.logInfo("Current Date: ", currentDate.toISOString());
    var data = retrieveAccountBalance(method, body, headers, currentDate, currentDate);
    //ai.log.logInfo("Retrieved Account Balance: ");
    var processedBalance = processAccountBalance(data);
    //ai.log.logInfo("Processed Account Balance: ");
    addAccountBalanceRows(rowset, processedBalance, currentDate, tenantID);
    //ai.log.logInfo("Saved Account Balance: ");
  }
}

/** 
 * This function is the primary controller for retrieving contacts, primarily to allow us to match payments to certain contacts with transactions.
 * **/
function contactsProcess(rowset, method, body, headers, tenantID){
  var requestMore = true;
  for(var page = 1; requestMore; page++){
    var rawData = retrieveContacts(method, body, headers, page);
    var processedData = processContacts(rawData);
    addContactRows(rowset, processedData, tenantID);
    requestMore = requestPage(rawData.Contacts.length);
  }
}

/** 
 * ACCOUNT FUNCTIONS
 * **/

/** This function should retrieve a list of bank accounts from which I can gather the transactions. 
 * @parameter - method - HTTP Method "Get"
 * @parameter - body is empty -> {}
 * @parameter - headers contains our xero tenant ID for authentication.
 * @returns - array of accounts of type bank. **/
function retrieveBankAccounts(method, body, headers){
  try{
    var response = ai.https.authorizedRequest(accountURL(), method, body, headers);
    var data = JSON.parse(response.getBody());
    return data;
  }
  catch(err){
    ai.log.logError(err);
  }
}

/** This function should process the list of bank accounts we retrieved and turn them into usable data.
 * @parameter - data (the raw from Xero)
 * @returns - accounts, a list of json objects containing account details
 * **/
function processBankAccounts(data){
  var accounts = [];
  for(var i = 0; i < data.Accounts.length; i++ ){
    var account = {};
    account.AccountID = data.Accounts[i].AccountID;
    account.Name = data.Accounts[i].Name;
    account.Status = data.Accounts[i].Status;
    account.BankAccountNumber = data.Accounts[i].BankAccountNumber;
    account.BankAccountType = data.Accounts[i].BankAccountType;
    account.CurrencyCode = data.Accounts[i].CurrencyCode;
    accounts.push(account);
    //ai.log.logInfo("Account Object: ", JSON.stringify(account));
  }
  return accounts;
}

/** 
 * This takes the processed accounts and loads it into the Accounts Table.
 * 
 * @parameter - Rowset, the Adaptive planning provided object for adding rows to tables.
 * @parameter - accounts, our array containing account json objects.
 * @parameter - tenantID, our tenant ID for Xero.
 * **/
function addBankAccountRows(rowset, accounts, tenantID){
  var cols = rowset.getColumns().map(function(value){
    return value.getDisplayName();
  });

  for(var i = 0; i < accounts.length; i++){
    var cells = [];
    cells[cols.indexOf('Tenant Id')] = tenantID;
    cells[cols.indexOf('Account ID')] = accounts[i].AccountID;
    cells[cols.indexOf('Account Name')] = accounts[i].Name;
    cells[cols.indexOf('Account Status')] = accounts[i].Status;
    cells[cols.indexOf('Bank Account Number')] = accounts[i].BankAccountNumber;
    cells[cols.indexOf('Currency Code')] = accounts[i].CurrencyCode;
    rowset.addRow(cells);
  }
}

/** 
 * TRANSACTION FUNCTIONS
 * **/

/** This function should retrieve the transaction which occurred between the two date periods described from the selected bank account. 
 * 
 *  NOTE: Bank Account Transfers count as two transactions, one sending money from an account (e.g. savings) to another account (e.g. spending)
 * 
 * @parameter - AccountID - UUID of the account.
 * @parameter - dateString - the date string formatted for Xero.
 * @returns - Array of Bank Transactions for that account for that day.
 * **/
function retrieveTransactions(method, body, headers, accountID, page, fromDate, toDate){
  try{
    var url = transactionURL(accountID, fromDate, toDate, page);
    var response = ai.https.authorizedRequest(url, method, body, headers);
    var data = JSON.parse(response.getBody());
    return data;
  }
  catch(err){
    ai.log.logError(err);
  }
}

/** This function should process the list of transactions from one bank account into a useable list.
 * @parameter - Array of Bank Transactions in raw form
 * @returns - Cleaner array of Bank Transactions in a more usable form.
 * **/
function processTransactions(data){
  var transactions = [];
  for(var i = 0; i < data.BankTransactions.length; i++){
    let trans = {};
    trans.BankTransactionID = data.BankTransactions[i].BankTransactionID;
    if(data.BankTransactions[i].BankAccount){
      trans.AccountID = data.BankTransactions[i].BankAccount.AccountID;
    }
    if(data.BankTransactions[i].Contact){
      trans.ContactID = data.BankTransactions[i].Contact.ContactID;
    }
    if(data.BankTransactions[i].Type){
      trans.Type = data.BankTransactions[i].Type;
    }
    if(data.BankTransactions[i].DateString){
      trans.Date = data.BankTransactions[i].DateString;
    }
    if(data.BankTransactions[i].Status){
      trans.Status = data.BankTransactions[i].Status;
    }
    if(data.BankTransactions[i].LineAmountTypes){
      trans.TaxInclusive = data.BankTransactions[i].LineAmountTypes;
    }
    if(data.BankTransactions[i].SubTotal){
      trans.SubTotal = data.BankTransactions[i].SubTotal;
    }
    if(data.BankTransactions[i].TotalTax){
      trans.TotalTax = data.BankTransactions[i].TotalTax;
    }
    if(data.BankTransactions[i].Total){
      trans.Total = data.BankTransactions[i].Total;
    }
    if(data.BankTransactions[i].CurrencyCode){
      trans.CurrencyCode = data.BankTransactions[i].CurrencyCode;
    }
    if(data.BankTransactions[i].Reconciled){
    trans.Reconciled = data.BankTransactions[i].Reconciled;
    }
    if(data.BankTransactions[i].Reference){
      trans.Reference = data.BankTransactions[i].Reference;
    }
    transactions.push(trans);
    //ai.log.logInfo("Transaction Object", JSON.stringify(trans));
  }
  return transactions;
}


/** 
 * This function adds the rows for the transaction into the transactions table.
 * @parameter - Rowset - the Table we are pushing stuff into.
 * @parameter - transactions - the Array of Transaction objects we are pushing into the database.
 * @parameter - tenantID - The tenant ID of the Xero account we want to load from.
 * **/
function addTransactionRows(rowset, transactions, tenantID){
  var cols = rowset.getColumns().map(function(value){
    return value.getDisplayName();
  });
  
  for(var i = 0; i < transactions.length; i++){
    var cells = [];
    cells[cols.indexOf('Tenant ID')] = tenantID;
    cells[cols.indexOf('Transaction ID')] = transactions[i].BankTransactionID;
    cells[cols.indexOf('Account ID')] = transactions[i].AccountID ? transactions[i].AccountID : "";
    cells[cols.indexOf('Contact ID')] = transactions[i].ContactID ? transactions[i].ContactID : "";
    cells[cols.indexOf('Date')] = new Date(transactions[i].Date);
    cells[cols.indexOf('Transaction Status')] = transactions[i].Status ? transactions[i].Status : "";
    cells[cols.indexOf('Tax Inclusive')] = transactions[i].TaxInclusive ? transactions[i].TaxInclusive : "";
    cells[cols.indexOf('Sub Total')] = transactions[i].SubTotal ? transactions[i].SubTotal : 0.00;
    cells[cols.indexOf('Total Tax')] = transactions[i].TotalTax ? transactions[i].TotalTax : 0.00;
    cells[cols.indexOf('Total')] = transactions[i].Total ? transactions[i].Total : 0.00;
    cells[cols.indexOf('Currency Code')] = transactions[i].CurrencyCode ? transactions[i].CurrencyCode : "";
    cells[cols.indexOf('Reconciled')] = transactions[i].Reconciled ? transactions[i].Reconciled : true;
    cells[cols.indexOf('Reference')] = transactions[i].Reference ? transactions[i].Reference : "";
    rowset.addRow(cells);
  }
}

/** 
 * 
 * ACCOUNT BALANCE FUNCTIONS
 * 
 * **/

/** 
 * This function should make the request for an account balance on a particular day.
 * @parameter - HTTP method i.e. GET, POST, PUT, DELETE
 * @parameter - body - empty at this stage
 * @parameter - headers - tenant ID is sent via this.
 * **/
function retrieveAccountBalance(method, body, headers, fromDate, toDate){
  try{
    var url = accountBalanceURL(fromDate, toDate);
    var response = ai.https.authorizedRequest(url, method, body, headers);
    var data = JSON.parse(response.getBody());
    //ai.log.logInfo('Account Balance raw: ', JSON.stringify(data));
    return data;
  }
  catch(err){
    ai.log.logError(JSON.stringify(err));
  }
}

/** 
 * This function should process the request for that account on that particular day.
 * @parameter - data - the raw data pulled from Xero.
 * **/
function processAccountBalance(data){
  var balanceList = [];
  var rows = data['Reports'][0]['Rows'];
  for(var i = 0 ; i < rows.length; i++){//iterate over the report itself.
    //ai.log.logInfo("rows: ", JSON.stringify(rows[i]));
    if(rows[i]['RowType'] == 'Header'){//Ignore the header.
      continue;
    }
    else if(rows[i]['RowType'] == "Section"){//Breaking it up
      //ai.log.logInfo("Section: ", rows[i] !== null ? JSON.stringify(rows[i]) : 'Empty');
      var itemRows = rows[i]['Rows'];
        for(var j = 0; j < itemRows.length; j++){//iterate over the rows for different accounts.
          //ai.log.logInfo("item rows: ", JSON.stringify(itemRows[j] !== null ? JSON.stringify(itemRows[j]) : 'Empty'));
          if(itemRows['RowType'] !== null){
            if(itemRows[j]['RowType'] == "Row"){
              var cells = itemRows[j]['Cells'];
              //ai.log.logInfo("Cells: ", JSON.stringify(cells));
                var balance = {};
                balance.accountID = cells[0]['Attributes'][0]['Value'];//Account ID within Xero, not the bank account.
                balance.openingBalance = cells[1]['Value'];
                balance.cashReceived = cells[2]['Value'];
                balance.cashSpent = cells[3]['Value'];
                balance.closingBalance = cells[4]['Value'];
                balanceList.push(balance);
                ai.log.logInfo("balance: ", JSON.stringify(balance));
            }
          }
        }
    }
  }
  return balanceList;
}

/** 
 * This function should add the processed account balances to a table.
 * @parameter - Rowset - the Table we are pushing stuff into.
 * @parameter - balance - the list of balances by day which we are loading.
 * @parameter - tenantID - The tenant ID 
 * **/
function addAccountBalanceRows(rowset, balances, currentDate, tenantID){
  var cols = rowset.getColumns().map(function(value){
    return value.getDisplayName();
  });

  for(var i = 0; i < balances.length; i++){
    var cells = [];
    cells[cols.indexOf('Tenant ID')] = tenantID;
    cells[cols.indexOf('Account ID')] = balances[i].accountID;
    cells[cols.indexOf('Date')] = currentDate;
    cells[cols.indexOf('Opening Balance')] = parseFloat(balances[i].openingBalance);
    cells[cols.indexOf('Cash Received')] = parseFloat(balances[i].cashReceived);
    cells[cols.indexOf('Cash Spent')] = parseFloat(balances[i].cashSpent);
    cells[cols.indexOf('Closing Balance')] = parseFloat(balances[i].closingBalance);
    ai.log.logInfo("Inserted into Account Balance Rows: ", JSON.stringify(cells));
    rowset.addRow(cells);
  }
}

/** 
 * 
 * CONTACTS FUNCTIONS
 * 
 * **/

/** 
 * This function should retrieve the contacts of this firm.
 * **/
function retrieveContacts(method, body, headers, page){
  try{
    var url = contactsURL(page);
    var response = ai.https.authorizedRequest(url, method, body, headers);
    var data = JSON.parse(response.getBody());
    //ai.log.logInfo("Contacts Raw: ", response.getBody());
    return data;
  }
  catch(err){
    ai.log.logError(err);
  }
}

/** 
 * This function should process the contacts, which may be missing alot of information, into appropriate formats
 * **/
function processContacts(data){
  var contacts = [];
  for(var i = 0; i < data.Contacts.length; i++){
    //ai.log.logVerbose("Raw Contact: ", JSON.stringify(data.Contacts[i]));
    var contact = {};
    //ai.log.logInfo("Contact ID");
    if(data.Contacts[i].ContactID){
      contact.ContactID = data.Contacts[i].ContactID;
    }
    //ai.log.logInfo("Account Number");
    if(data.Contacts[i].AccountNumber){
      contact.AccountNumber = data.Contacts[i].AccountNumber;
    }
    //ai.log.logInfo("Contact Status");
    if(data.Contacts[i].ContactStatus){
      contact.ContactStatus = data.Contacts[i].ContactStatus;
    }
    //ai.log.logInfo("Contact Name");
    if(data.Contacts[i].Name){
      contact.ContactName = data.Contacts[i].Name;
    }
    //ai.log.logInfo("First Name");
    if(data.Contacts[i].FirstName){
      contact.FirstName = data.Contacts[i].FirstName;
    }
    //ai.log.logInfo("Last Name");
    if(data.Contacts[i].LastName){
      contact.LastName = data.Contacts[i].LastName;
    }
    //ai.log.logInfo("Email", data.Contacts[i].EmailAddress);
    if(data.Contacts[i].EmailAddress){
      contact.Email = data.Contacts[i].EmailAddress;
    }
    //ai.log.logInfo("Skype Name", data.Contacts[i].SkypeUserName);
    if(data.Contacts[i].SkypeUserName){
      contact.Skype = data.Contacts[i].SkypeUserName;
    }
    //ai.log.logInfo("Bank Account Details", data.Contacts[i].BankAccountDetails);
    if(data.Contacts[i].BankAccountDetails){
      contact.ContactBank = data.Contacts[i].BankAccountDetails;
    }
    //ai.log.logInfo("Tax Number", data.Contacts[i].TaxNumber);
    if(data.Contacts[i].TaxNumber){
      contact.TaxNumber = data.Contacts[i].TaxNumber;
    }
    //ai.log.logInfo("Accounts Receivable", data.Contacts[i].AccountsReceivableTaxType);
    if(data.Contacts[i].AccountsReceivableTaxType){
      contact.AccountsReceivable = data.Contacts[i].AccountsReceivableTaxType;
    }
    //ai.log.logInfo("Accounts Payable", data.Contacts[i].AccountsPayableTaxType);
    if(data.Contacts[i].AccountsPayableTaxType){
      contact.AccountsPayable = data.Contacts[i].AccountsPayableTaxType;
    }
    //ai.log.logInfo("Supplier", data.Contacts[i].IsSupplier);
    if(data.Contacts[i].IsSupplier){
      contact.Supplier = data.Contacts[i].IsSupplier;
    }
    //ai.log.logInfo("Customer", data.Contacts[i].IsCustomer);
    if(data.Contacts[i].IsCustomer){
      contact.Customer = data.Contacts[i].IsCustomer;
    }
    contacts.push(contact);
    //ai.log.logInfo("Contact Processed: ", JSON.stringify(contact));
  }
  return contacts;
}

/** 
 * This function should add the contacts to the database appropriately.
 * **/
function addContactRows(rowset, contacts, tenantID){
  var cols = rowset.getColumns().map(function(value){
    return value.getDisplayName();
  });

  for(var i = 0; i < contacts.length; i++){
    var cells = [];
    //ai.log.logInfo("Tenant ID: ", tenantID);
    cells[cols.indexOf('Tenant ID')] = tenantID;
    //ai.log.logInfo("Contact ID: ", contacts[i].ContactID ? contacts[i].ContactID : "");
    cells[cols.indexOf('Contact ID')] = contacts[i].ContactID ? contacts[i].ContactID : "";
    //ai.log.logInfo("Account Number: ", contacts[i].AccountNumber ? contacts[i].AccountNumber : "");
    cells[cols.indexOf('Account Number')] = contacts[i].AccountNumber ? contacts[i].AccountNumber : "";
    //ai.log.logInfo("Contact Status: ", contacts[i].ContactStatus ? contacts[i].ContactStatus : "");
    cells[cols.indexOf('Contact Status')] = contacts[i].ContactStatus ? contacts[i].ContactStatus : "";
    //ai.log.logInfo("Contact Name: ", contacts[i].ContactName ? contacts[i].ContactName : "");
    cells[cols.indexOf('Contact Name')] = contacts[i].ContactName ? contacts[i].ContactName : "";
    //ai.log.logInfo("First Name: ", contacts[i].FirstName ? contacts[i].FirstName : "");
    cells[cols.indexOf('First Name')] = contacts[i].FirstName ? contacts[i].FirstName : "";
    //ai.log.logInfo("Last Name: ", contacts[i].LastName ? contacts[i].LastName : "");
    cells[cols.indexOf('Last Name')] = contacts[i].LastName ? contacts[i].LastName : "";
    //ai.log.logInfo("Email: ", contacts[i].Email ? contacts[i].Email : "");
    cells[cols.indexOf('Email')] = contacts[i].Email ? contacts[i].Email : "";
    //ai.log.logInfo("Skype: ", contacts[i].Skype ? contacts[i].Skype : "");
    cells[cols.indexOf('Skype Name')] = contacts[i].Skype ? contacts[i].Skype : "";
    //ai.log.logInfo("Contact Bank Account", contacts[i].ContactBank ? contacts[i].ContactBank : "");
    cells[cols.indexOf('Contact Bank Account')] = contacts[i].ContactBank ? contacts[i].ContactBank : "";
    //ai.log.logInfo("Tax Number", contacts[i].TaxNumber ? contacts[i].TaxNumber : "");
    cells[cols.indexOf('Tax Number')] = contacts[i].TaxNumber ? contacts[i].TaxNumber : "";
    //ai.log.logInfo("Accounts Receivable Tax Type", contacts[i].AccountsReceivable ? contacts[i].AccountsReceivable : "");
    cells[cols.indexOf('Accounts Receivable Tax Type')] = contacts[i].AccountsReceivable ? contacts[i].AccountsReceivable : "";
    ai.log.logInfo("Accounts Payable Tax Type", contacts[i].AccountsPayable ? contacts[i].AccountsPayable : "");
    cells[cols.indexOf('Accounts Payable Tax Type')] = contacts[i].AccountsPayable ? contacts[i].AccountsPayable : "";
    ai.log.logInfo("Supplier", contacts[i].Supplier ? contacts[i].Supplier : false);
    cells[cols.indexOf('Supplier')] = contacts[i].Supplier ? contacts[i].Supplier : false;
    ai.log.logInfo("Customer", contacts[i].Customer ? contacts[i].Customer : false);
    cells[cols.indexOf('Customer')] = contacts[i].Customer ? contacts[i].Customer : false;
    ai.log.logInfo("Inserted into Contact Rows: ", cells);
    rowset.addRow(cells);
  }
}

/** 
 * 
 * URL builder functions - These construct the URL requests we are sending.
 * 
 * **/

/** 
 * This function is used to generate the account retrieval URL provided by the Xero API. 
 * **/
function accountURL(){
   var url = 'https://api.xero.com/api.xro/2.0/Accounts?where=TYPE%3D%22BANK%22';
   return url;
}

/**
 * This function will return the xero API baseline for bank transactions.
 *  **/
function transactionURL(accountsId, fromDate, toDate, pageNumber){
  var url = 'https://api.xero.com/api.xro/2.0/BankTransactions?where=';
  url += transactionAccountQueryFiltering(accountsId) + "&&" + fromDateFiltering(fromDate) + "&&" + toDateFiltering(toDate)+ "&&" +paginationFiltering(pageNumber);
  //ai.log.logInfo("Transaction URL: ", url);
  return url;
}

/** 
 * This function will generate the URL we want to use to get bank balances.
 * @parameter - fromDate -
 * @parameter - toDate - 
 * **/
function accountBalanceURL(fromDate, toDate){
  var url = 'https://api.xero.com/api.xro/2.0/Reports/BankSummary?';
  url += fromDateQuery(fromDate) + "&" + toDateQuery(toDate);
  //ai.log.logInfo("Account Balance URL: ", url);
  return url;
}

/** 
 * This function retrieves the contacts for a xero account
 * @parameter - the page number we are iterating.
 * **/
function contactsURL(pageNumber){
  var url = 'https://api.xero.com/api.xro/2.0/Contacts?';
  url += paginationFiltering(pageNumber);
  return url;
}

/** 
 * This function takes our Account ID and returns an appropriate account query string.
 * @parameter - Xero Account ID
 * @Returns accountID string
 * **/
 function transactionAccountQueryFiltering(accountID){
  return "BankAccount.AccountID=GUID(\""+accountID+"\")";
}

/** 
 * This function provides the from date query string. Used in the Transactions loading.
 * **/
function fromDateFiltering(fromDate){
  var toDateYear = fromDate.getFullYear();
  var toDateMonth = fromDate.getMonth();
  var toDateDay = fromDate.getDate();
  var fromDateString = "Date >= DateTime("+ toDateYear + "," + toDateMonth + "," + toDateDay +")";
  return fromDateString;
}

/** 
 * This function provides the to date query string. Used in the Transactions loading.
 * **/
function toDateFiltering(toDate){
  var toDateYear = toDate.getFullYear();
  var toDateMonth = toDate.getMonth();
  var toDateDay = toDate.getDate();
  var toDateString = "Date < DateTime(" + toDateYear + "," + toDateMonth+ "," + toDateDay+ ")";
  return toDateString;
}

/** 
 * This function providesthe from date for the account balance loading.
 * **/
function fromDateQuery(fromDate){
  var fromYear = fromDate.getFullYear();
  var fromMonth = fromDate.getMonth()+1;
  var fromDay = fromDate.getDate();
  var fromString = "fromDate=" + fromYear + "-" + fromMonth + "-" + fromDay;
  return fromString; 
}

/** 
 * This function provides the to date for the account balance loading.
 * **/
function toDateQuery(toDate){
  toYear = toDate.getFullYear();
  toMonth = toDate.getMonth()+1;
  toDay = toDate.getDate();
  toDateString = "toDate=" + toYear + "-" + toMonth + "-" + toDay;
  return toDateString;
}

/** 
 * This is used for our paginaton. So we want to paginate for days with more than 100 requests per day.
 * **/
 function paginationFiltering(pageNumber){
  var paginationString = "page="+pageNumber;
  return paginationString;
}

/** 
 * This function ensures we keep requesting the pages for this account if the previous dataset contains at least 100 records.
 * @parameter - Raw response from Xero.
 * @returns - boolean of whether to request more.
 * **/
 function requestPage(arraySize){
  ai.log.logInfo("Page Size: " + arraySize);
  if(arraySize > 99){
    return true;
  }
  else{
    return false;
  }
}

/**
 * 
 *  UTIL FUNCTIONS 
 * 
 * **/

/** 
 * This function returns an appropriate start date object from the context provided by Adaptive Planning.
 * @parameter - context - A variable provided by Adaptive Planning (originally called Adaptive Insights).
 * @returns  - date object.
 * **/
 function periodStartDate(context){
  var dataSource = context.getDataSource();
  var dateRange = dataSource.getSetting('date-range').getValue();
  var fromDateString = dateRange.getFromPeriodStartDateTime().replace(/T.*/, '');
  var fromDate = new Date(fromDateString);
  return fromDate;
}

/** 
 * This function returns an appropriate end date object from the context provided by Adaptive Planning.
 * @parameter - context - A variable provided by Adaptive Planning (originally called Adaptive Insights).
 * @returns  - date object. Should be the final day of the previous month.
 * **/
function periodEndDate(context){
  var dataSource = context.getDataSource();
  var dateRange = dataSource.getSetting('date-range').getValue();
  var toDateString = dateRange.getFromPeriodEndDateTime().replace(/T.*/, '');
  var toDate = new Date(toDateString);
  var endOfMonthDate = new Date(toDate.getTime() - (1000*60*60*24));
  return endOfMonthDate;
}

/** 
 * This function generates the Date Range Array, containing a date string for every date between fromDate
 * and toDate, inclusive of the dates themselves.
 * **/
function generateDateRange(fromDate, toDate){
  var currentDate = fromDate;
  var dateArray = [];
  dateArray.push(fromDate.toISOString());
  while(currentDate < toDate){
    var dateObj = new Date(currentDate.getTime()+(1000*60*60*24));
    currentDate.setTime(currentDate.getTime()+(1000*60*60*24));
    dateArray.push(dateObj.toISOString());
  }
  return dateArray;
}

/** This creates the column. **/
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
      column.setFloatColumnType();
      break;
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

/** Used to retrieve the list of tenant IDs we want to use. **/
function tenantIds(context) {
  return context.getDataSource().getSettings().filter(function(setting){
    return setting.getDisplayName().match(/tenant-id-\d+/);
    }).map(function(value){
    return value.getValue();
  });
}
