const hre = require("hardhat")

async function getBalance(address) {
	const balanceBigInt = await hre.ethers.provider.getBalance(address)
	return hre.ethers.utils.formatEther(balanceBigInt)
}

async function printBalances(addresses) {
	let idx = 0
	for (const address of addresses) {
		console.log(`Address ${idx} balance: ${await getBalance(address)}`)
	}
}

async function printMemos(memos) {
	for (const memo of memos) {
		const timestamp = await memo.timestamp
		const tipper = await memo.name
		const tipperAddress = await memo.from
		const message = await memo.message
		console.log(
			`Timestamp: ${timestamp}, Tipper: ${tipper}, Tipper Address: ${tipperAddress}, Message: ${message}`
		)
	}
}

async function main() {
	const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners()

	const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee")
	const buyMeACoffee = await BuyMeACoffee.deploy()
	await buyMeACoffee.deployed()
	console.log("BuyMeACoffee deployed to:", buyMeACoffee.address)

	const addresses = [owner.address, tipper.address, buyMeACoffee.address]
	console.log("===== start =====")
	await printBalances(addresses)

	const tip = { value: hre.ethers.utils.parseEther("1") }

	await buyMeACoffee
		.connect(tipper)
		.buyACoffee("Carolina", "Thanks for the great tutorial!", tip)
	await buyMeACoffee.connect(tipper2).buyACoffee("Fernando", "Thanks.", tip)
	await buyMeACoffee.connect(tipper3).buyACoffee("Joseph", "Amazing.", tip)

	console.log("===== after tips =====")
	await printBalances(addresses)

	await buyMeACoffee.connect(owner).withdrawTips()
	console.log("===== after withdraw tips =====")
	await printBalances(addresses)

	console.log("===== all memos =====")
	const memos = await buyMeACoffee.getMemos()
	await printMemos(memos)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
