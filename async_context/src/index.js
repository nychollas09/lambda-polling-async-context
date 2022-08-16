const { setTimeout } = require("timers/promises");
const AWS = require("aws-sdk");

const handler = async (event) => {
  await setTimeout(5000);

  const stepFunctions = new AWS.StepFunctions();

  return await stepFunctions
    .sendTaskSuccess({
      output: JSON.stringify({
        data: {
          message: "Retorno do Contexto Asyncrono",
        },
      }),
      taskToken: event.detail.TaskToken,
    })
    .promise();
};

module.exports.handler = handler;
