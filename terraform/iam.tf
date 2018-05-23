resource "aws_iam_role" "lambda" {
  name = "lambda-codepipeline-teams-notifications"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
    role       = "${aws_iam_role.lambda.name}"
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_codepipeline" {
  name = "codepipeline-policy"
  role = "${aws_iam_role.lambda.id}"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "codepipeline:ListPipelineExecutions",
                "codepipeline:GetPipelineExecution"
            ],
            "Resource": "arn:aws:codepipeline:*:*:*"
        }
    ]
}
EOF
}
