# Hollow-Dev---Spack-Girls

API Endpoints Documentation



File Endpoints
## Upload File

## URL: /upload
Method: POST
Description: Upload a file to the server and a copy to cloud storage.
Middleware: validateFields (Validates required fields)
Request Body: FormData with title, description, and file
Response:
    {
    "error": false,
    "message": "file uploaded successfully",
    "result": { /* File object */ }
    }


## Get All Files
## URL: /get-all
Method: GET
Description: Retrieve information about all files stored on the server.
Response:
    {
    "error": false,
    "files": [ /* Array of File objects */ ]
    }


## Get File Information by ID
## URL: /get-file-info/:id
Method: GET
Description: Retrieve file information by its ID.
Response:
    {
        "error": false,
        "fileInfo": {
            "title": "string",
            "description": "string",
            "lastModifiedDate": "date",
            "name": "string",
            "size": "number",
            "type": "string"
        }
    }



## Update File Information

## URL: /update-file/:id
Method: PUT
Description: Update file information (title, description) by its ID.
Request Body:
    {
    "title": "string",
    "description": "string"
    }
Response:
    {
    "error": false,
    "message": "updated successfully",
    "file": { /* Updated File object */ }
    }


## Retrieve File by ID
## URL: /get-file/:id
Method: GET
Description: Retrieve the file in the server  by its ID.
Response:
    {
    "error": false,
    "message": "file found",
    "filePath": "string",
    "response": { /* File object */ }
    }



## Delete File by ID
## URL: /delete-file/:id
Method: DELETE
Description: Delete a file by its ID.
Response:
    {
    "error": false,
    "message": "file deleted successfully"
    }

