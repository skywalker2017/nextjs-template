// app/api/submit/route.ts
import fs from 'fs/promises';
import path from 'path';
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
    let eventId = "";
    try {

        const response = await axios.post<GradioResp>(apiUrl, gradioReq, {}); // Make a GET request
        eventId = response.data.event_id;
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

    const aiProjectPath = "/root/autodl-tmp/Linly-Talker/temp";
    const projectPath = "/root/autodl-tmp/nextjs-template/public";

    // copy file
    const sourcePath = `${aiProjectPath}`;
    const destinationPath = `${projectPath}`;

    try {
        await fs.copyFile(`${aiProjectPath}/${eventId}/myface_answer.mp4`, `${projectPath}/${eventId}.mp4`);
    } catch (error) {
        console.error('Error copying file:', error);
    }

    console.log("copy done");

    return new Response(JSON.stringify({ message: `${eventId}` }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}