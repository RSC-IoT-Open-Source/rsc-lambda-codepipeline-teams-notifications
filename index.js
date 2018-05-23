const log = require('clean-log');

const getPipelineExecutionDetails = require('./functions/getPipelineExecutionDetails');
const getPipelineExecutionTimes = require('./functions/getPipelineExecutionTimes');
const sendNotification = require('./functions/sendNotification');

exports.handler = async (event, context, callback) => {

    log.info(event);

    let pipeline = {
        name: event.detail['pipeline'],
        executionId: event.detail['execution-id'],
        state: event.detail['state'],
        details: {},
        time: {}
    };

    try {
        pipeline.details = await getPipelineExecutionDetails(pipeline.name,pipeline.executionId)
    } catch(err) {
        log.error(`Unable to getPipelineExecutionDetails for ${pipeline.name} ${pipeline.executionId}`);
        log.error(JSON.stringify(err,null,2));
        return callback(err);
    }

    try {
        pipeline.time = await getPipelineExecutionTimes(pipeline.name,pipeline.executionId)
    } catch(err) {
        log.error(`Unable to getPipelineExecutionTimes for ${pipeline.name} ${pipeline.executionId}`);
        log.error(JSON.stringify(err,null,2));
        return callback(err);
    }

    log.debug(`Sending notification with:`);
    log.debug(pipeline);

    try {
        await sendNotification(pipeline);
    } catch(err) {
        log.error(`Unable to sendNotification for ${JSON.stringify(pipeline, null, 2)}`);
        log.error(JSON.stringify(err,null,2));

        return callback(err);
    }

    return callback(null);
};