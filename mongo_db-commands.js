
db.createUser({
    user: "operator",
    pwd: "Fr@guaOp0419",
    roles: [
        {
            role: "operationPrivileges",
            db: "services"
        },
        "operationPrivileges"
    ],
});


db.getUser( "admin", {
   showCredentials: true
} )

use '<dbName>'
db.createRole({
   role: "operationPrivileges",
   privileges: [
     { resource: { db : "services",
                   collection : "" },
       actions: [ 'find','update','insert' ]
     }
   ],
   roles: [ { role : 'read', db : 'services'} ]
})

db.updateUser(
    "services",
    {
    roles: [
        {
             role: "userAdminAnyDatabase", db: "admin"
        },
        {
            role: "root", db: "admin"
       }
        
    ],
});

//Role for musicapp
db.createRole({
    role: "musicappPrivileges",
    privileges: [
      { resource: { db : "musicapp",
                    collection : "" },
        actions: [ 'find','update','insert' ]
      }
    ],
    roles: [ { role : 'read', db : 'musicapp'} ]
 })

 //User For Musicapp

 db.createUser({
    user: "muser",
    pwd: "Roleando2019",
    roles: [
        {
            role: "musicappPrivileges",
            db: "musicapp"
        },
        "musicappPrivileges"
    ],
});