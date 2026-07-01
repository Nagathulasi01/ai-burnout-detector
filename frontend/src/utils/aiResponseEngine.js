/**
 * AI Response Engine - Rule-based intelligent responses based on user's assessment data
 * This is structured to allow easy connection to a real AI API later
 */

// Helper to get latest assessment data from localStorage
function getLatestAssessmentData() {
  try {
    const assessments = JSON.parse(localStorage.getItem("burnoutAssessments") || "[]");
    if (assessments.length === 0) return null;
    
    const latest = assessments[assessments.length - 1];
    return {
      score: latest.score,
      level: latest.level,
      answers: latest.answers,
      timestamp: latest.timestamp,
    };
  } catch (e) {
    console.error("Error loading assessment data:", e);
    return null;
  }
}

// Helper to analyze which categories are highest/lowest
function analyzeCategoryScores(answers) {
  const categories = {
    "Emotional Exhaustion": [],
    "Lifestyle": [],
    "Physical Stress": [],
    "Motivation": [],
    "Detachment": [],
  };

  const categoryMap = {
    1: "Emotional Exhaustion",
    2: "Lifestyle",
    3: "Emotional Exhaustion",
    4: "Physical Stress",
    5: "Lifestyle",
    6: "Motivation",
    7: "Emotional Exhaustion",
    8: "Detachment",
    9: "Detachment",
    10: "Physical Stress",
    11: "Motivation",
    12: "Physical Stress",
    13: "Motivation",
    14: "Emotional Exhaustion",
    15: "Detachment",
  };

  // Calculate average score per category
  Object.entries(answers).forEach(([qId, score]) => {
    const category = categoryMap[parseInt(qId)];
    if (category) {
      categories[category].push(score);
    }
  });

  const categoryAverages = {};
  Object.entries(categories).forEach(([cat, scores]) => {
    if (scores.length > 0) {
      categoryAverages[cat] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
  });

  return categoryAverages;
}

// Rule-based response generator
function generateContextAwareResponse(userMessage, assessmentData) {
  if (!assessmentData || !assessmentData.answers) {
    return generateGenericResponse(userMessage);
  }

  const score = assessmentData.score;
  const level = assessmentData.level;
  const answers = assessmentData.answers;
  const categoryScores = analyzeCategoryScores(answers);

  const lowerMsg = userMessage.toLowerCase();

  // Response templates based on context
  if (
    lowerMsg.includes("why") && 
    (lowerMsg.includes("burnout") || lowerMsg.includes("high") || lowerMsg.includes("stressed"))
  ) {
    return generateBurnoutExplanation(score, level, categoryScores, answers);
  }

  if (
    lowerMsg.includes("reduce") ||
    lowerMsg.includes("decrease") ||
    lowerMsg.includes("manage") ||
    lowerMsg.includes("lower")
  ) {
    if (lowerMsg.includes("stress") || lowerMsg.includes("burnout") || lowerMsg.includes("exhaustion")) {
      return generateStressReductionTips(categoryScores, score);
    }
  }

  if (
    lowerMsg.includes("exhaust") ||
    lowerMsg.includes("tired") ||
    lowerMsg.includes("drained")
  ) {
    return generateExhaustionResponse(categoryScores, score);
  }

  if (
    lowerMsg.includes("what") &&
    (lowerMsg.includes("do") || lowerMsg.includes("should") || lowerMsg.includes("today"))
  ) {
    return generateTodayRecommendation(categoryScores, score);
  }

  if (lowerMsg.includes("focus")) {
    return generateFocusTips(categoryScores);
  }

  if (
    lowerMsg.includes("sleep") ||
    lowerMsg.includes("rest") ||
    lowerMsg.includes("recover")
  ) {
    return generateRecoveryTips(categoryScores);
  }

  if (lowerMsg.includes("help") || lowerMsg.includes("support")) {
    return generateSupportResponse(level);
  }

  // Default: generate contextual response
  return generateGenericContextualResponse(userMessage, score, level);
}

function generateBurnoutExplanation(score, level, categoryScores, answers) {
  // Find most problematic categories
  const sorted = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  const topIssue = sorted[0];

  let explanation = "";

  if (score <= 20) {
    explanation = `Your burnout score of ${score}% is low, which is great! You're managing stress well overall. `;
  } else if (score <= 40) {
    explanation = `Your burnout score of ${score}% is moderate. There are some stress signals appearing. `;
  } else if (score <= 60) {
    explanation = `Your burnout score of ${score}% is high—this indicates rising burnout risk that needs attention. `;
  } else if (score <= 80) {
    explanation = `Your burnout score of ${score}% is very high. Your stress levels are significant and require focused recovery steps. `;
  } else {
    explanation = `Your burnout score of ${score}% is critical. This indicates severe burnout. Professional support is strongly recommended. `;
  }

  if (topIssue) {
    explanation += `\n\nYour main struggle right now seems to be **${topIssue[0]}** (scoring ${topIssue[1]}/4). `;

    if (topIssue[0] === "Emotional Exhaustion") {
      explanation +=
        "This means you're feeling emotionally drained and overwhelmed. Focus on active recovery and setting boundaries. Consider taking breaks throughout your day and engaging in activities that recharge you emotionally.";
    } else if (topIssue[0] === "Lifestyle") {
      explanation +=
        "This suggests your sleep, rest patterns, or daily habits need attention. Prioritize consistent sleep schedules and quality downtime without screens.";
    } else if (topIssue[0] === "Physical Stress") {
      explanation +=
        "Your body is holding onto tension. Regular movement, stretching, and relaxation techniques like deep breathing can help significantly.";
    } else if (topIssue[0] === "Motivation") {
      explanation +=
        "You're experiencing motivation drain. This often comes from over-exertion without adequate recovery. Take meaningful breaks and reconnect with what matters to you.";
    } else if (topIssue[0] === "Detachment") {
      explanation +=
        "You're feeling disconnected from your daily activities. This is a sign to reconnect with your values and take intentional breaks to reset.";
    }
  }

  return explanation;
}

function generateStressReductionTips(categoryScores, score) {
  const tips = [];

  // Personalized tips based on category scores
  if (categoryScores["Emotional Exhaustion"] >= 3) {
    tips.push("**Emotional Reset**: Try the 5-4-3-2-1 grounding technique (5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste) to anchor yourself when overwhelmed.");
  }

  if (categoryScores["Lifestyle"] >= 3) {
    tips.push("**Sleep Priority**: Aim for 6-8 hours tonight. Set a digital sunset—no screens 30 minutes before bed. This is crucial for stress recovery.");
  }

  if (categoryScores["Physical Stress"] >= 3) {
    tips.push("**Movement Breaks**: Take a 10-minute walk every 2 hours. Even gentle stretching releases physical tension and resets your nervous system.");
  }

  if (categoryScores["Motivation"] >= 3) {
    tips.push("**Task Breakdown**: Instead of looking at big projects, break them into 15-minute chunks. Complete one chunk, celebrate it, then take a 5-minute break.");
  }

  if (categoryScores["Detachment"] >= 3) {
    tips.push("**Reconnection**: Spend 10 minutes doing something you genuinely enjoy—no productivity, just presence. This helps combat detachment.");
  }

  if (tips.length === 0) {
    tips.push("General tip: Take a 5-minute break right now. Step outside if possible, do some deep breathing (4 counts in, 7 hold, 8 out), and come back refreshed.");
  }

  let response = `Here's how to reduce stress based on what you're experiencing:\n\n`;
  response += tips.slice(0, 3).join("\n\n");

  if (score > 60) {
    response += "\n\n**Important**: Your stress is significant. If these self-help strategies don't help within a week, consider reaching out to a counselor or therapist.";
  }

  return response;
}

function generateExhaustionResponse(categoryScores, score) {
  let response = "Emotional exhaustion is real, and your body is telling you it needs recovery. Here's what might help:\n\n";

  if (categoryScores["Lifestyle"] < 2) {
    response +=
      "1. **Your sleep/rest is actually decent**—so focus on the quality of your downtime, not just quantity. Remove productivity thoughts from your breaks.\n\n";
  } else {
    response +=
      "1. **Sleep is critical right now**. Aim for 7+ hours tonight and commit to a consistent sleep schedule. Sleep deprivation amplifies exhaustion dramatically.\n\n";
  }

  response +=
    "2. **Emotional boundaries**: You might be absorbing others' stress or taking on too much. It's okay to say 'no' or 'not right now.'\n\n";

  response +=
    "3. **Micro-recoveries**: Instead of waiting for a vacation, take 5-minute complete disconnects every 2 hours. Sit, breathe, don't check your phone.\n\n";

  if (score > 70) {
    response +=
      "Your exhaustion level is quite high. This is a sign to seek professional support—talking to someone trained can make a real difference.";
  } else {
    response += "You can recover from this. Be patient with yourself—exhaustion takes time to heal, but consistent small actions help.";
  }

  return response;
}

function generateTodayRecommendation(categoryScores, score) {
  const recommendations = [];

  recommendations.push("**Right now**: Take a 3-minute break. Stand up, stretch, and take 5 deep breaths.");

  if (categoryScores["Physical Stress"] >= 2) {
    recommendations.push("**In 1 hour**: 5-minute walk or 10 light stretches (releases physical tension).");
  }

  if (categoryScores["Motivation"] >= 2) {
    recommendations.push("**For your tasks**: Work in 25-minute blocks with 5-minute breaks (Pomodoro). It's less overwhelming.");
  }

  if (categoryScores["Lifestyle"] >= 2) {
    recommendations.push("**This evening**: Set a phone/screen alarm for 1 hour before bed. Digital sunset improves tomorrow's clarity.");
  }

  if (categoryScores["Emotional Exhaustion"] >= 3) {
    recommendations.push(
      "**Before bed**: Spend 5 minutes journaling—write what stressed you, what went well, and one thing you're grateful for."
    );
  }

  if (recommendations.length < 3) {
    recommendations.push("**Evening**: Spend 30 minutes on something that brings you joy—no work, no stress.");
  }

  return `Here's your simplified to-do for today:\n\n${recommendations.join("\n\n")}\n\n💡 Remember: Small consistent actions matter more than perfection.`;
}

function generateFocusTips(categoryScores) {
  let tips = "Here's how to improve focus right now:\n\n";

  tips +=
    "**Immediate fix**: Close unnecessary tabs/apps. Your brain uses energy switching between things.\n\n";

  if (categoryScores["Motivation"] >= 2) {
    tips += "**25/5 rule**: Work for 25 minutes intensely, then take a 5-minute break. Seriously—set a timer.\n\n";
  }

  if (categoryScores["Physical Stress"] >= 2) {
    tips +=
      "**Movement prep**: Do 2 minutes of stretching before starting focused work—it energizes your brain.\n\n";
  }

  if (categoryScores["Lifestyle"] >= 3) {
    tips += "**Energy check**: When was your last proper sleep? Focus is impossible without it. Prioritize sleep tonight.\n\n";
  }

  tips += "**Bonus**: Have water nearby and actually drink it. Dehydration kills focus.";

  return tips;
}

function generateRecoveryTips(categoryScores) {
  let tips = "Recovery is essential. Here's how to prioritize it:\n\n";

  if (categoryScores["Lifestyle"] >= 2) {
    tips += "**Sleep foundation**: 6-8 hours is non-negotiable. No screens 30 mins before bed. This is the #1 recovery lever.\n\n";
  }

  if (categoryScores["Physical Stress"] >= 2) {
    tips += "**Physical reset**: 15-20 minute walks, stretching, or yoga. Movement literally resets your nervous system.\n\n";
  }

  if (categoryScores["Emotional Exhaustion"] >= 2) {
    tips +=
      "**Emotional downtime**: Do absolutely nothing productive for 30 minutes. No scrolling, no work thoughts. Just be.\n\n";
  }

  tips += "**Pro tip**: Recovery isn't laziness—it's maintenance. Your brain needs downtime to function well, just like your phone needs charging.";

  return tips;
}

function generateSupportResponse(level) {
  let response = "I'm here for you. Here's the support landscape:\n\n";

  if (
    level === "Critical" ||
    level === "Very High"
  ) {
    response += "**Urgent**: Your burnout level is significant. I strongly encourage you to:\n";
    response +=
      "• Talk to a school counselor, therapist, or mental health professional\n";
    response += "• Reach out to trusted friends or family\n";
    response +=
      "• Contact a helpline if you're in crisis (they're trained for exactly this)\n\n";
  }

  response +=
    "**What I can do**: Help you understand your patterns and suggest concrete actions daily.\n\n";
  response +=
    "**What I can't do**: Replace professional mental health support if you're really struggling.\n\n";
  response +=
    "**Next step**: Would you like me to help you create a weekly recovery plan based on your specific struggles?";

  return response;
}

function generateGenericContextualResponse(userMessage, score, level) {
  const contexts = [];

  if (score > 70) {
    contexts.push("I notice your burnout level is critical. ");
  } else if (score > 50) {
    contexts.push("Given your moderate-to-high stress levels, ");
  } else {
    contexts.push("While your baseline is good, ");
  }

  if (userMessage.toLowerCase().includes("feel")) {
    contexts.push("what you're feeling is valid. ");
    if (score > 60) {
      contexts.push(
        "These feelings often improve with consistent recovery practices, rest, and sometimes professional support."
      );
    } else {
      contexts.push("Small changes to your routine can help you feel better soon.");
    }
  } else {
    contexts.push("I'm here to help you navigate this. ");
    if (score > 50) {
      contexts.push("The most important thing right now is consistent recovery and rest.");
    }
  }

  return contexts.join("");
}

function generateGenericResponse(userMessage) {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes("burnout")) {
    return "Burnout is when prolonged stress leads to emotional exhaustion, reduced motivation, and detachment from what you do. The good news? It's preventable and recoverable with the right support. Keep tracking your patterns to catch it early.";
  }

  if (lowerMsg.includes("focus") || lowerMsg.includes("concentrate")) {
    return "Focus tip: Use the Pomodoro technique—25 minutes of focused work, then a 5-minute break. Also, eliminate distractions and keep water nearby. Your brain needs fuel.";
  }

  if (lowerMsg.includes("stress")) {
    return "To manage stress: 1) Take breaks every hour. 2) Try the 4-7-8 breathing (inhale 4, hold 7, exhale 8). 3) Move your body—even a short walk helps. 4) Prioritize sleep. 5) Talk to someone you trust.";
  }

  if (lowerMsg.includes("sleep")) {
    return "Sleep is fundamental. Aim for 6-8 hours consistently. Try: no screens 30 mins before bed, keep your room cool and dark, and maintain a regular sleep schedule. Quality sleep is your best recovery tool.";
  }

  return "That's a great question. I'm designed to help you understand your burnout patterns and suggest personalized actions. Complete an assessment so I can give you more specific, relevant advice tailored to your situation.";
}

export { generateContextAwareResponse, getLatestAssessmentData };
