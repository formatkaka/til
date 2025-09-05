---
title: "Create User"
date: "2024-01-22"
tags: ["database"]
category: "db"
---

### Create user

`CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'Password'`

<b>What is localhost ?</b>  

    when a user with that host logs into MySQL it will attempt to connect to the local server by using a Unix socket file. Thus, localhost is typically used when you plan to connect by SSHing into your server or when you’re running the local mysql client to connect to the local MySQL server.

----

<br />

### Grant Privileges 

`GRANT ALL PRIVILEGES ON * . * TO 'newuser'@'localhost';`

&nbsp;&nbsp;&nbsp;&nbsp;Template  
&nbsp;&nbsp;&nbsp;&nbsp;`GRANT type_of_permission ON database_name.table_name TO 'username'@'localhost';
`

    ALL PRIVILEGES- a MySQL user full access to a designated database (or if no database is selected, global access across the system)
    CREATE- allows them to create new tables or databases
    DROP- allows them to them to delete tables or databases
    DELETE- allows them to delete rows from tables
    INSERT- allows them to insert rows into tables
    SELECT- allows them to use the SELECT command to read through databases
    UPDATE- allow them to update table rows
    GRANT OPTION- allows them to grant or remove other users’ privileges


----

### Apply changes

`FLUSH PRIVILEGES;`



<br />
<br />
<br />

Reference article - [How To Create a New User and Grant Permissions in MySQL](https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql)