# Continuous Delivery Event Queues
## Continuous Delivery has two subjects:
## Environment and Service
resource "cloudflare_queue" "environment" {
  for_each   = toset(var.vocabulary.cd.environment)
  name       = "${var.deployment}-cd-environment-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}

resource "cloudflare_queue" "service" {
  for_each   = toset(var.vocabulary.cd.service)
  name       = "${var.deployment}-cd-service-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}
