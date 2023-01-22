const Jira = require('./common/net/Jira')
module.exports = class {
  constructor ({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute () {
    const issueIds = this.argv.issue || this.config.issue || null
    const { fields } = this.argv
    console.log(this.argv, this.config)
    console.log(`updating ${issueIds} with \n${fields}`)
    await this.Jira.updateField(issueIds, fields)

    return {}
  }
}
