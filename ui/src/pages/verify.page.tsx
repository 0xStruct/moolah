
import Head from 'next/head.js';
import Image from 'next/image.js';
import { useEffect, useState, useRef } from 'react';
import GradientBG from '../components/GradientBG.js';
import styles from '../styles/Home.module.css';
import minaEmailLogo from '../../public/assets/mina-email.png';
import arrowRightSmall from '../../public/assets/arrow-right-small.svg';

export default function Home() {
  const [response, setResponse] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleVerifyButtonClick = (event: any) => {
    event.preventDefault();
    // access textarea value
    console.log(textareaRef.current?.value);

    verifyWithOracle(textareaRef.current?.value!);
  };

  async function verifyWithOracle(email: string) {
    const res = await fetch('http://localhost:3001', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { data, signature, message } = await res.json();

    if(message) setResponse('verification failed. tampered email.');
    else setResponse(JSON.stringify({data, signature}));

	  console.log('data: ', data);
	  console.log('signature: ', signature);
  }

  return (
    <>
      <Head>
        <title>Mina Email zkApp UI</title>
        <meta name="description" content="built with o1js" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <GradientBG>
        <main className={styles.main}>
          <div className={styles.center}>
            <a
              href="/"
              target="_self"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src={minaEmailLogo}
                alt="Mina Logo"
                width="80"
                priority
              />
            </a>
            <p className={styles.tagline}>
              built with
              <code className={styles.code}> o1js</code>
            </p>
          </div>
          <h2>Verify your email to generate proof</h2>
          <br />
          <p className={styles.start}>
            <textarea rows={5} cols={80} className={styles.textarea} id="email" name="email" ref={textareaRef} defaultValue={""}>
            </textarea>
          </p>
          <br />
          <div className={styles.grid1}>
            <a
              href="#"
              className={styles.card}
              onClick={handleVerifyButtonClick}
            >
              <h2>
                <span>VERIFY</span>
                <div>
                  <Image
                    src={arrowRightSmall}
                    alt="Mina Logo"
                    width={16}
                    height={16}
                    priority
                  />
                </div>
              </h2>
            </a>

          </div>
          <div>
            <p className={styles.textarea}>{response}</p>
          </div>
        </main>
      </GradientBG>
    </>
  );
}
