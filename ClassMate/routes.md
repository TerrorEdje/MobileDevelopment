#ClassMate REST
In this list all the routes to the REST service are given.
A GET request shows the format of the JSON that is returned.
A POST request shows the format of the request that is send to the server
##Courses
###GET /courses/
```
[
    {
        "_id": "5510725f81b891200d7cbe5a",
        "userFullName": "Edwin Hattink",
        "userId": "egjhatti@avans.nl",
        "name": "Mobile Development 1",
        "courseId": "AII-1415C-INMBD1",
        "description": "Hybrid smartphone apps bouwen",
        "__v": 0
    },
    {
        "_id": "5510725f81b891200d7cbe5b",
        "userFullName": "Edwin Hattink",
        "userId": "egjhatti@avans.nl",
        "name": "Cloud Services",
        "courseId": "AII-1415C-INWEBS5",
        "description": "Cloud services bouwen",
        "__v": 0
    },
    {
        "_id": "5510725f81b891200d7cbe5c",
        "userFullName": "Edwin Hattink",
        "userId": "egjhatti@avans.nl",
        "name": "Mobile Development 2",
        "courseId": "AII-1415C-INMBD2",
        "description": "Native smartphone apps bouwen",
        "__v": 0
    }
]
```
###POST /courses/
```
userFullName=Edwin+Hattink&userId=egjhatti%40avans.nl&name=Intercultural+Communications&courseId=AII-1415C-ININCC&description=This+course+will+help+students+develop+cross-cultural+understanding+in+professional+situations%2C+especially+for+the+IT+business.+It+will+also+provide+students+with+basic+tools+to+make+these+situations+a+success.+Students+will+be+able+to+reflect+on+their+own+personal+performance.
```
###GET /courses/:id/
```
{
    "_id": "5510725f81b891200d7cbe5a",
    "userFullName": "Edwin Hattink",
    "userId": "egjhatti@avans.nl",
    "name": "Mobile Development 1",
    "courseId": "AII-1415C-INMBD1",
    "description": "Hybrid smartphone apps bouwen",
    "__v": 0
}
```
###DELETE /courses/:id/

###GET /courses/:id/classes/
```
[
    {
        "_id": "5510726a770dc9dc1a5fa3a7",
        "week": "1",
        "location": "OB204",
        "courseId": "5510725f81b891200d7cbe5a",
        "__v": 0
    },
    {
        "_id": "5510726a770dc9dc1a5fa3a8",
        "week": "2",
        "location": "OB204",
        "courseId": "5510725f81b891200d7cbe5a",
        "__v": 0
    },
    {
        "_id": "5510726a770dc9dc1a5fa3a9",
        "week": "3",
        "location": "OB204",
        "courseId": "5510725f81b891200d7cbe5a",
        "__v": 0
    }
]
```

##Classes
###GET /classes/
```[
    {
        "_id": "5510726a770dc9dc1a5fa3a7",
        "week": "1",
        "location": "OB204",
        "courseId": "5510725f81b891200d7cbe5a",
        "__v": 0
    },
    {
        "_id": "5510726a770dc9dc1a5fa3a8",
        "week": "2",
        "location": "OB204",
        "courseId": "5510725f81b891200d7cbe5a",
        "__v": 0
    },
    {
        "_id": "5510726a770dc9dc1a5fa3a9",
        "week": "3",
        "location": "OB204",
        "courseId": "5510725f81b891200d7cbe5a",
        "__v": 0
    }
]
```
###POST /classes/
```
week=4&location=OB209&courseId=5510725f81b891200d7cbe5a
```
###GET /classes/:id/
```
{
    "_id": "5510726a770dc9dc1a5fa3a7",
    "week": "1",
    "location": "OB204",
    "courseId": "5510725f81b891200d7cbe5a",
    "__v": 0
}
```
###DELETE /classes/:id/

