terraform {
  required_providers {
    vault = {
      source  = "hashicorp/vault"
      version = "~> 4"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6"
    }
  }
  backend "consul" {
    scheme = "http"
    path   = "terraform/cloudflare-cdevents"
  }
}
