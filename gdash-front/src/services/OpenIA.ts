import axios from "axios";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const GEMINI_URL = `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent?key=${GEMINI_KEY}`;

export async function gerarInsightsGemini(prompt: string): Promise<string> {
  try {
    const resposta = await axios.post(GEMINI_URL, {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    // juntar todo o texto de todos os candidates
    const texts: string[] = [];

    // 'resposta.data' é o array de chunks (itens)
    resposta.data?.forEach((item: any) => { 
      item.candidates?.forEach((candidate: any) => {
        // CORREÇÃO: Acessar a propriedade 'parts' dentro de 'candidate.content'
        candidate.content?.parts?.forEach((part: any) => { 
          // O texto costuma estar na propriedade 'text' da 'part'
          if (part.text) { 
            texts.push(part.text);
          }
        });
      });
    });

    const resultado = texts.join(" "); // Juntar tudo em um texto só (use "" ou "\n")

    return resultado || "IA retornou sem conteúdo";
  } catch (err) {
    return "Erro ao gerar insight IA (Gemini).";
  }
}