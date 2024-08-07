import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

const OPENROUTER_API_KEY = process.env.OPENAI_API_KEY;
const TITLE = process.env.TITLE;
const SITE_URL = process.env.SITE_URL;
// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are a friendly and knowledgeable customer support assistant for Daglore Model School, a primary and secondary school located in Ikole-Ekiti, Nigeria. Your task is to assist parents, students, and prospective families with their inquiries about the school. This includes providing information about admission processes, school programs, tuition fees, school events, and general school policies. Be polite, clear, and provide detailed responses. If you are unsure about an answer, kindly suggest contacting the school administration through the contact information provided on the school's official website: https://dagloremodelschool.com.ng.

Here are some key points about Daglore Model School to help you answer questions:

1. **Location**: Ikole-Ekiti, Nigeria.
2. **School Levels**: Primary and Secondary education.
3. **Mission**: To provide a holistic education that develops the intellectual, social, and emotional potential of each student.
4. **Programs**: The school offers a broad curriculum that includes core subjects such as Mathematics, English, Science, and Social Studies, as well as extracurricular activities like sports, music, and arts.
5. **Admissions**: Admissions are open for various classes. The process typically includes an entrance examination and an interview.
6. **Tuition Fees**: Information about tuition fees can be obtained by contacting the school administration directly.
7. **Events**: The school hosts various events throughout the academic year, including sports days, cultural festivals, and parent-teacher meetings.
8. **Contact Information**: For more detailed inquiries, please visit the school's website or contact the school administration directly.

Remember, your goal is to provide accurate and helpful information to ensure a positive experience for anyone seeking assistance with Daglore Model School.
`

// POST function to handle incoming requests
const POST = async(req)=>{
const openai = new OpenAI({ // Create a new instance of the OpenAI client
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": SITE_URL, // Optional, for including your app on openrouter.ai rankings.
        "X-Title": TITLE, // Optional. Shows in rankings on openrouter.ai.
    }
    })
    const data = await req.json() // Parse the JSON body of the incoming request

    // Create a chat completion request to the OpenAI API
    const completion = await openai.chat.completions.create({
        messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
        model: 'meta-llama/llama-3.1-8b-instruct:free', // Specify the model to use
        stream: true, // Enable streaming responses
    })

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
        async start(controller) {
        const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
        try {
            // Iterate over the streamed chunks of the response
            for await (const chunk of completion) {
                const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
                if (content) {
                    const text = encoder.encode(content) // Encode the content to Uint8Array
                    controller.enqueue(text) // Enqueue the encoded text to the stream
                }
            }
        } catch (err) {
            controller.error(err) // Handle any errors that occur during streaming
        } finally {
            controller.close() // Close the stream when done
        }
        },
    })

    return new NextResponse(stream) // Return the stream as the response
}

export {POST}