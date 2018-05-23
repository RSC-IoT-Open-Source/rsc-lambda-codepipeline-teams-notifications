resource "aws_cloudwatch_event_rule" "codepipeline_event" {
  name        = "codepipeline-events"
  description = "Capture each CodePipeline"

  event_pattern = <<PATTERN
  {
    "source": [
      "aws.codepipeline"
    ],
    "detail-type": [
      "CodePipeline Pipeline Execution State Change"
    ]
  }
PATTERN
}

resource "aws_cloudwatch_event_target" "lambda" {
  rule      = "${aws_cloudwatch_event_rule.codepipeline_event.name}"
  target_id = "codepipeline-event-to-lambda"
  arn       = "${aws_lambda_function.lambda.arn}"
}
