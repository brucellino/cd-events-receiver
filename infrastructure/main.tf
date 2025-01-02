provider "vault" {}

data "vault_kv_secret_v2" "cloudflare_token" {
  mount = "cloudflare"
  name  = var.domain
}

data "vault_kv_secret_v2" "github" {
  mount = "kv"
  name  = "github"
}

provider "cloudflare" {
  api_token = data.vault_kv_secret_v2.cloudflare_token.data["token"]
}

data "cloudflare_accounts" "mine" {
  name = "brucellino"
}

output "cfacc" {
  value = data.cloudflare_accounts.mine[*]
}

# Create queues
## Core Queue


## SCM Queues
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
