variable "domain" {
  type        = string
  description = "name of the domain we are deploying into"
  default     = "brucellino.dev"
}

variable "deployment" {
  type        = string
  description = "name of the deployment"
  default     = "brucellino"
}

variable "vocabulary" {
  type = object({
    core = object({
      pipelineRun = set(string)
      taskRun     = set(string)
    })
    scm = object({
      repository = list(string)
      branch     = list(string)
      change     = list(string)
    })
    ci = object({
      build    = list(string)
      artifact = list(string)
    })
    cd = object({
      environment = list(string)
      service     = list(string)
    })
    ops = object({
      incident = list(string)
      ticket   = list(string)
    })
    test = object({
      testCaseRun  = list(string)
      testSuiteRun = list(string)
      testOutput   = list(string)
    })
  })

  default = {
    core = {
      pipelineRun = ["queued", "started", "finished"]
      taskRun     = ["started", "finished"]
    }

    scm = {
      repository = ["created", "modified", "deleted"]
      branch     = ["created", "deleted"]
      change     = ["created", "reviewed", "merged", "abandoned", "updated"]
    }

    ci = {
      build    = ["queued", "started", "finished"]
      artifact = ["packaged", "signed", "published", "downloaded", "deleted"]
    }

    cd = {
      environment = ["created", "modified", "deleted"]
      service     = ["deployed", "upgraded", "rolledback", "removed", "published"]
    }

    ops = {
      incident = ["detected", "reported", "resolved"]
      ticket   = ["created", "updated", "closed"]
    }

    test = {
      testCaseRun  = ["queued", "started", "finished", "skipped"]
      testSuiteRun = ["queued", "started", "finished"]
      testOutput   = ["published"]
    }
  }
}
