
import Head from 'next/head.js';
import Image from 'next/image.js';
import Link from 'next/link.js';
import { useEffect } from 'react';
import GradientBG from '../components/GradientBG.js';
import styles from '../styles/Home.module.css';
import minaEmailLogo from '../../public/assets/mina-email.png';
import arrowRightSmall from '../../public/assets/arrow-right-small.svg';

export default function Home() {
  // useEffect(() => {
  //   (async () => {
  //     const { Mina, PublicKey } = await import('o1js');
  //     const { Add } = await import('../../../contracts/build/src/');

  //     // Update this to use the address (public key) for your zkApp account.
  //     // To try it out, you can try this address for an example "Add" smart contract that we've deployed to
  //     // Berkeley Testnet B62qkwohsqTBPsvhYE8cPZSpzJMgoKn4i1LQRuBAtVXWpaT4dgH6WoA.
  //     const zkAppAddress = '';
  //     // This should be removed once the zkAppAddress is updated.
  //     if (!zkAppAddress) {
  //       console.error(
  //         'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qkwohsqTBPsvhYE8cPZSpzJMgoKn4i1LQRuBAtVXWpaT4dgH6WoA'
  //       );
  //     }
  //     //const zkApp = new Add(PublicKey.fromBase58(zkAppAddress))
  //   })();
  // }, []);

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
            <Link
              href="https://minaprotocol.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src={minaEmailLogo}
                alt="Mina Logo"
                width="80"
                priority
              />
            </Link>
            <p className={styles.tagline}>
              built with
              <code className={styles.code}> o1js</code>
            </p>
          </div>
          <h2>Welcome to <b>Mina Email</b>!</h2>
          <br />
          <p className={styles.start}>
            Leveraging email as verified credentials to unravel numerous use on Mina
          </p>
          <br /><br />
          <div className={styles.grid}>
            <Link
              href="/verify"
              className={styles.card}
              target="_self"
              rel="noopener noreferrer"
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
              <p>Get email verified for proof</p>
            </Link>
            <Link
              href="/claim"
              className={styles.card}
              target="_self"
              rel="noopener noreferrer"
            >
              <h2>
                <span>CLAIM</span>
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
              <p>Use proof to claim $Mina</p>
            </Link>
          </div>
        </main>
      </GradientBG>
    </>
  );
}
