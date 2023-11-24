import express from 'express';
import { Request, Response } from 'express';
import { dkimVerify } from 'mailauth/lib/dkim/verify';
import { parseHeaders } from 'mailauth/lib/tools';
import { PrivateKey, Field, Signature, CircuitString, UInt32, Poseidon, Sign } from 'o1js';
import fs from 'fs';
var cors = require('cors');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
	const privateKey = PrivateKey.fromBase58(process.env.PRIVATE_KEY);
	const publicKey = privateKey.toPublicKey().toBase58();

	res.send({
		message: `Mina Email Oracle`,
		publicKey: `${publicKey}`
	});
});

app.get('/test', async (req: Request, res: Response) => {
	// load .eml files
	let emlPass = await fs.promises.readFile('test-pass.eml', { encoding: 'utf-8' });
	let emlFake = await fs.promises.readFile('test-fake.eml', { encoding: 'utf-8' }); // changed mina amount

	const resultPass = await dkimVerify(emlPass);

	// get email metadata such as to, from, subject
	const headers = parseHeaders(emlPass);

	var from, messageId, subject;
	const from_regex = /\<(.*?)\>/gi;
	const messageId_regex = /\<(.*?)\@/gi;

	for (let h of headers.parsed) {
		if (h.key === 'from') from = from_regex.exec(h.line.toString())[1];
		if (h.key === 'message-id') messageId = messageId_regex.exec(h.line.toString())[1];
		if (h.key === 'subject') subject = h.line.toString().split(': ')[1];
		//if(h.key === 'dkim-signature') console.log(h.line.toString());
	}

	console.log('Email metadata: ', from, messageId, subject);
	//console.log(resultPass)
	//console.log(emlPass)

	// loop through results
	for (let { info } of resultPass.results) {
		console.log('### test-pass.eml')
		console.log(info);
		console.log(info.startsWith('dkim=pass')); //pass, temperror, fail
	}

	const resultFake = await dkimVerify(emlFake);

	// loop through results
	for (let { info } of resultFake.results) {
		console.log('### test-fake.eml')
		console.log(info);
		console.log(info.startsWith('dkim=pass')); //pass, temperror, fail
	}

	res.send({
		message: `Mina Email Oracle - testing, check console log of the server`,
	});
});

app.get('/sign', async (req: Request, res: Response) => {
	// load .eml files
	let emlPass = await fs.promises.readFile('test-pass.eml', { encoding: 'utf-8' });

	const resultPass = await dkimVerify(emlPass);

	// get email metadata such as to, from, subject
	const headers = parseHeaders(emlPass);

	var from, messageId, subject;
	const from_regex = /\<(.*?)\>/gi;
	const messageId_regex = /\<(.*?)\@/gi;

	for (let h of headers.parsed) {
		if (h.key === 'from') from = from_regex.exec(h.line.toString())[1];
		if (h.key === 'message-id') messageId = messageId_regex.exec(h.line.toString())[1];
		if (h.key === 'subject') subject = h.line.toString().split(': ')[1];
		//if(h.key === 'dkim-signature') console.log(h.line.toString());
	}

	console.log('Email metadata: ', from, messageId, subject);
	//console.log(resultPass)
	//console.log(emlPass)

	// loop through results
	for (let { info } of resultPass.results) {
		console.log('### test-pass.eml')
		console.log(info);
		console.log(info.startsWith('dkim=pass')); //pass, temperror, fail
	}

	// Oracle Public and Private Key
	const privateKey = PrivateKey.fromBase58(process.env.PRIVATE_KEY);
	const publicKey = privateKey.toPublicKey();

	const amount = 1;

	const emailHashCircuit = CircuitString.fromString(messageId);
	const signedDataFields = emailHashCircuit.toFields().concat(UInt32.from(amount).toFields());
	console.log('Poseidon hash: ', Poseidon.hash(signedDataFields).toString());

	//const signature = Signature.create(privateKey, [Poseidon.hash(signedDataFields)]);
	const signature = Signature.create(privateKey, [Field(amount)]); // need to figure out a way to pass Poseidon hash

	res.send({
		data: { emailHash: messageId, amount: amount },
		signature: signature,
		publicKey: publicKey,
	});
});

app.post('/', async (req: Request, res: Response) => {
	const email: string = req.body.email;
	if (!email) res.status(400).send({ error: 'Raw email content is required' });

	// Oracle Public and Private Key
	const privateKey = PrivateKey.fromBase58(process.env.PRIVATE_KEY);
	const publicKey = privateKey.toPublicKey();

	// Verify DKIM first
	const result = await dkimVerify(email);

	var verifyFailed = true;
	var verifyFailedMessage;

	for (let { info } of result.results) {
		console.log('### verifying DKIM signature')
		console.log(info);

		//pass, temperror, fail
		if (info.startsWith('dkim=pass')) verifyFailed = false;
		else verifyFailedMessage = info.split(' ')[0];
	}

	// to templatize email specific validations
	// in addition to checking about DKIM validation
	// we need to check email source, regexes for subject and content
	// next step is to define validations using Zod library

	if (verifyFailed === false) {
		// get email metadata such as to, from, subject
		const headers = parseHeaders(email);

		var from, messageId, subject;
		const from_regex = /\<(.*?)\>/gi;
		const messageId_regex = /\<(.*?)\@/gi;

		for (let h of headers.parsed) {
			if (h.key === 'from') from = from_regex.exec(h.line.toString())[1];
			if (h.key === 'message-id') messageId = messageId_regex.exec(h.line.toString())[1];
			if (h.key === 'subject') subject = h.line.toString().split(': ')[1];
			//if(h.key === 'dkim-signature') console.log(h.line.toString());
		}

		console.log('Email metadata: ', from, messageId, subject);

		const amount = 1;

		const emailHashCircuit = CircuitString.fromString(messageId);
		const signedDataFields = emailHashCircuit.toFields().concat(UInt32.from(amount).toFields());
		console.log('Poseidon hash: ', Poseidon.hash(signedDataFields).toString());

		//const signature = Signature.create(privateKey, [Poseidon.hash(signedDataFields)]);
		const signature = Signature.create(privateKey, [Field(amount)]); // need to figure out a way to pass Poseidon hash

		res.send({
			data: { emailHash: messageId, amount: amount },
			signature: signature,
			publicKey: publicKey,
		});
	} else { // verification failed

		res.send({
			message: `Verification failed: ${verifyFailedMessage}`
		});
	}

});

app.listen(process.env.PORT, () => {
	console.log(`Application started on port ${process.env.PORT}!`);
});
