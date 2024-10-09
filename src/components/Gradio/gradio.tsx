
// //import { Client } from "@gradio/client";
// import { useNavigate } from 'react-router-dom';
// import { useBackButton } from '@/hooks/useBackButton';
// import { useCallback, useState } from 'react';
// import { useMainButton } from '@/hooks/useMainButton';
// import axios from 'axios';



// const GradioItem = () => {

//     const [response, setResponse] = useState<string>();

//     const [inputValue, setInputValue] = useState<string>('');

//     const navigate = useNavigate();
//     /* useBackButton(); */

//     const handleGradio = useCallback(() => {
//         navigate('/gradio');
//     }, [navigate]);

//     /* const predictGradio = async () => {
//         setResponse("connecting");

//         try {
//             const app = await Client.connect("https://a809-43-143-237-200.ngrok-free.app");
//             setResponse("connected");

//             const result = await app.predict("/predict", { param_0:inputValue});
//             setResponse(result.data as string);

//         } catch (error) {
//             setResponse(JSON.stringify(error));
//         }

//     } */

//     const predictUrl = async () => {

//         interface GradioResp {
//             event_id: string;
//         }

//         interface GradioReq {
//             data: string[];
//         }

//         const request: GradioReq = {
//             data: [inputValue]
//         };

//         const config = {
//             headers: {
//                 'Accept': '*/*',
//                 'Accept-Encoding': 'gzip, deflate, br',
//                 'Connection': 'keep-alive'
//                 //'User-Agent': '' // Setting User-Agent to an empty string
//             }
//         };

//         const apiUrl = "https://a809-43-143-237-200.ngrok-free.app/call/predict"; // Public API URL
//         try {

//             /* const response = await axios.post<GradioResp>(apiUrl, request, {
//                 headers: {
//                     'Access-Control-Allow-Origin': 'https://90bc-83-147-15-235.ngrok-free.app', // or specify your allowed origin
//                     'Access-Control-Allow-Credentials': true,
//                 }
//             }); // Make a GET request
//             setResponse(JSON.stringify(response.data.event_id)); */
//             const eventUrl = `${apiUrl}/392bfd47458046c987529ca2369eee08`
//             const eventResponse = await axios.get<GradioResp>(eventUrl, config)
//             .then(response => {
//                 setResponse(JSON.stringify(response));
//             })
//             .catch(error => {
//                 setResponse(JSON.stringify(error));

//             });
//             setResponse(JSON.stringify(eventResponse));



//         } catch (error) {

//             if (axios.isAxiosError(error)) {
//                 setResponse(JSON.stringify(error));
//             } else {
//                 setResponse(JSON.stringify(error));
//             }
//         }

//     }

//     useMainButton({ text: 'Predict', onClick: predictUrl });


//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setInputValue(event.target.value);
//     };

//     return (
//         <div>
//             <h1>Text Input Example</h1>
//             <input
//                 type="text"
//                 value={inputValue}
//                 onChange={handleInputChange}
//                 placeholder="Enter some text"
//             />
//             <div> Result : {response} </div>
//             <video width="640" height="360" controls>
//                 <source src='https://a809-43-143-237-200.ngrok-free.app/file=/root/autodl-tmp/Linly-Talker/temp/392bfd47458046c987529ca2369eee08/myface_answer.mp4' type="video/mp4" />
//                 Your browser does not support the video tag.
//             </video>
//         </div>
//     );
//     /* return (
//         <div>
//             <h1>Text Input Example</h1>
//             <iframe src="https://a809-43-143-237-200.ngrok-free.app" width="100%"/>
//         </div>
//     ); */
// };

// export default GradioItem;
