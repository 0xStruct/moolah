
# Mina Email - emails as verified credentials

## Introduction - why email?

**Mina Email** verifies DKIM signature of emails and their content as verified credentials to unravel many interesting use-cases for Mina ZK.

Email is an integral part of our connected world... Email is the identity as well as entry point to access various other web2 services (communication, social, ecommerce, etc). With **Mina Email** web3 is now just an email away (doing away with unintuitive pass phrases) while web3 can now leverage existing web2 identities and data as verified by email's DKIM signature.

Email is intutitive and seamless UX for majority of internet users. In addition to its personal and privacy characteristics, email has various verification standards (SPF, DKIM, DMARC, Arc, etc) incorporated. Among them, **Mina Email** leverages DKIM (DomainKeys Identified Mail) which provides signature on email and its metadata for verification. More about DKIM be read here: https://www.proofpoint.com/us/threat-reference/dkim

Hence, this project is just the start on how email could unravel numerous use cases for Mina ecosystem.

## How does it work?

**Mina Email** runs an oracle service to allow users to present email in its raw format or as .eml file, the oracle checks DKIM signature and verifies that its metadata are correct. Then as per required, it checks source, recipient, subject and content as specified to extract certain information then sign them.

With the returned signature and corresponding data, users then proceed to next step of their interactions with Mina dApps.

Various Mina dApps, leveraging email as verfied credentials, could be built. Below a few obvious ones are listed.

- Proof of receipt
- Proof of ownership (Twitter, Facebook, etc)
- Proof of transfer (Wise, Zell, etc)
- Proof of document and source (certificates attached as PDFs from certain institutions)

Possibilities are infinite. And integrations with various services are no longer limited and are now permissionless. Users can now establish proofs with just emails they have received from various service providers.

## Source of inspiration

The idea of this project came from learning about Mina blockchain and various other zero knowledge projects. Particularly, following projects inspired me to work on this project.

- ZK Email - https://github.com/zkemail/zk-email-verify
- ZK P2P - https://zkp2p.xyz/swap
- ZKCred - built on Mina (https://github.com/mono-koto/zkcred)

Thank you so much for sharing years of research and work that I could learn from.

Furthermore, appreactions to tutorials in Mina documentation and Vedant Chainani's blog.

## Projects using Mina Email

### Project #1 - Send $Mina to email addresses

I have always been obsessed with email as powerful command center and UI/UX. How might I transfer $Mina to anyone with an email address just by sending an email?

With that inquisition, this project is built. 

The oracle service would verify that email is sent from me to the recipient who is presenting the email as proof, then check in the subject for the amount of $Mina to give to the recipient. If everything is right, then sign the email id and amount.

Then the recipient would use the signature to claim $Mina from the smart contract which will send $Mina to the recipient and and record in nullifier Merkle Tree to ensure single claim.

Please refer to `contracts` and `oracle` folders for code. Each folder has its own `README.md` file.

### Project #2 - Decentalized peer-to-peer commerce (TBC)

Most commerce activities do not happen all on-chain unlike NFT and token swaps. They involve exchanges of goods, services, etc.

With decentralized peer-to-peer commerce leveraging **Mina Email**, certain transfers can be verified with email. For instance, transfer of fiat, transfer to web domain address, etc can be verified via emails from service providers.

Hence, involvement of third-party in the form of escrow management and arbitration can be minimized.

### Project #3 - Email as Mina wallet (TBC)

Can an email address become a Mina wallet so that various chain interactions could be as simple as writing and replying an email?

## How to run the project

Please refer to `contracts` and `oracle` folders for code. Each folder has its own `README.md` file.

For quick overview, refer to `GUIDE.md` for walkthrough video and further explanations.

## Tasks and Next steps

Please refer to `TASKS.md` for completed and planned tasks

- Oracle V2: client-side Oracle for full privacy?
- Could oracle be decentralized as well?
- Turn the oracle into a SDK for various use cases
- Build more **Mina Email** apps (templates)
    - Mina P2P commerce, Mina Email wallet, etc

