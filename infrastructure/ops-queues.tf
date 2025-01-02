# Ops Event Queues
## Ops Subjects are ticket and incident

resource "cloudflare_queue" "ticket" {
  for_each   = toset(var.vocabulary.ops.ticket)
  name       = "${var.deployment}-ops-ticket-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}

resource "cloudflare_queue" "incident" {
  for_each   = toset(var.vocabulary.ops.incident)
  name       = "${var.deployment}-ops-ticket-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}
