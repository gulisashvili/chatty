var nodemailer = require('nodemailer');

module.exports.sendMail = function(sendToEmail) {

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'chattygls@gmail.com',
        pass: 'acmilan123'
    }
  });


  var mailOptions = {
    from: 'Chatty ✔ <Chatty@GLS.com>', // sender address
    to: sendToEmail,
    subject: 'Successfull Registration ✔', // Subject line
    html: '<h1> Congratulations you have been Successfully Registered on Chatty app' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
  });


}
