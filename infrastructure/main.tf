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
