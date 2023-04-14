### This is an app, which is syncs with store at the Open-Desk CRM.

It writes new orders during given interval to the system logs. For convenience this interval can be changed at env.
Also the app checks new orders for duplicates with orders from the last report before writing to system logs.

## Used technology: Node.js.
___
### How to start:

1. Clone repo to your computer.

2. Create new file called '.env' in the root folder.

3. Add environment variables to this file as shown in the .env.example file.

4. Run the app by command 'npm run:dev'.

5. View new orders at the file '\src\systemLogs\orders.log'.
