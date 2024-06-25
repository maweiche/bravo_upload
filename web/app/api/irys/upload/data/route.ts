import Irys from "@irys/sdk";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import base58 from "bs58";
const fs = require("fs");

export async function POST(request: Request) {
    const body = await request.json();
    const object = body.object;
    console.log('object: ', object);

    // Can use this to verify your wallet is importing correctly and check the public key for funds

    // const keypair = Keypair.fromSecretKey(base58.decode(process.env.PRIVATE_KEY!))
    // console.log('using wallet: ', keypair.publicKey.toBase58());
    // console.log('wallet balance: ', await connection.getBalance(keypair.publicKey));

    const getIrys = async () => {
        const network = "devnet";
        // Devnet RPC URLs change often, use a recent one from https://chainlist.org/
        const providerUrl = "https://devnet.helius-rpc.com/?api-key=b7faf1b9-5b70-4085-bf8e-a7be3e3b78c2";
        const token = "solana";
     
        const irys = new Irys({
            network, // "mainnet" or "devnet"
            token, // Token used for payment
            key: process.env.PRIVATE_KEY, // ETH or SOL private key
            config: { providerUrl }, // Optional provider URL, only required when using Devnet
        });
        return irys;
    };


    const uploadData = async (dataToUpload: string) => {
        const irys = await getIrys();
        try {
            // turn the json into a string and upload it
            const data = JSON.stringify(dataToUpload);
            console.log('data: ', data);

            // Get size of of the json string
            const size = new TextEncoder().encode(data).length;

            // Get cost to upload "size" bytes
            const price = await irys.getPrice(size);
            const price_in_sol = Number(price) / LAMPORTS_PER_SOL;
            console.log(`Price to upload price: ${price} (${price_in_sol} SOL)`);

            // Fund the Node
            const fundTx = await irys.fund(price);
            console.log(`Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${irys.token}`);
            
            // Upload the data
            const receipt = await irys.upload(data);
            console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);

            // Return the URL
            const url = `https://gateway.irys.xyz/${receipt.id}`;

            return url;
        } catch (e) {
            console.log("Error uploading data ", e);
        }
    };

    const response = await uploadData(object);
    console.log('response from upload/data api', response);
    
    return new Response(JSON.stringify({ url: response }), {
        status: 200,
    });
}
  