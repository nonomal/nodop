# Workflows

Workflows is a set of YAML files, each consisting one or multiple rules that operate on Notion databases. A workflow file ends with a `.yaml` or `.yml` extension.

## Syntax

The workflows syntax mimics that of Github Actions.

### `name`

The name of the workflow.

### `on`

The triggers of the workflow.

It can contain a single event

```yaml
on: create
```

or It can contain multiple events

```yaml
on: [create, update]
```

Currently, only `create` and `update` events are supported.

### `target`

The databases IDs that this workflow targets. Each ID used by Notion is an 32-digit hex number.

It may be one database:

```yaml
target: <database_id>
```

or multiple databases:

```yaml
target:
  - <database_id_1>
  - <database_id_2>
```

### `jobs`

The actual actions that should run on pages inside of targeted databases.

### `jobs.<job_id>`

The unique identifier for a job.

### `jobs.<job_id>.name`

Name of the job.

### `jobs.<job_id>.if`

The conditions under which the job will be run.

### `jobs.<job_id>.do`

The actions that performs on matched Notion pages.