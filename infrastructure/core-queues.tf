# Core Event Queues
# Core Events have "pipelineRun" and "taskRun"
resource "cloudflare_queue" "pipeline_run" {
  for_each   = toset(var.vocabulary.core.pipelineRun)
  name       = "${var.deployment}-core-pipelinerun-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}

resource "cloudflare_queue" "task_run" {
  for_each   = toset(var.vocabulary.core.taskRun)
  name       = "${var.deployment}-core-taskrun-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}
