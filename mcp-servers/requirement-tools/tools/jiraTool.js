import axios from "axios";

export function registerJiraTool(server) {

  // GET SINGLE ISSUE
  server.registerTool(
    "jira_get_issue",
        {
      title: "Get Jira Issue Requirements",
      description: "Fetches and reads requirement details from a Jira issue using the provided issue key. Use this tool to retrieve issue summaries, descriptions, acceptance criteria, comments, and related requirement information for analysis or test case generation.",
      issueKey: "string"
    },

    async ({ issueKey }) => {

      try {

        const response = await axios.get(
          `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`,
          {
            auth: {
              username: process.env.JIRA_EMAIL,
              password: process.env.JIRA_TOKEN
            }
          }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };

      } catch (error) {

        return {
          content: [
            {
              type: "text",
              text: `JIRA issue fetch failed: ${error.message}`
            }
          ]
        };

      }

    }
  );
}