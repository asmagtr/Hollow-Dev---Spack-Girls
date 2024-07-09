# Hollow-Dev---Spack-Girls
API Documentation

## Authentication Routes (authRoutes.js)
## Create Account

## Endpoint: /auth/create-account
Method: POST
Request Body:json
        {
        "fullName": "string",
        "username": "string",
        "email": "string",
        "password": "string",
        "role": "string" // Optional, default is "user",
        }

Responses:
        200 OK: Registration successful
        400 Bad Request: Missing required fields or user already exists
        500 Internal Server Error: Server error

## Login
## Endpoint: /auth/login
Method: POST
Request Body:json
    {
    "emailOrUsername": "string",
    "password": "string"
    }


Responses:
    200 OK: Login successful, returns access token
    400 Bad Request: Missing required fields or invalid credentials
    500 Internal Server Error: Server error



## Candidate Routes (candidateRoutes.js)
## Add Candidate by ID

Endpoint: /candidate/add-candidate
Method: POST
Request Body:json
    {
    "candidateId": "string"
    }


Responses:
    200 OK: Candidate added successfully
    403 Forbidden: Only admin can add candidates
    400 Bad Request: Missing candidate ID or user already a candidate
    404 Not Found: User not found
    500 Internal Server Error: Server error


## Add Candidate by Username
## Endpoint: /candidate/add-candidate-by-username
Method: POST
Request Body:json
        {
        "candidateUsername": "string"
        }


Responses:
        200 OK: Candidate added successfully
        403 Forbidden: Only admin can add candidates
        400 Bad Request: Missing candidate username or user already a candidate
        404 Not Found: User not found
        500 Internal Server Error: Server error


## Candidate Info by ID
# Endpoint: /candidate/get-candidate-info-by-id/:id
Method: GET
Responses:
    200 OK: Returns candidate info
    403 Forbidden: Only admin can view candidate info
    400 Bad Request: Missing candidate ID
    404 Not Found: Candidate not found
    500 Internal Server Error: Server error



# Get Candidate Info by Username
## Endpoint: /candidate/get-candidate-info-by-username/:username
Method: GET
Responses:
    200 OK: Returns candidate info
    403 Forbidden: Only admin can view candidate info
    400 Bad Request: Missing candidate username
    404 Not Found: Candidate not found
    500 Internal Server Error: Server error


## Get Winner
## Endpoint: /candidate/get-winner
Method: GET
Responses:
    200 OK: Returns candidate info of the winner
    403 Forbidden: Only admin can view the winner
    500 Internal Server Error: Server error



# User Routes (userRoutes.js)


## Get Authenticated User Info
## Endpoint: /user/me
Method: GET
Responses:
    200 OK: Returns user info
    401 Unauthorized: User not authenticated

## Get User Info by ID
## Endpoint: /user/get-user/:id
Method: GET
Responses:
    200 OK: Returns user info
    404 Not Found: User not found
    401 Unauthorized: User not authenticated



## Vote Routes (voteRoutes.js)
## Add Vote by ID

## Endpoint: /vote/add-vote
Method: POST
Request Body:
json
Copy code
{
  "candidateId": "string"
}
Responses:
200 OK: Vote added successfully
403 Forbidden: User has already voted
400 Bad Request: Missing candidate ID
404 Not Found: Candidate not found
500 Internal Server Error: Server error
Add Vote by Username


## Endpoint: /vote/add-vote-by-username
Method: POST
Request Body:
json
Copy code
{
  "candidateUsername": "string"
}
Responses:
200 OK: Vote added successfully
403 Forbidden: User has already voted
400 Bad Request: Missing candidate username
404 Not Found: Candidate not found
500 Internal Server Error: Server error