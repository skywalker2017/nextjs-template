'use client'
import { useEffect, useMemo, useState } from 'react';
import { SDKProvider, useLaunchParams } from '@telegram-apps/sdk-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

//import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TonClientProvider } from '@/context/ton-client-context';
import { AppStateProvider } from '@/context/app-context';
import { useMainButton } from '@/hooks/useMainButton';
import axios from 'axios';


//import GradioItem from '@/components/Gradio/gradio'

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

function Inner() {
  const [inputValue, setInputValue] = useState<string>('');

  const [response, setResponse] = useState<string>();

  const debug = useLaunchParams().startParam === 'debug';
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);

  const predictUrl = async () => {

    try {
      const response = await fetch('/api/gradio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputValue }),
      });

      const result = await response.json();
      const videoUrl = result.message;
      const tail = videoUrl.split('temp/')[1];
      const hash = tail.split('/')[0];

      setResponse(`http://127.0.0.1:6006/file=/root/autodl-tmp/Linly-Talker/temp/${hash}/myface_answer.mp4`);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  }

  useMainButton({ text: 'Predict', onClick: predictUrl });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <TonConnectUIProvider
      manifestUrl={'https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json'}
      actionsConfiguration={{ twaReturnUrl: 'https://t.me/SuanGeorgianaBot' }}
    >
      <TonClientProvider>
        <AppStateProvider>
          <SDKProvider acceptCustomStyles debug={debug}>
            <div>
              <h1>Text Input Example</h1>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter some text"
              />
              <div> Result : {response} </div>
              <video key={response} width="640" height="360" controls>
                <source src={response} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </SDKProvider>
        </AppStateProvider>
      </TonClientProvider>
    </TonConnectUIProvider>
  );
}

function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <Inner />
    </ErrorBoundary>
  );
}

export default Root;

