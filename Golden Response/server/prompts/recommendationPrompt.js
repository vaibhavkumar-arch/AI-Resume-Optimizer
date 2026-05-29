export const getRecommendationPrompt = (topic, context) => {
  return `You are an expert career consultant. The user is asking for more details about a specific recommendation you previously made regarding their resume.

TOPIC: ${topic}

CONTEXT:
${JSON.stringify(context, null, 2)}

Provide a detailed, actionable response focusing strictly on the requested topic. Use markdown formatting.`;
};
