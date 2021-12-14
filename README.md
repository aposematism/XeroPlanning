# XeroPlanning
A script for loading Xero data into Adaptive Planning. Enables loading Accounts, Bank Transactions, Account Balances and Contacts


XeroCoreInfoImport.js - This script is designed to load information from Xero for various purposes. 
It was originally designed to retrieve Accounts, Bank Transactions, Account Balances and Contacts in order to calculate account balances daily for financial management.

Xero_BL&PL_import.js - This script is designed to retrieve the Profit/Loss and Balance Sheet reports from Xero and to load them into tables in Adaptive Planning.

HOW TO USE THESE SCRIPTS
--------------------------
These scripts are used in the integrations section of adaptive planning. 
1. Login to Adaptive Planning
2. Go to Design Integration
3. Click Data Source, Create New Data Source -> Custom Cloud Data Source (CCDS)
4. Go to the new CCDS, click Scripts then add new script.
5. Either upload the script or copy the contents across.
6. Click Designer Settings, add new static string of text, then set the value of that string to your Xero tenant ID.
7. Save these changes
8. Import the data into your system.
You create a new CCDS, chuck this in the script and use the tenant-id from xero as a set of parameters in xero.
Parameters must be named "tenant-id-1", "tenant-id-2" etc for each tenant ID you are retrieving data from.
