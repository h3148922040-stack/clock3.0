
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMechanicalExplanation(topic: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一位亲切的钟表匠，正在教一个10岁的孩子。
      请解释关于“${topic}”在机械表中的原理。
      语言要简单生动、具有启发性，并尽量使用比喻。
      请控制在3句短话以内。请使用简体中文。`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "时钟的每一个齿轮都在相互协作，让时间不停流转！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "抱歉，钟表匠现在太忙了。但你可以观察齿轮是如何咬合的！";
  }
}

export async function getQuizQuestion(): Promise<{ question: string; options: string[]; answer: number }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `请为小朋友生成一个非常简单、基础的关于时钟或齿轮的小问题。
      题目要直观，比如关于哪个针跑得最快，或者齿轮长什么样。
      要求：使用简体中文，语气可爱，输出为 JSON 格式。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "题目内容" },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "选项列表，包含3个简单的选项" },
            answer: { type: Type.INTEGER, description: "正确答案的索引（从0开始）" }
          },
          required: ["question", "options", "answer"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    // 极其简单的后备题目
    return {
      question: "在时钟的大家族里，哪根针跑得最快，总是在不停地转圈圈？",
      options: ["红色的秒针", "长长的分针", "短短的时针"],
      answer: 0
    };
  }
}
