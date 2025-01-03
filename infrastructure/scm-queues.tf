# SCM Queues
## SCM has 3 subjects: repository, change and branch

resource "cloudflare_queue" "scm-repository" {
  # Queues for repository-related events
  # should create brucellino-scm-repository-created ... brucellino-scm-change-update
  for_each   = toset(var.vocabulary.scm.repository)
  name       = "${var.deployment}-scm-repository-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}

resource "cloudflare_queue" "scm-branch" {
  for_each   = toset(var.vocabulary.scm.branch)
  name       = "${var.deployment}-scm-branch-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}

resource "cloudflare_queue" "scm-change" {
  for_each   = toset(var.vocabulary.scm.change)
  name       = "${var.deployment}-scm-change-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}
