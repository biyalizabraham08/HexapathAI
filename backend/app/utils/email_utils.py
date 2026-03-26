import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

# Set up logging for dev environment
logger = logging.getLogger(__name__)

def send_otp_email(recipient_email: str, otp_code: str):
    sender_email = os.environ.get("EMAIL_USER")
    sender_password = os.environ.get("EMAIL_APP_PASSWORD")

    # If no email credentials are set, simulate sending (useful for local development)
    if not sender_email or not sender_password:
        print(f"\n{'='*50}")
        print(f"📧 MOCK EMAIL SENT")
        print(f"To: {recipient_email}")
        print(f"Subject: Your HEXAPATH AI Verification Code")
        print(f"Code: {otp_code}")
        print(f"{'='*50}\n")
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = "Your HEXAPATH AI Verification Code"

        body = f"""
        Hello,

        Welcome to HEXAPATH AI! Your verification code to complete registration is:

        {otp_code}

        This code will expire in 10 minutes.

        If you did not request this code, please ignore this email.

        Best,
        The HEXAPATH AI Team
        """
        msg.attach(MIMEText(body, 'plain'))

        # Connect to Gmail SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, recipient_email, text)
        server.quit()

        return True

    except Exception as e:
        logger.error(f"Failed to send email to {recipient_email}: {str(e)}")
        # Print to console for fallback if SMTP fails
        print(f"\n🚨 SMTP FAILED. OTP IS: {otp_code}\n")
        return False
