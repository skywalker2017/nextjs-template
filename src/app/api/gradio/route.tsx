// app/api/submit/route.ts

import axios from "axios";

interface GradioResp {
    event_id: string;
}

interface GradioReq {
    data: string[];
}

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getResponse(eventUrl: string): Promise<string> {
    const eventGet = await axios.get(eventUrl, {
        responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
        eventGet.data.on('data', (chunk: Buffer) => {
            const chunkStr = chunk.toString();
            console.log('Received chunk:', chunkStr);
            const chunkedJson = chunkStr.split('data: ')[1]
            // todo length check
            console.log(`chunkedJson: ${chunkedJson}`);
            const jsonObject = JSON.parse(chunkedJson);
    
            const url = jsonObject[0].video.url;
            console.log(`url:${url}`);
            resolve(url);
            
        });
        eventGet.data.on('error', (error: Error) => {
            reject(`'Stream error:', ${error}`);
        });
    });
}

export async function POST(request: Request): Promise<Response> {
    const data = await request.json();
    console.log(`data: ${JSON.stringify(data)}`)
    const input = data.inputValue;

    const apiUrl = "http://127.0.0.1:6006/call/predict"; // Public API URL
    const gradioReq: GradioReq = {
        data: [input]
    };
    let url = "";
    try {

        const response = await axios.post<GradioResp>(apiUrl, gradioReq, {}); // Make a GET request
        const eventId = response.data.event_id;
        const eventUrl = `${apiUrl}/${eventId}`
        console.log(`eventUrl:${eventUrl}`)
        url = await getResponse(eventUrl);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(JSON.stringify(error));
        } else {
            console.log(JSON.stringify(error));
        }
    }
    console.log(`return: ${url}`);

    return new Response(JSON.stringify({ message: `${url}` }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}