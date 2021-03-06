# Overlook Resort - Hotel Management Application

## Solo project by Kim McCaskill during Module 2 at Turing School of Software and Design

### Learning Goals:

- Use OOP to drive the design of the application and the code
- Work with an API to send and receive data
- Create a robust test suite that thoroughly tests all functionality of a client-side application
- Use of Webpack to have many, separate JavaScript files to keep code organized and readable.
- Use of Sass to use things like variables, nested rules, inline imports and more. It also helps to keep things organised and allows you to create style sheets faster.

### Overview of Site:
- This application is a hotel management application that has seperate functionality for both the guest and the manager
- The guest has the ability to log in, see all reservations(past and future), search dates for available rooms, and add bookings.
- The manager can search guests by name and do all actions a guest can.  This is done through class inheritance.  The manager can also delete bookings as well.
- The site can be tested for accessibility via Chrome Dev tools running accessibility audits.

### Technologies Used:
- HTML
- CSS/Sass
- Javascript/jQuery
- Mocha/Chai
- git

## Setup

Fork then clone down this repository. 

Then install the library dependencies. Run:

```bash
npm install
```

To verify that it is setup correctly, run `npm start` in your terminal. Go to `http://localhost:8080/` and you should see a page with some `h1` text and a pink background. If that's the case, you're good to go. Enter `control + c` in your terminal to stop the server at any time.


## How to View Your Code in Action

In the terminal, run:

```bash
npm start
```

You will see a bunch of lines output to your terminal. One of those lines will be something like:

```bash
Project is running at http://localhost:8080/
```

Go to `http://localhost:8080/` in your browser to view code running in the browser.

---


## Running Tests

Run your test suite using the command:

```bash
npm test
```

The test results will output to the terminal.

### Login Page
<img width="1435" alt="Screen Shot 2020-01-14 at 9 45 28 PM" src="https://user-images.githubusercontent.com/54483332/72405744-2f908f80-3717-11ea-86c6-1ceaac43caf7.png">

### Customer Dashboard
<img width="1435" alt="Screen Shot 2020-01-14 at 9 45 55 PM" src="https://user-images.githubusercontent.com/54483332/72405768-40410580-3717-11ea-895c-a82687afb643.png">
<img width="1435" alt="Screen Shot 2020-01-14 at 9 46 15 PM" src="https://user-images.githubusercontent.com/54483332/72405785-4c2cc780-3717-11ea-89fc-dad634d7cf27.png">

### Manager Dashboard
<img width="1435" alt="Screen Shot 2020-01-14 at 9 48 12 PM" src="https://user-images.githubusercontent.com/54483332/72405858-9150f980-3717-11ea-89a9-1088908630d4.png">
