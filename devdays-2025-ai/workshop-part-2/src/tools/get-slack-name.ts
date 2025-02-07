import { slackClient } from "../database/slack";

export const getSlackName = async (user: string) => {
  const result = user.split("@");
  let userId;
  if (result.length > 1) {
    userId = result[1];
  } else {
    userId = result[0];
  }

  console.log("Called getSlackName with", user);
  if (!userId) {
    console.error("Cannot find userId from", user);
    return user;
  }

  const response = await slackClient.users.info({
    user: userId,
  });
  if (response.error || response.ok !== true) {
    console.error("Error while getting the slack username", response.error);
  }
  console.log(response.user?.real_name);

  return response.user?.real_name ?? user;
};

export const FUNCTION_NAME = "get_name";

export const slackNameTool = [
  {
    type: "function" as const,
    function: {
      name: FUNCTION_NAME,
      description: "Replace slack userId per real username",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description:
              "The userId from slack usually starting with capital U",
          },
        },
        required: ["userId"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
];
