# Jira Update Custom Field

Update fields of an issue

> ##### Only supports Jira Cloud. Does not support Jira Server (hosted)

## Usage

> ##### Note: this action requires [Jira Login Action](https://github.com/marketplace/actions/jira-login)

To update the fields of an issue you need to specify an issue key and field data as action inputs, like:

```yaml
- name: Comment on issue
  uses: atlassian/gajira-comment@v3
  with:
  issue: INC-2
  fields: {"customfield_10006":3,"customfield_10007":44}
```

## Action Spec

### Environment variables
- None

### Inputs
- `issue` - An issue key to add a comment for
- `fields` - Comment

### Outputs
- None

### Reads fields from config file at $HOME/jira/config.yml
- `issue`

### Writes fields to config file at $HOME/jira/config.yml
- None