# sturdy-authenticator

This is pure backend REST API project with full authentication system.  

You can access the live APIs [here](https://sturdy-authenticator.herokuapp.com).  

The live version of the app uses _heroku_ for hosting the `express` app and _mlab_ for `mongoDB` database.  

#### The below are the full HTTP requests and their corresponding screengrabs on Postman.
***
**Signup**  
```
POST /api/authentication/signup HTTP/1.1
Host: sturdy-authenticator.herokuapp.com
Content-Type: application/json
cache-control: no-cache
Postman-Token: 1258c73a-2136-4f4a-aeae-8d28e093443d
{
	"name":"test",
	"email":"test@test.com",
	"password":"testtest"
}------WebKitFormBoundary7MA4YWxkTrZu0gW--
```
![signup image](https://raw.githubusercontent.com/s-xync/sturdy-authenticator/master/showcase_images/1_signup_hrg.png)  
***
**Signin**  
```
POST /api/authentication/signin HTTP/1.1
Host: sturdy-authenticator.herokuapp.com
Content-Type: application/json
cache-control: no-cache
Postman-Token: c2546349-0e6e-4bf0-b5c8-9630089963b2
{
    "email": "test@test.com",
    "password": "testtest"
}------WebKitFormBoundary7MA4YWxkTrZu0gW--
```
![signin image](https://raw.githubusercontent.com/s-xync/sturdy-authenticator/master/showcase_images/2_signin_hrg.png)  
***
**Get Session**  
```
GET /api/authentication/session HTTP/1.1
Host: sturdy-authenticator.herokuapp.com
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTU1MDI3MDExMCwiZXhwIjoxNTUwMzU2NTEwfQ.ukc6K6t9L5bXBxFj1AfDEHkBpimq-2rjF_nfWnTAHy8
cache-control: no-cache
Postman-Token: 5721bca2-c741-46d4-b1d8-f2c4b3429353
```
![session image](https://raw.githubusercontent.com/s-xync/sturdy-authenticator/master/showcase_images/3_session_hrg.png)  
***
**Logout**  
```
POST /api/authentication/logout? HTTP/1.1
Host: sturdy-authenticator.herokuapp.com
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTU1MDI3MDExMCwiZXhwIjoxNTUwMzU2NTEwfQ.ukc6K6t9L5bXBxFj1AfDEHkBpimq-2rjF_nfWnTAHy8
cache-control: no-cache
Postman-Token: 7c814fe7-7d07-4c2c-aea3-e2b0fbcb8a7f

```
![signup image](https://raw.githubusercontent.com/s-xync/sturdy-authenticator/master/showcase_images/4_logout_hrg.png)  
***
**Forgot Password**  
```
POST /api/authentication/forgotpassword HTTP/1.1
Host: sturdy-authenticator.herokuapp.com
Content-Type: application/json
cache-control: no-cache
Postman-Token: fe0391f7-5d32-4b46-a6cc-e273faf036b5
{
	"email":"test@test.com"
}------WebKitFormBoundary7MA4YWxkTrZu0gW--
```
![signup image](https://raw.githubusercontent.com/s-xync/sturdy-authenticator/master/showcase_images/5_forgotpassword_hrg.png)  
***
**Reset Password**  
```
POST /api/authentication/resetpassword HTTP/1.1
Host: sturdy-authenticator.herokuapp.com
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE1NTAyNzAzMjgsImV4cCI6MTU1MDI3MzkyOH0.7R9UWnvnDYCbbdyORAB2CXC4siS8acBLZtAcKJ-t9qA
Content-Type: application/json
cache-control: no-cache
Postman-Token: b4cc4f1a-91d8-4560-be45-6bcfd3dacdc8
{
    "password": "testtesttest"
}------WebKitFormBoundary7MA4YWxkTrZu0gW--
```
![signup image](https://raw.githubusercontent.com/s-xync/sturdy-authenticator/master/showcase_images/6_resetpassword_hrg.png)  
***

You can access the live APIs [here](https://sturdy-authenticator.herokuapp.com). 

## Thanks!
