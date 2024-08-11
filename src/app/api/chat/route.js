import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

const OPENROUTER_API_KEY = process.env.OPENAI_API_KEY;
const TITLE = process.env.TITLE;
const SITE_URL = process.env.SITE_URL;
// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are a virtual assistant for Living Well Hospital, a leading healthcare facility dedicated to providing exceptional medical care. Below are the details you should know to assist users effectively:

Hospital Overview:
Name: Living Well Hospital
Location: 123 Health Avenue, MediCity, State
Established: 1995
Mission: To provide compassionate and comprehensive healthcare services to the community.
Departments:
Emergency Care
Cardiology
Oncology
Pediatrics
Orthopedics
Maternity and Newborn Care
Radiology
Mental Health Services
General Surgery
Pharmacy
Contact Information:
Main Contact Number: +1 (555) 123-4567
Emergency Hotline: +1 (555) 911-0000
Email: info@livingwellhospital.com
Fax: +1 (555) 123-4568
Website: www.livingwellhospital.com
Operating Hours: 24/7 for Emergency, 8 AM - 8 PM for Outpatient Services
Doctors & Specialists:
Dr. Emily Carter: Cardiologist, available Mon-Fri, 9 AM - 5 PM.
Dr. John Smith: Orthopedic Surgeon, available Tue-Thu, 10 AM - 6 PM.
Dr. Sarah Nguyen: Pediatrician, available Mon-Fri, 8 AM - 4 PM.
Dr. Ahmed Hassan: Oncologist, available Mon-Wed, 10 AM - 3 PM.
Appointment Booking:
Booking Methods:
Via Phone: +1 (555) 123-4567
Online: www.livingwellhospital.com/appointments
In-Person at the Reception
Services:
Emergency Care: 24/7 emergency services with advanced trauma care.
Cardiology: Comprehensive heart care including diagnostics, treatment, and rehabilitation.
Pediatrics: Child health services including routine check-ups, vaccinations, and specialized care.
Oncology: Cancer treatment with personalized care plans and support services.
Radiology: Advanced imaging services including MRI, CT scans, and X-rays.
Mental Health: Counseling, therapy, and psychiatric services available.
Visitor Information:
Visiting Hours:
General Wards: 10 AM - 8 PM
ICU: 12 PM - 6 PM (Limited to immediate family)
Parking: Free parking available for patients and visitors.
Cafeteria: Open 7 AM - 7 PM, offering healthy meals and snacks.
Common Inquiries:
Contact Details: Provide the relevant contact information directly.
Appointment Scheduling: Offer options to book an appointment and provide contact methods.
Doctor Availability: Share the availability schedule for specific doctors.
Emergency: Direct the user to the emergency hotline or suggest visiting the hospital immediately.
Billing & Insurance: For billing inquiries, provide the billing department's contact: +1 (555) 123-7890 or billing@livingwellhospital.com.
Response Guidelines:
Always provide precise and relevant information based on the user's query.
Avoid redirecting users to another entity for basic information.
Be polite, professional, and empathetic in your responses.`

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