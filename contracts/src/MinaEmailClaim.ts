import {
	Field,
	UInt64,
	UInt32,
	SmartContract,
	state,
	State,
	method,
	Permissions,
	PublicKey,
	Signature,
	MerkleMap,
	MerkleMapWitness,
	Mina,
	PrivateKey,
	AccountUpdate,
	Scalar,
	CircuitString,
	Poseidon
} from 'o1js';

// public key of the oracle which verifies and signs email proof
const MINA_EMAIL_ORACLE_PUBLIC_KEY = 'B62qpjadaypxXev6SUbYZboJAZdu3dYEbTm9geYM2XciYXGx3ZqpFGt';

export class MinaEmailClaim extends SmartContract {
	@state(PublicKey) oraclePublicKey = State<PublicKey>();
	@state(Field) mapRoot = State<Field>();

	init() {
		super.init();
		this.account.permissions.set({
			...Permissions.default(),
			editState: Permissions.proofOrSignature(),
		});
		this.requireSignature();
		this.oraclePublicKey.set(PublicKey.fromBase58(MINA_EMAIL_ORACLE_PUBLIC_KEY));
		this.mapRoot.set(initialRoot);
	}

	@method deposit(amount: UInt64) {
		let depositorUpdate = AccountUpdate.createSigned(this.sender);
		depositorUpdate.send({ to: this, amount });
	}

	@method claim(
		emailHash: Field,
		amount: Field,
		signature: Signature,
		keyWitness: MerkleMapWitness,
		keyToChange: Field,
		valueBefore: Field
	) {
		// Get Oracle Public Key
		const oraclePublicKey = this.oraclePublicKey.get();
		this.oraclePublicKey.assertEquals(oraclePublicKey);

		// Verify Signature
		const validSignature = signature.verify(oraclePublicKey, [
			amount
		]);
		validSignature.assertTrue('Invalid signature');

		// Check amount is lower than 10 $Mina
		// not needed but just to prevent accidental drain
		amount.assertLessThanOrEqual(Field(10));

		// Get the Initial Root and and Check valueBefore
		const initialRoot = this.mapRoot.get();
		this.mapRoot.assertEquals(initialRoot);

		valueBefore.assertEquals(Field(0));

		// Now Update the Root before sending MINA to prevent reentrancy attacks
		const [rootBefore, key] = keyWitness.computeRootAndKey(valueBefore);
		rootBefore.assertEquals(initialRoot, 'This email has been claimed');

		key.assertEquals(keyToChange);

		const [rootAfter, _] = keyWitness.computeRootAndKey(Field(1));
		this.mapRoot.set(rootAfter);

		// Send $Mina - need to figure out how to get number from Field
		//let amountToSend = UInt64.from(parseInt(amount.toString()) * 100_000_000);
		this.send({ to: this.sender, amount: 1 * 1_000_000_000 });
	}
}

/*
  #1 setup local Mina chain and test accounts
*/
console.log('\n---setting up local Mina chain and test accounts ---');

const map = new MerkleMap();
let initialRoot = map.getRoot();

let useProof = false;
if (useProof) await MinaEmailClaim.compile();

let Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);

const { privateKey: deployerKey, publicKey: deployerAccount } =
	Local.testAccounts[0];

// test Accounts
let account1Key = PrivateKey.random();
let account1Address = account1Key.toPublicKey();

let account2Key = PrivateKey.random();
let account2Address = account2Key.toPublicKey();

let account3Key = PrivateKey.random();
let account3Address = account2Key.toPublicKey();

/*
  #2 deploy the zkApp
*/

console.log('\n--- deploying zkApp ---');

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

let zkapp = new MinaEmailClaim(zkAppAddress);
let tx;

tx = await Mina.transaction(deployerAccount, () => {
	const feePayerUpdate = AccountUpdate.fundNewAccount(deployerAccount, 3);
	feePayerUpdate.send({ to: account1Address, amount: 1e11 });
	feePayerUpdate.send({ to: account2Address, amount: 0 });
	zkapp.deploy();
});
await tx.sign([deployerKey, zkAppPrivateKey]).send();

console.log(`\nDeployed zkApp at ${zkAppAddress.toBase58()}`);
console.log(
	'Balance of Account 1: ',
	Number(Mina.getBalance(account1Address).toString()) / 10 ** 9
);

/*
  #3 send $Mina to zkApp
*/

console.log('\n--- sending $Mina to zkApp ---');

tx = await Mina.transaction(account1Address, () => {
	zkapp.deposit(UInt64.from(1e11));
});
await tx.prove();
await tx.sign([account1Key]).send();

console.log(
	'\nBalance of zkApp: ',
	Number(Mina.getBalance(zkAppAddress).toString()) / 10 ** 9
);
console.log(
	'Balance of Account 1: ',
	Number(Mina.getBalance(account1Address).toString()) / 10 ** 9
);

/*
  #3 claim $Mina with email proof
*/

console.log('\n--- claiming $Mina with email proof ---');

async function claimWithEmailProof(
	pb: PublicKey,
	pk: PrivateKey,
	emailProof: string
) {
	// emailProof
	const { data, signature } = JSON.parse(emailProof);

	const emailHashCircuit = CircuitString.fromString(data?.emailHash);
	const signedDataFields = emailHashCircuit.toFields().concat(UInt32.from(data?.amount).toFields());
	console.log('Poseidon hash: ', Poseidon.hash(signedDataFields).toString());

	const pbToField = Field.fromFields(pb.toFields());
	const witness = map.getWitness(pbToField);
	const valueBefore = Field(0);

	console.log(
		'\nBalance of Account before claim: ',
		Number(Mina.getBalance(pb).toString()) / 10 ** 9
	);

	tx = await Mina.transaction(pb, () => {
		zkapp.claim(
			Field(0), //to-do: figure out a way to pass Poseidon hash
			Field(data?.amount),
			new Signature(Field(signature?.r), Scalar.from(signature?.s)),
			witness,
			pbToField,
			valueBefore
		);
	});
	await tx.prove();
	await tx.sign([pk]).send();
	console.log(
		'Balance of Account after claim: ',
		Number(Mina.getBalance(pb).toString()) / 10 ** 9
	);
	console.log(
		'Balance of zkApp after claim: ',
		Number(Mina.getBalance(zkAppAddress).toString()) / 10 ** 9
	);
}

console.log('\n--- claim with valid email proof ---');

const validEmailProof = '{"data":{"emailHash":"CAHSQbUPQ7H_W8+O8-LPcwP5j1SWzAbv1FYg=zVORgLCH0COABA","amount":1},"signature":{"r":"9719853374619555343428598568308422176695894225224314950615147503700496963109","s":"16661831884946446385904466329604415754404427943004056667816929039421940327726"},"publicKey":"B62qpjadaypxXev6SUbYZboJAZdu3dYEbTm9geYM2XciYXGx3ZqpFGt"}';

await claimWithEmailProof(
	account2Address,
	account2Key,
	validEmailProof
);

console.log('\n--- claim with invalid email proof ---');

const invalidEmailProof = '{"data":{"emailHash":"CAHSQbUPQ7H_W8+O8-LPcwP5j1SWzAbv1FYg=zVORgLCH0COABA","amount":100},"signature":{"r":"9719853374619555343428598568308422176695894225224314950615147503700496963109","s":"16661831884946446385904466329604415754404427943004056667816929039421940327726"},"publicKey":"B62qpjadaypxXev6SUbYZboJAZdu3dYEbTm9geYM2XciYXGx3ZqpFGt"}';

await claimWithEmailProof(
	account3Address,
	account3Key,
	invalidEmailProof
);
