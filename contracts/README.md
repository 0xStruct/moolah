
# Mina Email contract

## What does it do?

This contract verifies proof of email presented by claimant.
Proof signature is checked if it is by the oracle.

Then it checks if it has been claimed before with reference to Merkle Tree.

Otherwise, it updates the root and sends the specified $Mina to the claimant.

## How to try out the contract

You need to update `MINA_EMAIL_ORACLE_PUBLIC_KEY` in `MinaEmailClaim.ts` file if your oracle server is running with different keypair.

```
npm install

npm run build && node build/src/interact.js
```

`interact.ts` just loads  `MinaEmailClaim.ts`

upon running,

- contract is deployed to Mina local blockchain
- then some $Mina is sent to the contract
- an account claims with a valid email proof, it should work
- another account claims with an invalid email proof, it shouldn't work

the format of proof is as below,

```
{
  "data": {
    "emailHash": "CAHSQbUPQ7H_W8+O8-LPcwP5j1SWzAbv1FYg=zVORgLCH0COABA",
    "amount": 1
  },
  "signature": {
    "r": "9719853374619555343428598568308422176695894225224314950615147503700496963109",
    "s": "16661831884946446385904466329604415754404427943004056667816929039421940327726"
  },
  "publicKey": "B62qpjadaypxXev6SUbYZboJAZdu3dYEbTm9geYM2XciYXGx3ZqpFGt"
}
```


