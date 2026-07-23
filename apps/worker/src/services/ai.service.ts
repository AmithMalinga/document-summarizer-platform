import Groq from "groq-sdk";


const groq =
    new Groq({

        apiKey:
            process.env.GROQ_API_KEY

    });



interface AIResult {

    summary: string;

    category: string;

    confidence: number;

}



export async function generateSummary(
    text: string
): Promise<AIResult> {


    if (
        !process.env.GROQ_API_KEY
    ) {

        throw new Error(
            "GROQ_API_KEY is missing"
        );

    }



    /*
        Limit input size for MVP

        Prevent huge documents
        consuming excessive tokens
    */

    const content =
        text.substring(
            0,
            12000
        );



    const prompt = `

You are a document analysis AI.

Analyze the following document.

Return ONLY valid JSON.

Required format:

{
  "summary": "short concise summary",
  "category": "document category",
  "confidence": 0.0
}

Category examples:
- invoice
- report
- contract
- letter
- prescription
- news article
- technical document
- other


Document:

${content}

`;



    const completion =
        await groq.chat.completions.create({

            model:
                "llama-3.1-8b-instant",


            messages: [

                {
                    role:
                        "system",

                    content:
                        "You summarize and classify documents accurately."
                },


                {
                    role:
                        "user",

                    content:
                        prompt
                }

            ],


            temperature:
                0.2,


            response_format:
            {
                type:
                    "json_object"
            }

        });



    const response =
        completion
            .choices[0]
            ?.message
            ?.content;



    if (!response) {

        throw new Error(
            "Empty AI response"
        );

    }



    const result =
        JSON.parse(
            response
        );



    return {

        summary:
            result.summary
            ??
            "No summary generated",


        category:
            result.category
            ??
            "other",


        confidence:
            Number(
                result.confidence
            )
            ||
            0

    };

}