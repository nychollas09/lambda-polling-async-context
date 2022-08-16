const { setTimeout } = require("timers/promises");
const { randomUUID } = require("crypto");

class Handler {
  constructor({ stepFunctions }) {
    this.stepFunctions = stepFunctions;
    this.stepFuntionARN =
      "arn:aws:states:sa-east-1:900443222593:stateMachine:sync-consumer-with-async-context";
  }

  async main() {
    try {
      console.log(">>> Triggering step function");

      const stepFunctionInfo = await this.stepFunctions
        .startExecution({
          stateMachineArn: this.stepFuntionARN,
          name: `called-from-polling-lambda-${randomUUID()}`,
        })
        .promise();

      let isRunning = true;
      let stepFunctionData = {};

      console.log(">>> Verify if step function is running");

      while (isRunning) {
        const execution = await stepFunctions
          .describeExecution({
            executionArn: stepFunctionInfo.executionArn,
          })
          .promise();

        console.log(`>>> Current execution status: ${execution.status}`);

        if (execution.status === "RUNNING") {
          await setTimeout(1000);
        } else {
          console.log(`>>> Execution contexto: ${JSON.stringify(execution)}`);

          stepFunctionData = {
            output: JSON.parse(execution.output),
            status: execution.status,
          };
          isRunning = false;
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          stepFunctionData,
        }),
      };
    } catch (error) {
      console.log(">>> Deu ruim:", error.stack, error.message);

      return {
        statusCode: 500,
        body: "Couldn't trigger events!!",
        headers: { "Content-Type": "text/plain" },
      };
    }
  }
}

const AWS = require("aws-sdk");
const stepFunctions = new AWS.StepFunctions();

const handler = new Handler({ stepFunctions });

module.exports.main = handler.main.bind(handler);
