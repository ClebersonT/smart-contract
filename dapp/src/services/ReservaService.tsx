import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { notify } from "../utils/notifications";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionSignature, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID, createAssociatedTokenAccount } from '@solana/spl-token';
import { getAccount } from "@solana/spl-token";

async function getOrCreateAssociatedTokenAccount(
    connection: Connection,
    mint: PublicKey,
    wallet: Keypair
): Promise<PublicKey> {
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, wallet.publicKey)
    if (await connection.getAccountInfo(associatedTokenAddress)) {
		console.log(`found associated token account for ${wallet.publicKey.toBase58()} - ${associatedTokenAddress}`)
        return associatedTokenAddress
    }


    console.log("create associated token account for", wallet.publicKey.toBase58())
    return await createAssociatedTokenAccount(connection, wallet, mint , wallet.publicKey)
}

export const ReservaService: FC = (param) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const lo = require("buffer-layout");

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }

        const tokenAccountPubkey = new PublicKey(
            "3R8uGCyyg4A8XvbYJ5voWc5WHYweEAqzm5PpHV2uuyX1"
          );
        
          let tokenAccount = await getAccount(connection, tokenAccountPubkey);
          console.log("getAccount " + tokenAccount);


        // const pubKey = new PublicKey("7BzGMomgbswT6ynUmbkqA2mh2h9oGNgfKwfR2GrEmvRT");
        let signature: TransactionSignature = '';
        try { 
            let progKeypair = Uint8Array.from([
                29,78,223,188,76,73,126,238,198,191,225,122,
                236,137,100,163,143,111,185,114,241,219,9,238,
                156,75,206,60,92,93,221,162,59,77,85,62,95,239,
                86,73,63,160,89,36,101,16,231,128,189,148,245,
                246,172,25,14,88,205,21,199,36,56,38,185,193
            ]);
            let keypair = Keypair.fromSecretKey(progKeypair);
            const progId = keypair.publicKey;
            console.log(`Program: ${progId.toBase58()}`);


            let fromKey = Uint8Array.from([
                220,98,115,249,128,179,31,227,241,111,117,81,87,126,222,174,150,60,161,69,92,18,8,106,196,63,158,190,93,217,18,188,10,5,81,123,120,64,220,253,50,180,118,232,236,97,75,173,173,122,115,206,56,124,38,179,93,124,231,183,131,41,171,134,
            ]);
            let fKeypair = Keypair.fromSecretKey(fromKey);
            const fromKeypair = fKeypair.publicKey;
            console.log(`From: ${fromKeypair.toBase58()}`);

            let toKey = Uint8Array.from([
                234,169,150,177,62,218,38,255,108,150,226,228,
                209,81,142,222,140,9,137,57,241,135,76,228,101,
                82,238,72,195,190,176,13,67,116,214,171,155,22,
                159,237,11,197,56,80,224,20,200,224,151,154,186,
                0,137,128,89,255,142,136,181,142,138,171,129,161
            ]);
            let tKeypair = Keypair.fromSecretKey(toKey);
            const toKeypair = tKeypair.publicKey;
            console.log(`To: ${toKeypair.toBase58()}`);

            let Anotherwallet = Uint8Array.from([
                227,219,178,119,254,98,35,106,21,17,65,196,236,
                40,188,209,29,151,232,79,39,176,233,228,28,227,
                166,59,237,102,89,142,178,120,78,127,65,173,165,
                219,239,186,155,196,158,127,67,173,22,222,79,113,
                5,123,129,153,118,79,92,178,195,61,248,94
            ]);
            let outroKeypair = Keypair.fromSecretKey(Anotherwallet);
            const anotherKeypair = outroKeypair.publicKey;
            console.log(`To: ${anotherKeypair.toBase58()}`);

			const nftPublicKey = new PublicKey("sFtwBW6eXuHn9G35FoaA5idzNP9zHkReY3aNRzeSMTA");

            const nomahPublicKey = new PublicKey("BjgVt1qWfn1zg3nfD558WJ817gAtMk1BPtwzkEewVDfT");
            const nomahTokenPubkey = new PublicKey("3R8uGCyyg4A8XvbYJ5voWc5WHYweEAqzm5PpHV2uuyX1");
            const userTokenPubkey = new PublicKey("HkgVCsFfvpA61ZRGGPbALMF6UVturJewHgJuvu3FRYbs");

            const teste = await getOrCreateAssociatedTokenAccount(connection, publicKey, Keypair.generate());
            console.log("teste token: "+ JSON.stringify(teste));

            let data = Buffer.alloc(8) // 8 bytes
            lo.ns64("value").encode(1000000, data);

            const instrucoes = new TransactionInstruction({
                keys: [
                    // connected user
                    {
                        pubkey: publicKey,
                        isSigner: true,
                        isWritable: true,
                    },
                    // pricipal service provider (destiny #1)
                    {
                        pubkey: publicKey,
                        isSigner: false,
                        isWritable: true,
                    },
                    // loyalty payee (destiny #2)
                    {
                        pubkey: anotherKeypair,
                        isSigner: false,
                        isWritable: true,
                    },
                    // NFT owner at the moment
                    {
                        pubkey: nomahPublicKey, 
                        isSigner: false, 
                        isWritable: true
                    },
                     // Owner associated account for the Token NFT
                     {
                        pubkey: nomahTokenPubkey, 
                        isSigner: false, 
                        isWritable: true
                    },
                    // user (which will receive the NFT)
                    {
                        pubkey: userTokenPubkey, 
                        isSigner: false, 
                        isWritable: true
                    },
                    // token authorityPubkey (who has power to transfer the token)		
                    {
                        pubkey: nomahPublicKey, 
                        isSigner: false, 
                        isWritable: true
                    },	
                    // SPL Token program ID
                    {
                        pubkey: TOKEN_PROGRAM_ID, 
                        isSigner: false, 
                        isWritable: false
                    },
					// Nativie program ID
                    {
                        pubkey: SystemProgram.programId, 
                        isSigner: false, 
                        isWritable: false
                    },
                ],
                programId: progId,
                data: data,
            })
        
            const transaction = new Transaction().add(instrucoes);
            
            signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            notify({ type: 'success', message: 'Success!', txid: signature });
        } catch (error: any) {
            notify({ type: 'error', message: `Error!`, description: error?.message, txid: signature });
            console.log('error', `Trx failed! ${error?.message}`, signature);
            return;
        }
    }, [publicKey, notify, connection, sendTransaction]);
    

    return (
        <div>
            <button
                className="group m-2 btn bg-gradient-to-r from-[#41c8ff] to-[#41c8ff] hover:to-blue-500  hover:tto-blue-500 ... "
                onClick={onClick} disabled={!publicKey}
            >
                <div className="hidden group-disabled:block ">
                    Carteira Desconectada
                </div>
                <span className="block group-disabled:hidden" style={{color:'#000'}}> 
                    Reservar Token
                </span>
            </button>
        </div>
    );
};
