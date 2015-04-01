#ClassMate REST
In this list all the routes to the REST service are given.
##GET /api/courses/
Response STATUS 200
```
{
    "courses": [
        {
            "_id": "5517de32f8d8d9740cf89f78",
            "creator": "5517de32f8d8d9740cf89f75",
            "name": "Mobile Development 1",
            "description": "Building hybrid apps"
        }
    ]
}
```
##GET /api/courses/:id/
Response STATUS 200
```
{
    "_id": "5517de32f8d8d9740cf89f78",
    "creator": "5517de32f8d8d9740cf89f75",
    "name": "Mobile Development 1",
    "description": "Building hybrid apps"
}
```
##GET /api/courses/:id/classes/
Response STATUS 200
```
{
    "classes": [
        {
            "date": "2015-03-29T11:12:50.571Z",
            "location": "OB209",
            "description": "Presentatie",
            "_id": "5517de32f8d8d9740cf89f79",
            "attendances": null,
            "messages": null
        }
    ]
}
```
##GET /api/courses/:id/participants/
Response STATUS 200
```
{
    "participants": [
        {
            "user": "5517de32f8d8d9740cf89f75",
            "_id": "5517de32f8d8d9740cf89f7c"
        }
    ]
}
```
##GET /api/courses/:id/classes/:id/messages/
Response STATUS 200
```
{
    "messages": [
        {
            "user": "5517de32f8d8d9740cf89f75",
            "message": "Usually nobody comes, so who is coming today?",
            "_id": "5517de32f8d8d9740cf89f7b",
            "time": "2015-03-29T11:12:50.571Z"
        }
    ]
}
```
##GET /courses/:id/classes/:id/attendances/
Response STATUS 200
```
{
    "attendances": [
        {
            "user": "5517de32f8d8d9740cf89f75",
            "_id": "5517de32f8d8d9740cf89f7a",
            "time": "2015-03-29T11:12:50.571Z",
            "attendance": 0
        }
    ]
}
```
##POST /api/courses/:id/classes/:id/messages/
Request
```
user=5517de32f8d8d9740cf89f75&message=Hi
```
Response STATUS 201
```
{
    "message": "Message added"
}
```
##POST /api/courses/:id/classes/:id/attendances/
Request
```
user=5517de32f8d8d9740cf89f75&attendance=1&reason=I+hate+this+class
```
Response STATUS 201
```
{
    "message": "Attendance added"
}
```
##PUT /api/courses/:id/
```
BUGGED
```
##POST /api/courses/
Request
```
creator=5517de32f8d8d9740cf89f75&name=Mobile+Development+1&description=Hybrid
```
Response STATUS 201
```
{
    "message": "Course Added"
}
```
##DELETE /api/courses/:id/
Response STATUS 200
```
{
    "message": "Course deleted"
}
```
