import axios from "axios";

export function registerJiraSearchTool(server) {

  server.registerTool(
    "jira_search_issues",
    {
      title: "Search Jira Issues",
      description:"Search Jira issues using a JQL query.",
        jql: "string"
    },


    
    async ({ jql }) => {

      try {

        const response = await axios.post(
          `${process.env.JIRA_BASE_URL}/rest/api/3/search`,
          { jql },
          {
            auth: {
              username: process.env.JIRA_EMAIL,
              password: process.env.JIRA_TOKEN
            },
            headers: {
              "Content-Type": "application/json"
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
              text: `JIRA search failed: ${error.message}`
            }
          ]
        };

      }

    }
  );
}