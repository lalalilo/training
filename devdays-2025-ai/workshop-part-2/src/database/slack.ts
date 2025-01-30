import { LogLevel, WebClient } from "@slack/web-api";

type ErrorMessage = {
  created_at: Date;
  title: string;
  message: string;
  sender: string;
  threads: Omit<ErrorMessage, "title" | "threads">[];
};

const ERROR_COLOR = "a30200";
export const slackClient = new WebClient(process.env.SLACK_TOKEN, {
  logLevel: LogLevel.ERROR,
});

//mtg-jobs
const channelId = "C02FW8DGG2F";

try {
  const result = await slackClient.conversations.history({
    channel: channelId,
    limit: 200,
  });

  const messages = result.messages?.filter((message) =>
    message.attachments?.some((attachment) => attachment.color === ERROR_COLOR)
  );

  const data: ErrorMessage[] = [];
  for (const message of messages ?? []) {
    if (!message.ts) {
      continue;
    }
    const replies = await slackClient.conversations.replies({
      channel: channelId,
      ts: message.ts,
    });

    const userReplies =
      replies.messages?.filter(
        (reply: any) => reply.subtype !== "bot_message"
      ) ?? [];

    data.push({
      created_at: new Date(parseFloat(message.ts) * 1000),
      title:
        (message.app_id === "A03DJ82GYP8" //LaliloBot
          ? message.text
          : message.attachments?.[0].title) ?? "",
      message: message.attachments?.[0].text ?? "",
      sender: message.username ?? message.user ?? "",
      threads:
        userReplies.map((reply) => ({
          created_at: new Date(parseFloat(reply.ts ?? "0") * 1000),
          message: reply.text ?? "",
          sender: reply.user ?? "",
        })) || [],
    });
  }
  console.log(JSON.stringify(data));
} catch (error) {
  console.error(error);
}
