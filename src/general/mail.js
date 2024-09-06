const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tharuntharun7248@gmail.com",
    pass: "oxyn ubjk pktz seza",
  },
});

function sendEmail(whome, sub, cont) {
  const message = {
    from: "tharuntharun7248@gmail.com",
    to: whome,
    subject: sub,
    text: cont,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      // Handle error
      console.error("Error occurred while sending email:", err);
      return 0;
    } else {
      return 1;
    }
  });
}

module.exports = sendEmail;
