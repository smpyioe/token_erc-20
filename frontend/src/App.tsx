import { useState } from 'react'
import { ethers } from 'ethers';
import tokenArtifact from "./artifacts/Token.json";
import tokenFactoryArtifact from "./artifacts/TokenFactory.json"
import './App.css'



function App() {
  const contractTokenFacotryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const abi_tokenFactory = tokenFactoryArtifact.abi;
  const abi_token = tokenArtifact.abi;

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");

  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState("");

  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [privateKeyInput, setPrivateKeyInput] = useState("");

  const [showContracts, setshowContracts] = useState(false);
  const [contractAddress, setContractAddress] = useState("");



  const [showBalanceOf, setshowBalanceOf] = useState(false);
  const [AddressBalanceOf, setAddressBalanceOf] = useState("");
  const [showBalanceOfAmount, setshowBalanceOfAmount] = useState(false);
  const [AddressBalanceOfAmount, setAddressBalanceOfAmount] = useState("");


  const [showTransfer, setshowTransfer] = useState(false);
  const [AddressTransfer, setAddressTransfer] = useState("");
  const [transferAmount, settransferAmount] = useState("");
  const [showTransferResult, setshowTransferResult] = useState(false);
  const [TransferResult, setTransferResult] = useState<any>(null);



  const [showFaucet, setshowFaucet] = useState(false);
  const [faucetAmount, setfaucetAmount] = useState("");
  const [showFaucetResult, setshowFaucetResult] = useState(false);
  const [FaucetResult, setFaucetResult] = useState<any>(null);

  const [myTokens, setMyTokens] = useState<any[]>([]);


  const connectPrivateKey = () => {
    setShowPrivateKeyModal(true);
  };

  const connectMetamask = async () => {
  try {
    if (!window.ethereum) {
      return alert("Please install MetaMask!");
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log(provider)
    await provider.send("eth_requestAccounts", []);
    
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    setSigner(signer);
    setWalletAddress(address);
    console.log(signer)
  } catch (error) {
    console.error("MetaMask connection error:", error);
    alert("Failed to connect MetaMask!");
  }
}

  const Disconnect =() => {
    setSigner(null);
    setWalletAddress("");
    setPrivateKeyInput("");
  }

  const handlePrivateKeySubmit = () => {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(privateKeyInput, provider);
    setSigner(wallet);
    setWalletAddress(wallet.address);
    setShowPrivateKeyModal(false);
  };




  const handleDeploy = async () => {
    if (!signer) return alert("Please connect a wallet first!");
    
    try {
      const TokenContract = new ethers.Contract(contractTokenFacotryAddress, abi_tokenFactory, signer);
      
      const tx = await TokenContract.createToken(name, symbol, supply);
      console.log("Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      await getMyTokens();
      
    } catch (error) {
      console.error("Deploy error:", error);
      alert("Failed to deploy token!");
    }
  }



  const getMyTokens = async () => {
    if (!signer) return alert("Please connect a wallet first!");
    const TokenContract = new ethers.Contract(contractTokenFacotryAddress, abi_tokenFactory, signer);

    try {
      const address = await signer.getAddress();
      console.log("Calling getMyTokens() from:", address);
      
      const mytokens = await TokenContract.getMyTokens();
      console.log("Raw tokens:", mytokens);

      if (mytokens.length === 0) {
        console.log("No tokens found for this address");
        setMyTokens([]);
        setshowContracts(false);
        return;
      }

      const formattedTokens = mytokens.map((token: any, index: number) => ({
        id: index + 1,
        address: token.tokenAddress,
        name: token.name,
        symbol: token.symbol,
        supply: Number(token.supply),
      }));

      console.table(formattedTokens);
      setMyTokens(formattedTokens);
      setshowContracts(true);
    } catch (error) {
      console.error("getMyTokens error:", error);
      alert("Failed to fetch tokens!");
    }
  };


  const handleBalanceOf = async () =>{
    setshowBalanceOf(false);
    if (!signer) return alert("Please connect a wallet first!");
    const TokenContract = new ethers.Contract(contractAddress,abi_token,signer);
    const balance = await TokenContract.balanceOf(AddressBalanceOf);
    console.log(contractAddress, balance);
    setAddressBalanceOfAmount(balance);
    setshowBalanceOfAmount(true);
    setAddressBalanceOf("");
  }

  const handleTransferTo = async () => {
    setshowTransfer(false);
    if (!signer) return alert("Please connect a wallet first!");
    const TokenContract = new ethers.Contract(contractAddress,abi_token,signer);
    const tx = await TokenContract.transfer(AddressTransfer,transferAmount);
    console.log("Transaction envoyée :", tx);

    const receipt = await tx.wait();

    setAddressTransfer("");
    settransferAmount("");
    setshowTransferResult(true);
    setTransferResult(receipt);
  }


  const handleFaucet = async () => {
    setshowFaucet(false);
    if (!signer) return alert("Please connect a wallet first!");
    
    try {
      const TokenContract = new ethers.Contract(contractAddress, abi_token, signer);
      const tx = await TokenContract.faucet(faucetAmount);
      console.log("Faucet transaction sent:", tx);
      
      const receipt = await tx.wait();
      console.log("Faucet transaction confirmed:", receipt);
      
      setFaucetResult(receipt);
      setshowFaucetResult(true);
      setfaucetAmount("");
    } catch (error) {
      console.error("Faucet error:", error);
      alert("Faucet failed!");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex justify-end p-4">
        {!walletAddress ? (
          <div className="flex space-x-2">
            <button
              onClick={connectPrivateKey}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Connect Private Key
            </button>
            <button
              onClick={connectMetamask}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Connect Metamask
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-end space-y-2">
            <span>Connected: {walletAddress}</span>
            <button
              onClick={Disconnect}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded"
            >
              Disconnect
            </button>
          </div>
          
        )}
      </div>

      {showPrivateKeyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">
            <h2 className="text-xl font-bold">Enter your Private Key</h2>
            <input
              type="text"
              placeholder="Private Key"
              value={privateKeyInput}
              onChange={(e) => setPrivateKeyInput(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPrivateKeyModal(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handlePrivateKeySubmit}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}


      {showBalanceOf && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">
            <input
              type="text"
              placeholder="Wallet Address"
              value={AddressBalanceOf}
              onChange={(e) => setAddressBalanceOf(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setshowBalanceOf(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Close
              </button>
                <button
                onClick={() => handleBalanceOf()}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                Check
              </button>
            </div>
          </div>
        </div>
      )}


      {showBalanceOfAmount && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">
            <p className="text-xl font-bold">Balance:</p>
            <p className="text-xl font-bold">{AddressBalanceOfAmount}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setshowBalanceOfAmount(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {showTransfer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">
            <input
              type="text"
              placeholder="Transfer to (Address)"
              value={AddressTransfer}
              onChange={(e) => setAddressTransfer(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => settransferAmount(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setshowTransfer(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Close
              </button>
                <button
                onClick={() => handleTransferTo()}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {showTransferResult &&(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-120 space-y-4 text-white">
            <p className="text-xl font-bold">Transfer result:</p>
            <p>Status: {TransferResult.status === 1 ? "Success" : "Failed"}</p>
            <p>From: {TransferResult.from}</p>
            <p>To: {TransferResult.to}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setshowTransferResult(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



      {showFaucet && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">
            <input
              type="text"
              placeholder="Amount you want to receive"
              value={faucetAmount}
              onChange={(e) => setfaucetAmount(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setshowFaucet(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Close
              </button>
                <button
                onClick={() => handleFaucet()}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                Receive
              </button>
            </div>
          </div>
        </div>
      )}


      {showFaucetResult && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-120 space-y-4 text-white">
            <p className="text-xl font-bold">Faucet Result:</p>
            <p>Status: {FaucetResult.status === 1 ? "Success " : "Failed "}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setshowFaucetResult(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-3xl font-bold mb-6">Token Creator</h1>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-80 space-y-4">
          <input
            type="text"
            placeholder="Token Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Token Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          />

          <input
            type="number"
            placeholder="Initial Supply"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          />

          <button
            onClick={handleDeploy}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition"
          >
            Deploy Token
          </button>
        </div>
      </div>

      {showContracts && myTokens.length > 0 && (
        <div className="flex flex-col items-center mt-8 px-4">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-6xl">
            <h2 className="text-xl font-bold mb-4">My Deployed Tokens</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-3">ID</th>
                    <th className="p-3">Contract Address</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Symbol</th>
                    <th className="p-3">Supply</th>
                    <th className="p-3">Balance Of</th>
                    <th className="p-3">Transfer</th>
                    <th className="p-3">Faucet</th>
                  </tr>
                </thead>
                <tbody>
                  {myTokens.map((token) => (
                    <tr key={token.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="p-3">{token.id}</td>
                      <td className="p-3 font-mono text-sm">{token.address}</td>
                      <td className="p-3">{token.name}</td>
                      <td className="p-3">{token.symbol}</td>
                      <td className="p-3">{token.supply}</td>
                      <td className="p-3">
                        <button 
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm" 
                          onClick={() => {
                            setContractAddress(token.address);
                            setshowBalanceOf(true);
                          }}
                        >
                          Check
                        </button>
                      </td>
                      <td className="p-3">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm" 
                          onClick={() => {
                            setContractAddress(token.address);
                            setshowTransfer(true);
                          }}
                        >
                          Transfer
                        </button>
                      </td>
                      <td className="p-3">
                        <button 
                          className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm" 
                          onClick={() => {
                            setContractAddress(token.address);
                            setshowFaucet(true);
                          }}
                        >
                          Mint
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

export default App;