# Code Mode
This is a benchmark to test traditional tool-calling methods & MCP against 'Code Mode', a new paradigm gaining traction where the LLM directly writes code to achieve its outcomes. These tests are intentionally designed to mimic real-world LLM use cases.

Ensure you have `bun` installed:

```bash
# Install bun
# For MacOS/Linux users, use the below script:
curl -fsSL https://bun.com/install | bash

# For Windows users, use this instead:
powershell -c "irm bun.sh/install.ps1|iex"

# Check bun version
bun --version
```

You will also need the Github CLI:

```bash
# For Windows users:
winget install --id GitHub.cli

# For MacOS users:
brew install gh

# For Linux users (Ubuntu/Debian):
sudo apt update && sudo apt install gh -y

# Open up a new terminal window and login to Github:
gh auth login
```

And the Google Workspaces CLI:
```bash
# For all platforms - install using npm
npm install -g @googleworkspace/cli
```

... And, the Slack CLI:
```bash
# MacOS/Linux
curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash

# Windows
# Run the following command in Powershell as Administrator:
irm https://downloads.slack-edge.com/slack-cli/install-windows.ps1 | iex
```

**NOTE**: This repo is still in its very early stages. Please contact the repo owner if things change drastically without being documented. PRs are welcome.
