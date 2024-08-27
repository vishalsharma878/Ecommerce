const SibApiV3Sdk = require('sib-api-v3-sdk');
const User = require('../models/user');
require("dotenv").config();

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

exports.sendEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({_id: userId})
    const email = user.email;
    let emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail = {
      to: [{ email: email }],
      sender: { email: 'dilnaam600@gmail.com'},
      subject: 'Subject',
      htmlContent: `<p>${'The cart has been successfully cleared'}</p>`, 
    };

    await emailApi.sendTransacEmail(sendSmtpEmail);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully!',
    });
  } catch (error) {
    console.error('Error sending email with Sendinblue:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
    });
  }
};

