const AWS = require('aws-sdk');
const log = require('clean-log');

const codepipeline = new AWS.CodePipeline();

module.exports = (pipelineName, pipelineExecutionId) => {
    return new Promise((resolve, reject) => {

        let params = {
            pipelineExecutionId,
            pipelineName
        };

        codepipeline.getPipelineExecution(params, (err, data) => {
            if(err){
                log.error(JSON.stringify(err,null,2));
                return reject(err);
            }

            return resolve(data.pipelineExecution);
        });

    })
};