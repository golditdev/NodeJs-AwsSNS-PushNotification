const AWS = require("aws-sdk");
// Initializing SNS
var sns = new AWS.SNS();

// Delete endpoint
sns.deleteEndpoint({
        EndpointArn: endpoint 
    }, (err, data) => {
        if (err) {
            console.log(err.stack);
        }
        else {
            console.log(data.ResponseMetadata.RequestId);  
        }
    });
    
// Create endpoint
sns.createPlatformEndpoint({
                    PlatformApplicationArn: platform_arn,
                    Token: device_token,
                    CustomUserData: model
    }, (err, data) => {
        if (err) {
            console.log(err.stack);
            return;
        }
        else { 
            console.log(data.EndpointArn);    //save in DB : DEVICE_ARN : to send push notification
        }
    })

// publish notification
const publish = async (device_arn, title, message, sandbox) => {
  // whatever your full endpoint arn is. (from createPlatformEndpoint)
  const endpointArn = 'arn:aws:sns:...';
  // any extra data you want passed along with the message
  const payload = {
     someCustomKey: 'someCustomValue'
  };
    
 // send it
 await sns.publish({
    TargetArn: device_arn,
    MessageStructure: 'json', // so we can put in a custom payload and message
    Message: JSON.stringify({
      default: `DEFAULT MESSAGE ${message}`,
      APNS_SANDBOX: JSON.stringify({
         aps: {
            alert: {
                body: message,
                title: title
            },
            sound:"default",
            badge: 1,
         },
         payload,
      }),
      APNS: JSON.stringify({
          aps: {
            alert: {
                body: message,
                title: title
            },
            sound:"default",
            badge: 1,
          },
          payload,
      }),
      GCM: JSON.stringify({
          data: {
            message: message,
            title: title,
          },
          payload,
      }),
    }),
  }).promise().then(() => {
   console.log('Notification sent!');
   return "Notification sent"
  }).catch((err) => {
   console.log('Failed to send with:', err);
   return "err"
  });
};
