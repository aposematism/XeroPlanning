# XeroPlanning
A script for loading Xero data into Adaptive Planning. Enables loading Accounts, Bank Transactions, Account Balances and Contacts


Rockit Balance Sheet Daily - This script is designed to load information from Xero for various purposes. 
It was originally designed to retrieve Accounts, Bank Transactions, Account Balances and Contacts in order to calculate account balances daily for financial management.

Rockit_Xero_javascript_original.js - This script is designed to retrieve the Profit/Loss and Balance Sheet reports from Xero and to load them into tables in Adaptive Planning.

HOW TO USE THESE SCRIPTS
--------------------------
These scripts are used in the integrations section of adaptive planning. 
You create a new CCDS, chuck this in the script and use the tenant-id from xero as a set of parameters in xero.
Parameters must be named "tenant-id-1", "tenant-id-2" etc for each tenant ID you are retrieving data from.
