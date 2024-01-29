"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const EmailTemplates = {
    verify: {
        subject: 'Verify for login',
        text: undefined,
        html: (data) => {
            return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
            body {
              background-color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            }
            .container {
              margin: 0 auto;
              padding: 20px 0 48px;
            }
            .logo {
              margin: 0 auto;
            }
            .paragraph {
              font-size: 16px;
              line-height: 26px;
            }
            .btn-container {
              text-align: center;
              color:#fff;
            }
            .button {
              padding: 12px 12px;
              background-color: #2563eb;
              border-radius: 3px;
              color: #fff;
              font-size: 16px;
              text-decoration: none;
              text-align: center;
              display: block;
            }
            .hr {
              border-color: #cccccc;
              margin: 20px 0;
            }
            .footer {
              color: #8898aa;
              font-size: 12px;
            }
            .logo-wrap{
                display:flex;
                justify-content:center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo-wrap">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsF05WGOcmIm1X52kObH1we2qm-leDJx80tBtKf007-Q&s" width="150" height="150" alt="DigitalHippo" class="logo">
            </div>
    
    
            <p class="paragraph">Hi there,</p>
            <p class="paragraph">
              Welcome to DigitalHippo, the marketplace for
              high quality digital goods. Use the button below
              to Login.
            </p>
            <div class="btn-container">
              <a href="${config_1.default.frontendUrl}/verify?token=${data === null || data === void 0 ? void 0 : data.token}" style="color:#fff" class="button">Verify</a>
            </div>
            <p class="paragraph">
              Best,<br>
              The DigitalHippo team
            </p>
            <hr class="hr">
            <p class="footer">
              If you did not request this email, you can
              safely ignore it.
            </p>
          </div>
        </body>
        </html>`;
        },
    },
    requestForCurrencyToAdmin: {
        subject: 'Requested To Buy Currency',
        html: (data) => {
            return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Currency Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .profile-container {
      text-align: center;
      margin-top: 2rem;
    }

    .profile-image {
      width: 100px;
      height: 100px;
      border-radius: 8px;
    }

    .profile-info {
      margin-top: 1rem;
    }

    .profile-name {
      font-weight: bold;
      font-size: 18px;
    }

    .profile-email {
      font-size: 14px;
    }

    .button-container {
      margin-top: 1rem;
    }

    .check-request-button {
      display: inline-block;
      padding: 8px 16px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${data.userName} requested for currency for ${data.amount} </h1>
    </div>
    <div class="profile-container">
      <img src="${data.userProfileImg}" alt="Profile" class="profile-image">
      <div class="profile-info">
        <h1 class="profile-name">${data.userName} </h1>
        <span class="profile-email">${data.userEmail} </span>
      </div>
      <div class="button-container">
        <a href="#" style="color:#fff" class="check-request-button">Check Request</a>
      </div>
    </div>
  </div>
</body>
</html>

        `;
        },
    },
    confirmEmailForCurrencyPurchase: {
        subject: 'Successfully Purchased Currency',
        html: (data) => {
            return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You!</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .content {
      text-align: center;
      margin-top: 2rem;
    }

    .purchase-info {
      margin-top: 5px;
    }

    .currency-amount,
    .current-currency {
      font-weight: bold;
    }

    .visit-site-button {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 20px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank you!</h1>
    </div>
    <div class="content">
      <p class="purchase-info">
        You have successfully purchased
        <span class="currency-amount">${data.currencyAmount} currency</span> 
      </p>
      <p class="current-currency">
        Your current currency is <span>${data.currentAmount}</span>
      </p>
      <a href="${config_1.default.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>
        `;
        },
    },
    sellerRequest: {
        subject: 'New User Requested For Seller',
        html: (data) => `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seller Requested</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .content {
      text-align: center;
      margin-top: 2rem;
    }

    .seller-info {
      margin-top: 5px;
    }

    .transaction-id {
      font-weight: bold;
    }

    .visit-site-button {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 20px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Seller Requested</h1>
    </div>
    <div class="content">
      <p class="seller-info">
        ${data.userEmail} wants to become a seller
      </p>
      <p class="transaction-id">
        The transaction Id is <span>${data.txId}</span>
      </p>
      <a href="${config_1.default.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>

    `,
    },
    sellerRequestAccepted: {
        subject: 'You are now a seller in Acctbazzar',
        html: () => `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seller Requested</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .content {
      text-align: center;
      margin-top: 2rem;
    }

    .seller-info {
      margin-top: 5px;
    }

    .transaction-id {
      font-weight: bold;
    }

    .visit-site-button {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 20px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You have successfully become a seller </h1>
    </div>
    <div class="content">
      <p class="seller-info">
       You can now publish accounts for sale
      </p> 
      <a href="${config_1.default.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>

    `,
    },
    orderSuccessful: {
        subject: 'You have purchase a order',
        html: (data) => `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seller Requested</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .content {
      text-align: center;
      margin-top: 2rem;
    }

    .seller-info {
      margin-top: 5px;
    }

    .transaction-id {
      font-weight: bold;
    }

    .visit-site-button {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 20px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Now ${data.accountName} account is your's </h1>
    </div>
    <div class="content">
      <p class="seller-info">
      you have successfully purchased ${data.accountName}
      <span style="font-weight:bold">
      <br/>
      Username: ${data.accountUserName}
      <br/>
      Password: ${data.accountPassword}
      </span>
      </p> 
      <a href="${config_1.default.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>

    `,
    },
    currencyRequestPaymentSuccessButFailed: {
        subject: 'Successfully payment is complete for currency but did not save data',
        html: (data) => `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seller Requested</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .content {
      text-align: center;
      margin-top: 2rem;
    }

    .seller-info {
      margin-top: 5px;
    }

    .transaction-id {
      font-weight: bold;
    }

    .visit-site-button {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 20px;
      background-color: #2563eb;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SomeThing went wrong while saving paid currency info Here is the order info  </h1>
    </div>
    <div class="content">
      <p class="seller-info">
      
      ${data.failedSavedData}
      </p>  
      <a href="${config_1.default.frontendUrl}" style="color:#fff" class="visit-site-button">Visit site</a>
    </div>
  </div>
</body>
</html>

    `,
    },
};
exports.default = EmailTemplates;
