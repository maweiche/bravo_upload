import Irys from "@irys/sdk";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import base58 from "bs58";
const fs = require("fs");

export async function POST(request: Request) {
    const body = await request.json();
    const fileName = body.name;
    const tags = body.tags;
    const filePath = `./public/upload/${fileName}`;
    console.log('File Path: ', filePath); 

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
            network: network, // "mainnet" or "devnet"
            token: token, // Token used for payment
            key: process.env.PRIVATE_KEY, // SOL private key
            config: { providerUrl }, // Optional provider URL, only required when using Devnet
        });
        return irys;
    };


    const uploadFile = async (fileToUpload: string) => {
        const irys = await getIrys();
        try {

            // Get size of file
            const { size } = await fs.promises.stat(fileToUpload);

            // Get cost to upload "size" bytes
            const price = await irys.getPrice(size);
            const price_in_sol = Number(price) / LAMPORTS_PER_SOL;
            console.log(`Price to upload price: ${price} (${price_in_sol} SOL)`);

            // Fund the Node
            const fundTx = await irys.fund(price);
            console.log(`Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${irys.token}`);

            // Upload the file
            const receipt = await irys.uploadFile(fileToUpload, { tags: tags });
            console.log(`File uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
            const url = `https://gateway.irys.xyz/${receipt.id}`;

            return url;
        } catch (e) {
            console.log("Error uploading file ", e);
        }
    };

    const response = await uploadFile(filePath);


    return new Response(
        JSON.stringify({ url: response }), 
        {
            status: 200,
        }
    );
}
  