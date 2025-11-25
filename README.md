# copilot-workflows

A repository to understand how GitHub Copilot's `copilot-setup-steps.yml` workflow interacts with the runner environment.

## What is copilot-setup-steps.yml?

The `copilot-setup-steps.yml` is a special GitHub Actions workflow that **GitHub Copilot's coding agent** runs automatically before starting to work on issues or pull requests. It prepares the development environment with everything Copilot needs.

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│  User assigns issue/PR to Copilot                                   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  GitHub triggers workflow_dispatch on copilot-setup-steps.yml       │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Runner environment is prepared:                                     │
│  • Repository is checked out                                         │
│  • Dependencies are installed                                        │
│  • Tools are configured                                              │
│  • Environment variables are set                                     │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Copilot's coding agent starts working in the prepared environment  │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Requirements

1. **File Location**: Must be at `.github/workflows/copilot-setup-steps.yml`
2. **Workflow Name**: The file must be named exactly `copilot-setup-steps.yml`
3. **Trigger**: Must include `workflow_dispatch` trigger for Copilot to invoke it
4. **Checkout**: Should checkout the repository so Copilot has access to code

## What You Can Configure

### 1. Runner Environment
Choose the base OS and resources:
```yaml
runs-on: ubuntu-latest  # or ubuntu-22.04, windows-latest, macos-latest
```

### 2. Language Runtimes
Install specific versions of languages:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
```

### 3. Dependencies
Pre-install project dependencies so Copilot doesn't have to:
```yaml
- run: npm ci
```

### 4. System Tools
Install additional tools Copilot might need:
```yaml
- run: sudo apt-get install -y jq ripgrep
```

### 5. Environment Variables
Set variables available to Copilot:
```yaml
- run: echo "MY_VAR=value" >> $GITHUB_ENV
```

### 6. Services
Start databases or other services:
```yaml
- run: docker run -d --name postgres -p 5432:5432 postgres:15
```

## Pre-installed Tools on Ubuntu Runners

Ubuntu runners come with many tools pre-installed:
- **Languages**: Node.js, Python, Ruby, Go, Java, Rust, PHP
- **Build Tools**: Make, CMake, GCC, Docker
- **Package Managers**: apt, npm, yarn, pip, cargo

See the [GitHub Actions runner images documentation](https://github.com/actions/runner-images) for complete lists.

## Experiments

The `copilot-setup-steps.yml` in this repository includes experimental steps that:
1. Display runner environment information
2. List pre-installed development tools
3. Set custom environment variables
4. Create workspace artifacts

These experiments help understand what's available and how setup steps affect Copilot's working environment.

## Best Practices

1. **Keep it fast**: Copilot waits for setup to complete
2. **Cache dependencies**: Use caching actions to speed up repeated runs
3. **Only install what's needed**: Don't bloat the environment
4. **Document your setup**: Add comments explaining why each step exists
5. **Test independently**: Run the workflow manually to verify it works
