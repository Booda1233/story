import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  // This is a client-side app, so we can't truly hide the key.
  // We rely on the environment setup to provide it.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateStory(title: string): Promise<string> {
  const prompt = `بصفتك روائي خبير في كتابة القصص الخيالية باللغة العربية، قم بتأليف قصة طويلة وعميقة (حوالي 700-800 كلمة) بناءً على العنوان التالي: "${title}".

ركز على النقاط التالية:
1.  **تطوير الشخصيات**: أعطِ الشخصيات الرئيسية عمقاً ودوافع واضحة.
2.  **بناء العالم**: صف البيئة والأجواء بتفاصيل غنية تجعل القارئ يغوص في عالم القصة.
3.  **حبكة متصاعدة**: ابدأ بمقدمة هادئة، ثم أدخل الصراع أو الحدث الرئيسي، وصولاً إلى ذروة مثيرة.
4.  **نهاية مرضية**: اختتم القصة بنهاية مؤثرة، حكيمة، أو غير متوقعة، تترك أثراً في نفس القارئ.

يجب أن تكون القصة باللغة العربية الفصحى، ومناسبة لجميع الأعمار.
أرجع القصة فقط كنص عادي بدون أي تنسيق إضافي.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story from Gemini API:", error);
    throw new Error("Failed to generate story content.");
  }
}
