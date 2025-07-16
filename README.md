# table-availability-system-frontend
Table Availability System created for TM470 - The computing and IT project

## Getting started

### Prerequisites

- Node.js

### Setup

1. Install Node.js - Go to https://nodejs.org and download the LTS version.
   1.1 Validate with `node -v` and `npm -v` in the command line.
2. next step

### Running the project

In command line, navigate to the project directory:
```bash
cd <path>\table-availability-system-frontend\
```
Where `<path>` is the path to the project directory.

Run as a web server with Python: 
```
python -m http.server 3000
```

You can access the page in your browser at `http://localhost:3000`.

#### HTML Set-up

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic Frontend Page</title>
    <style>
        body {
            font-family: sans-serif;
            text-align: center;
        }
        h1 {
            color: blue;
        }
    </style>
</head>
<body>
    <h1>Table availability system</h1>
    <p>booking system.</p>
</body>
</html>

