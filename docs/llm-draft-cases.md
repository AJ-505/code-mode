FC = Function-calling (traditional tool-calling built into AI APIs)
MCP = Model Context Protocol => Standard developed by Anthropic to connect agents to external environments

# Real-world scenarios — MCP/FC vs Code Mode

1. Read from a customer DB (could be a local CSV or a real DB with a schema) that has an array of customer data, then fetch the data of a customer with a specific ID, find their latest transactions and return the customer's average spend in the past week.
2. Expose the Playwright MCP server for the agent's use, and compare it against giving it the entire playwright client for it to do whatever it wants. Use this to do a full audit of a demo website, where the agent will look around and find UI flaws and give feedback on the website's design quality. Compare the speed and token efficiency across both runs.
3. Connect the Slack MCP server to an agent, tell it to summarise all chats in a specific group that occurred during the past 24 hours. Compare the results against the direct exposure of the Slack Client/SDK in the code mode implementation.
4. Retrieve a specific keyword made by a specific person in a meeting minutes on a particular day from a Google Drive folder
5. Check the user's calendar to see how their schedule is like, and schedule a hypothetical meeting with someone in Bolivia. This requires good time-zone understanding + correct usage of available tools.
6. Use the Github MCP server to fetch a repository, make a specific change, and create a PR.
7. Programmatically expose a github client that exposes all the functionality of the Github API, or instead of exposing all that functionality.
