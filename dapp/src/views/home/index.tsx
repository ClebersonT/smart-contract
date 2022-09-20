// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import ReactDOM from 'react-dom'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CardGroup from 'react-bootstrap/CardGroup';
import Alert from 'react-bootstrap/Alert';
import {ReservaService} from '../../services/ReservaService';

import Col from 'react-bootstrap/Col'
// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import pkg from '../../../package.json';
import { RequestAirdrop } from '../../components/RequestAirdrop';
import { SendTransaction } from '../../components/SendTransaction';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

//metatada
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { promises } from 'mz/dns';

let Images = [];
let LinksJson = [];
const Img = [{
  name: "bored ape #01",
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  image: "https://nftcable.io/wp-content/uploads/2022/06/1655978496_548_unnamed-3.png"
},

{
  name: "bored ape #02",
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  image: "https://lh3.googleusercontent.com/RJD2SGVi-Tmgs1CpMWAV8oCWLXQhQO9wlG16dvRne5jzAkfnWU3SFZjh-910e78Xh3JhaAeolpjTwZ34LZoK8_Mz448tkgybo7EsgA=w600"
},

{
  name: "bored ape #03",
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  image: "https://lh3.googleusercontent.com/KyKUbKApT1mBpTyVgSVYGseTPHNHg9wsv4h7-OUs1XTxp1M5mIjlp60XOqc9QFRvD7NVjSvwlaWmobuA2uYIhQikgHgE2G3vwA4T"
}

];

// (async () => {
//   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
//   const keypair = Keypair.generate();

//   const metaplex = new Metaplex(connection);
//   metaplex.use(keypairIdentity(keypair));
//   //nomah: BjgVt1qWfn1zg3nfD558WJ817gAtMk1BPtwzkEewVDfT listar todas as accounts GUeWNZw5WyB39k4A23BDsyTUsW5qCu6wTHcH2wVDvU9J
//   const owner = new PublicKey("g7nGc1SBCBSTcHSwZpTwiNEi8V1iNrqSqxuZ4S1vzDb");
//   //const allNFTs = await metaplex.nfts().findAllByOwner({ owner: metaplex.identity().publicKey });
//   const nft = await metaplex.nfts().findAllByOwner({ owner }).run();

//   console.log(nft);
//   //Images = nft.json.properties.files;
//   // nft.json.properties.files.forEach((x) => {
//   //   console.log(x.uri);
//   // })

//   nft.forEach((x)=> {
//     Images.push(getDataNftFromUri(x.uri));
//     console.log("Objeto Images: "+Images);
//   })

// //   <div className="App">
// //   {nft.map(p => {
// //     return <img key={p.id} src={p.src} alt="can't show image" />;
// //   })}
// //  </div>
// })();

async function getDataAllByOwner(){
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const keypair = Keypair.generate();

  const metaplex = new Metaplex(connection);
  metaplex.use(keypairIdentity(keypair));
  //nomah: BjgVt1qWfn1zg3nfD558WJ817gAtMk1BPtwzkEewVDfT listar todas as accounts GUeWNZw5WyB39k4A23BDsyTUsW5qCu6wTHcH2wVDvU9J
  //const owner = new PublicKey("g7nGc1SBCBSTcHSwZpTwiNEi8V1iNrqSqxuZ4S1vzDb");
  const owner = new PublicKey("BjgVt1qWfn1zg3nfD558WJ817gAtMk1BPtwzkEewVDfT");
  //const allNFTs = await metaplex.nfts().findAllByOwner({ owner: metaplex.identity().publicKey });
  const nft = await Promise.all(await metaplex.nfts().findAllByOwner({ owner }).run());
  console.log("teste marcelo: "+ JSON.stringify(nft));
  //Images = nft.json.properties.files;
  // nft.json.properties.files.forEach((x) => {
  //   console.log(x.uri);
  // })

  /*let response = await Promise.all(nft.map(async(x)=> {
    return await getDataNftFromUri(x.uri);
  }));*/
    //console.log("Objeto Images: "+Images);
  

  
//   <div className="App">
//   {nft.map(p => {
//     return <img key={p.id} src={p.src} alt="can't show image" />;
//   })}
//  </div>

return nft;
}

async function getDataNftFromUri(uri: string) {
  //retorna o json com dados do nft
  try {
    let myNft = {};
    if (myNft) {
      let response = await fetch(uri);
      let responseJson = await response.json();
      console.log("myNFT: "+responseJson);

      if (responseJson && responseJson.image) {
        let obj = {
          name: responseJson.name,
          description: responseJson.description,
          image: responseJson.image
        }
        myNft = obj;
      }
    }
    return myNft;
   } catch(error) {
    console.error(error);
  }
}

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  
  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  const styles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  let [data, SetData] = useState<any>(null);
  useEffect(() => {
    async function fetchMyAPI() {
      await Promise.all(await getDataAllByOwner())
      .then(async function(result){
        let response = await Promise.all(result.map(async(result) => await fetch(result.uri).then(response => {
          if (response.ok){
            return response.json()
          }
          throw response;
        })));
        response.forEach((x) => {
          Images.push(x);
        })
        data = Images;
        SetData(data);//update state
        return true;
      });
    }

    fetchMyAPI();
  }, [data]);

  

 /* let arr = ["https://bafybeidxewimruhcibbcahi5g2haovwb3bk7jib2eqe4i54zacc3tqlv5y.ipfs.nftstorage.link/0.json", "https://bafybeidxewimruhcibbcahi5g2haovwb3bk7jib2eqe4i54zacc3tqlv5y.ipfs.nftstorage.link/0.json", "https://bafybeidxewimruhcibbcahi5g2haovwb3bk7jib2eqe4i54zacc3tqlv5y.ipfs.nftstorage.link/0.json"]
  useEffect(() => {
    
    async function fetchMyAPI() {
      // let teste = await Promise.all(await getDataAllByOwner());
      // console.log("teste links: " + JSON.stringify(teste));

      let response = await Promise.all(arr.map(async(t) => await fetch(t).then(response => {
        if (response.ok){
          return response.json()
        }
        throw response;
      })));
      response.forEach((x) => {
        Images.push(x);
      })
    }
    fetchMyAPI()
  }, []);*/

  //console.log("dados nft :" + JSON.stringify(Images))
  //return <div>{JSON.stringify(data)}</div>

  const images = Images.map((nft, key) => (
    
     <Col className="p-3">
      <Card border="dark" style={{ width: '20rem' }}>
        <Card.Img variant="top" src={nft.image} />
        <Card.Body>
          <Card.Title>{nft.name}</Card.Title>
          <Card.Text>
            {nft.description}
          </Card.Text>
          <div className='text-center'>
            {/* {<Button id="teste" variant="primary" onClick={() => reservaService.getTeste()}>RESERVAR</Button>} */}
            {/* <SendTransaction /> */}
            {<ReservaService> {nft.name} </ReservaService>}
        </div>
      </Card.Body>
    </Card>
    </Col>
  ));

  return  <div>  
            <Alert variant="info">{wallet.publicKey && <p>Public Key: {wallet.publicKey.toBase58()}</p>}
            {wallet && <p>SOL Balance: {(balance || 0).toLocaleString()}</p>}</Alert>
            <div style={styles}><CardGroup> <Row>{images}</Row> </CardGroup></div>
          </div>;
}
export default HomeView;