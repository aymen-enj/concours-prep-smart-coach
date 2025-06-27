import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const { message } = await req.json();
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Tu es l'assistant intelligent de Concours Prep, une plateforme d'aide à la préparation aux concours. Tu dois aider les utilisateurs avec leurs questions sur :
            - La préparation aux concours (ENSA, ENSAM, Médecine)
            - L'utilisation de la plateforme
            - Les fonctionnalités disponibles
            - Les conseils d'étude
            - Les informations générales sur les concours
            
            Réponds toujours en français, sois professionnel et bienveillant. Si tu ne connais pas une information spécifique, recommande à l'utilisateur de contacter le support.
            
            Question de l'utilisateur: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500
        }
      })
    });
    const data = await response.json();
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Réponse invalide de l\'API Gemini');
    }
    const aiResponse = data.candidates[0].content.parts[0].text;
    return new Response(JSON.stringify({
      response: aiResponse
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur dans la fonction chatbot-ai:', error);
    return new Response(JSON.stringify({
      error: 'Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.',
      response: 'Je ne peux pas répondre pour le moment. Notre équipe de support est disponible pour vous aider via le formulaire de contact.'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
