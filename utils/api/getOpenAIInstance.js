const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

export default function getOpenAIInstance() {
  return openai
}