###GET /classes/:id/messages/
```
[
    {
        "_id": "551072feaa93ae9c1c352d7a",
        "userId": "egjhatti@avans.nl",
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Edwin Hattink",
        "message": "Who is coming to Mobile Development today?",
        "__v": 0,
        "time": "2015-03-23T20:09:34.456Z"
    },
    {
        "_id": "551072feaa93ae9c1c352d7b",
        "userId": "yahegge@avans.nl",
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Yannik Hegge",
        "message": "Damnit it, I had too much beer last night so I overslept",
        "__v": 0,
        "time": "2015-03-23T20:09:34.460Z"
    },
    {
        "_id": "551072feaa93ae9c1c352d7c",
        "userId": "ymvanklinken@avans.nl",
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Yorick van Klinken",
        "message": "Meh, I do not care about this class so I am not coming",
        "__v": 0,
        "time": "2015-03-23T20:09:34.460Z"
    }
]
```
###GET /classes/:id/attendances/
```
[
    {
        "_id": "551072feaa93ae9c1c352d7d",
        "userId": "egjhatti@avans.nl",
        "status": 1,
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Edwin Hattink",
        "reason": "",
        "__v": 0,
        "time": "2015-03-23T20:09:34.470Z"
    },
    {
        "_id": "551072feaa93ae9c1c352d7e",
        "userId": "yahegge@avans.nl",
        "status": 2,
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Yannik Hegge",
        "reason": "Overslept",
        "__v": 0,
        "time": "2015-03-23T20:09:34.471Z"
    },
    {
        "_id": "551072feaa93ae9c1c352d7f",
        "userId": "ymvanklinken@avans.nl",
        "status": 3,
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Yorick van Klinken",
        "reason": "Too lazy",
        "__v": 0,
        "time": "2015-03-23T20:09:34.472Z"
    }
]
```

##Messages
###GET /messages/
```
[
    {
        "_id": "551072feaa93ae9c1c352d7a",
        "userId": "egjhatti@avans.nl",
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Edwin Hattink",
        "message": "Who is coming to Mobile Development today?",
        "__v": 0,
        "time": "2015-03-23T20:09:34.456Z"
    },
    {
        "_id": "551072feaa93ae9c1c352d7b",
        "userId": "yahegge@avans.nl",
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Yannik Hegge",
        "message": "Damnit it, I had too much beer last night so I overslept",
        "__v": 0,
        "time": "2015-03-23T20:09:34.460Z"
    },
    {
        "_id": "551072feaa93ae9c1c352d7c",
        "userId": "ymvanklinken@avans.nl",
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Yorick van Klinken",
        "message": "Meh, I do not care about this class so I am not coming",
        "__v": 0,
        "time": "2015-03-23T20:09:34.460Z"
    }
]
```
###POST /messages/
```
message=I love this class.&userFullName=Edwin Hattink&userId=egjhatti@avans.nl&classId=550db8b6b5a237cc1625db0e
```
###GET /messages/:id/
```
{
    "_id": "551072feaa93ae9c1c352d7a",
    "userId": "egjhatti@avans.nl",
    "classId": "5510726a770dc9dc1a5fa3a7",
    "userFullName": "Edwin Hattink",
    "message": "Who is coming to Mobile Development today?",
    "__v": 0,
    "time": "2015-03-23T20:09:34.456Z"
}
```
###DELETE /messages/:id/

##Attendances
###GET /attendances/
```
[
    {
        "_id": "551072feaa93ae9c1c352d7d",
        "userId": "egjhatti@avans.nl",
        "status": 1,
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Edwin Hattink",
        "reason": "",
        "__v": 0,
        "time": "2015-03-23T20:09:34.470Z"
    },
    {
        "_id": "551072feaa93ae9c1c352d7e",
        "userId": "yahegge@avans.nl",
        "status": 2,
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Yannik Hegge",
        "reason": "Overslept",
        "__v": 0,
        "time": "2015-03-23T20:09:34.471Z"
    },
    {
        "_id": "551072feaa93ae9c1c352d7f",
        "userId": "ymvanklinken@avans.nl",
        "status": 3,
        "classId": "5510726a770dc9dc1a5fa3a7",
        "userFullName": "Yorick van Klinken",
        "reason": "Too lazy",
        "__v": 0,
        "time": "2015-03-23T20:09:34.472Z"
    }
]
```
###POST /attendances/
```
status=2&userFullName=Edwin+Hattink&userId=egjhatti%40avans.nl&classId=550db8b6b5a237cc1625db0e&reason=I+missed+the+train
```
###GET /attendances/:id/
```
{
    "_id": "551072feaa93ae9c1c352d7d",
    "userId": "egjhatti@avans.nl",
    "status": 1,
    "classId": "5510726a770dc9dc1a5fa3a7",
    "userFullName": "Edwin Hattink",
    "reason": "",
    "__v": 0,
    "time": "2015-03-23T20:09:34.470Z"
}
```
###DELETE /attendances/:id/