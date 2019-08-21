resource "aws_lambda_function" "lambda" {
  filename         = "../lambda.zip"
  function_name    = "codepipeline-teams-notifications"
  role             = "${aws_iam_role.lambda.arn}"
  handler          = "index.handler"
  source_code_hash = "${filebase64sha256("../lambda.zip")}
  runtime          = "nodejs8.10"
  timeout          = 20

  environment {
    variables = {
      WEBHOOK_URL = "${var.teams_webhook_url}"
    }
  }
}

resource "aws_lambda_permission" "cloudwatch_execution" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.lambda.function_name}"
  principal     = "events.amazonaws.com"
  source_arn    = "${aws_cloudwatch_event_rule.codepipeline_event.arn}"
}
