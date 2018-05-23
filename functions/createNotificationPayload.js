const moment = require('moment');

module.exports = (pipeline) => {

    let dateStart = moment(pipeline.time.start);
    let dateEnd = moment(pipeline.time.end);

    let payload = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "summary": "CodePipeline Event Notification",
        "themeColor": getMessageColor(pipeline.state),
        "title": `${pipeline.state}: ${pipeline.name}`,
        "sections": [
            {
                "facts": [
                    {
                        "name": "Start:",
                        "value":dateStart.format("MMM D, YYYY @ h:mm a")
                    },
                    {
                        "name": "End:",
                        "value": dateEnd.format("MMM D, YYYY @ h:mm a")
                    },
                    {
                        "name": "Duration:",
                        "value": dateEnd.from(dateStart, true)
                    }
                ]
            }
        ],
        potentialAction: []
    };


    payload = addCommitDetails(payload,pipeline.details);
    payload = addCodePipelineUrl(payload, pipeline.name);

    return payload;
};

const getMessageColor = (pipelineState) => {

    let colors = {
        default: '3498db',
        success: '2ecc71',
        error: 'e74c3c',

    };

    switch(pipelineState.toUpperCase()){
        case 'FAILED':
            return colors.error;
        case 'SUCCEEDED':
            return colors.success;
        case 'STARTED':
        default:
            return colors.default;
    }
};

const addCommitDetails = (payload, details) => {

    if(details.artifactRevisions && details.artifactRevisions.length > 0) {

        let commitDetails = details.artifactRevisions[0];
        payload.sections[0].facts.push(
            {
                "name": "Commit:",
                "value": commitDetails.revisionId
            },
            {
                "name": "Message:",
                "value": commitDetails.revisionSummary
            }
        );

        if(commitDetails.revisionUrl) {
            payload.potentialAction.push({
                "@type": "OpenUri",
                "name": "View in CodeCommit",
                "targets": [
                    { "os": "default", "uri": commitDetails.revisionUrl }
                ]
            })

        }
    }

    return payload;
};

const addCodePipelineUrl = (payload, pipelineName) => {

    payload.potentialAction.push({
        "@type": "OpenUri",
        "name": "View in CodePipeline",
        "targets": [
            {
                "os": "default",
                "uri": `https://console.aws.amazon.com/codepipeline/home?region=${process.env.AWS_REGION}#/view/${pipelineName}`
            }
        ]
    });

    return payload;
};
