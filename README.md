# Jira Update Custom Field

Update fields of an issue

> ##### Only supports Jira Cloud. Does not support Jira Server (hosted)

## Usage

> ##### Note: this action requires [Jira Login Action](https://github.com/marketplace/actions/jira-login)

To update the fields of an issue you need to specify an issue key and field data as action inputs, like:

```yaml
- name: Comment on issue
  uses: kherP/jira-custom-field@v1.1.0
  with:
  issue: INC-2;INC-3
  fields: customfield_10006=https://www.google.com;customfield_10007=4
```

## Action Spec

### Environment variables
- None

### Inputs
- `issue` - An issue key to add a comment for
- `fields` - fields to update (only support text or number field for now)

### Outputs
- None

### Reads fields from config file at $HOME/jira/config.yml
- `issue`

### Writes fields to config file at $HOME/jira/config.yml
- None