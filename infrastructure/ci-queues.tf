# Continuous Integration Event Queues
## CI has build and artifact subjects

resource "cloudflare_queue" "build" {
  for_each   = toset(var.vocabulary.ci.build)
  name       = "${var.deployment}-ci-build-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}

resource "cloudflare_queue" "artifact" {
  for_each   = toset(var.vocabulary.ci.artifact)
  name       = "${var.deployment}-ci-artifact-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}
