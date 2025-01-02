# Test queues
# Test Event subjects are testCaseRun testSuiteRun and testOutput
resource "cloudflare_queue" "testcaserun" {
  for_each   = toset(var.vocabulary.test.testCaseRun)
  name       = "${var.deployment}-test-testcaserun-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}

resource "cloudflare_queue" "testsuiterun" {
  for_each   = toset(var.vocabulary.test.testSuiteRun)
  name       = "${var.deployment}-test-testsuiterun-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}

resource "cloudflare_queue" "testoutput" {
  for_each   = toset(var.vocabulary.test.testOutput)
  name       = "${var.deployment}-test-testoutput-${each.value}"
  account_id = data.cloudflare_accounts.mine.accounts[0].id
}
