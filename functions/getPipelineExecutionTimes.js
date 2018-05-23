const AWS = require('aws-sdk');
const log = require('clean-log');

const codepipeline = new AWS.CodePipeline();

module.exports = (pipelineName, pipelineExecutionId) => {
    return new Promise((resolve, reject) => {

        let params = {
            pipelineName,
            maxResults: 5
        };
        codepipeline.listPipelineExecutions(params, (err, data) => {
            if(err){
                log.error(err);
                return reject(err);
            }

            let details = data.pipelineExecutionSummaries.filter(e => {
                return e.pipelineExecutionId === pipelineExecutionId
            });

            if(details.length === 0) return resolve({});

            return resolve({
                start: details[0].startTime,
                end: details[0].lastUpdateTime
            });
        });

    })
};