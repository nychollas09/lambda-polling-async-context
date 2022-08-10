const AWS = require("aws-sdk");

const handler = async (event, context) => {
  const stepFunctions = new AWS.StepFunctions({
    credentials: {
      accessKeyId: process.env.PEFISA_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.PEFISA_AWS_SECRET_ACCESS_KEY,
    },
  });

  const stepFunctionData = await stepFunctions
    .startExecution({
      stateMachineArn:
        "arn:aws:states:sa-east-1:900443222593:stateMachine:sync-consumer-with-async-context",
      name: "Called From Polling Lambda",
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Async",
      event: event,
      stepFunctionResult: stepFunctionData,
    }),
  };
};

module.exports.handler = handler;
