const WelcomeEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to InventoryPro</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #3B82F6, #6366F1);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .message {
            background-color: #f8fafc;
            border-left: 4px solid #3B82F6;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .steps {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        .step:last-child {
            margin-bottom: 0;
        }
        .step-number {
            background-color: #3B82F6;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            margin-right: 12px;
            flex-shrink: 0;
        }
        .footer {
            background-color: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .contact-info {
            background-color: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to InventoryPro</h1>
            <p>Your account has been successfully created</p>
        </div>

        <div class="content">
            <p>Dear <strong>[User Name]</strong>,</p>

            <p>Welcome to InventoryPro! Your administrator account has been successfully created and is ready for setup.</p>

            <div class="message">
                <p><strong>Important:</strong> Please visit your system administrator to obtain your login credentials and complete the account setup process.</p>
            </div>

            <div class="steps">
                <h3 style="margin-top: 0; color: #1e40af;">Next Steps:</h3>

                <div class="step">
                    <div class="step-number">1</div>
                    <div>
                        <strong>Contact Administrator</strong>
                        <p style="margin: 5px 0 0 0; color: #4b5563;">Visit your system administrator to receive your login username and temporary password.</p>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">2</div>
                    <div>
                        <strong>First Login</strong>
                        <p style="margin: 5px 0 0 0; color: #4b5563;">Use the provided credentials to log in to the InventoryPro system.</p>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">3</div>
                    <div>
                        <strong>Set New Password</strong>
                        <p style="margin: 5px 0 0 0; color: #4b5563;">After first login, you'll be prompted to set a new secure password.</p>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">4</div>
                    <div>
                        <strong>Explore Features</strong>
                        <p style="margin: 5px 0 0 0; color: #4b5563;">Start managing your inventory with our comprehensive tools and features.</p>
                    </div>
                </div>
            </div>

            <div class="contact-info">
                <h4 style="margin-top: 0; color: #92400e;">Need Help?</h4>
                <p style="margin: 5px 0; color: #92400e;">If you have any questions or need assistance, please contact your system administrator or IT support team.</p>
            </div>

            <p>We're excited to have you on board and look forward to helping you streamline your inventory management process!</p>

            <p>Best regards,<br>
            <strong>The InventoryPro Team</strong></p>
        </div>

        <div class="footer">
            <p>&copy; 2024 InventoryPro. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;