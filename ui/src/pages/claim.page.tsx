
import Head from 'next/head.js';
import Image from 'next/image.js';
import { useEffect, useState, useRef } from 'react';
import GradientBG from '../components/GradientBG.js';
import styles from '../styles/Home.module.css';
import minaEmailLogo from '../../public/assets/mina-email.png';
import arrowRightSmall from '../../public/assets/arrow-right-small.svg';

export default function Claim() {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClaimButtonClick = (event: any) => {
    event.preventDefault();
    // access textarea value
    console.log(textareaRef.current?.value);    
  };

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
          <h2>Claim $Mina with email proof</h2>
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
              onClick={handleClaimButtonClick}
            >
              <h2>
                <span>Claim</span>
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
        </main>
      </GradientBG>
    </>
  );
}
