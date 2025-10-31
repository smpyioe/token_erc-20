import { useState } from 'react'
import { ethers } from 'ethers';
import tokenArtifact from "./artifacts/Token.json";
import './App.css'



function App() {
  const abi = tokenArtifact.abi;
  const bytecode = tokenArtifact.bytecode.object;

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");

  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState("");

  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [privateKeyInput, setPrivateKeyInput] = useState("");

  const [showContracts, setshowContracts] = useState(false);
  const [contractAddress, setContractAddress] = useState("");


  const [showName, setshowName] = useState(false);
  const [showContractName, setshowContractName] = useState("");

  const [showSymbol, setshowSymbol] = useState(false);
  const [showContractSymbol, setshowContractSymbol] = useState("");

  const [showSupply, setshowSupply] = useState(false);
  const [showContractSupply, setshowContractSupply] = useState("");


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



  const connectPrivateKey = () => {
    setShowPrivateKeyModal(true);
  };

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
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(name, symbol, supply);
    await contract.waitForDeployment();

    const address = contract.target as string;
    setContractAddress(address);
    setshowContracts(true);
    console.log("Contract deployed at:", address);
  };

  const getTokenName = async () =>{
    if (!signer) return alert("Please connect a wallet first!");
    const TokenContract = new ethers.Contract(contractAddress,abi,signer);
    const token_name = await TokenContract.name();
    console.log(token_name);
    setshowContractName(token_name)
    setshowName(true);
  }

  const getTokenSymbol = async () =>{
    if (!signer) return alert("Please connect a wallet first!");
    const TokenContract = new ethers.Contract(contractAddress,abi,signer);
    const token_symbol = await TokenContract.symbol();
    console.log(token_symbol);
    setshowContractSymbol(token_symbol)
    setshowSymbol(true);
  }

  const getTokenSupply = async () =>{
    if (!signer) return alert("Please connect a wallet first!");
    const TokenContract = new ethers.Contract(contractAddress,abi,signer);
    const token_supply = await TokenContract.totalSupply();
    console.log(token_supply);
    setshowContractSupply(token_supply)
    setshowSupply(true);
  }

  const handleBalanceOf = async () =>{
    setshowBalanceOf(false);
    if (!signer) return alert("Please connect a wallet first!");
    const TokenContract = new ethers.Contract(contractAddress,abi,signer);
    const balance = await TokenContract.balanceOf(AddressBalanceOf);
    console.log(balance);
    setAddressBalanceOfAmount(balance);
    setshowBalanceOfAmount(true);
    setAddressBalanceOf("");
  }

  const handleTransferTo = async () => {
    setshowTransfer(false);
    if (!signer) return alert("Please connect a wallet first!");
    const TokenContract = new ethers.Contract(contractAddress,abi,signer);
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
      const TokenContract = new ethers.Contract(contractAddress, abi, signer);
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

      <div>
        0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
      </div>
      <div>
        0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
      </div>


      <div className="flex justify-end p-4">
        {!walletAddress ? (
          <div className="flex space-x-2">
            <button
              onClick={connectPrivateKey}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Connect Private Key
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

      {showName && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">
            <p className="text-xl font-bold">Token Name:</p>
            <p className="text-xl font-bold">{showContractName}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setshowName(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showSymbol && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">
            <p className="text-xl font-bold">Token Symbol:</p>
            <p className="text-xl font-bold">{showContractSymbol}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setshowSymbol(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {showSupply && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">
            <p className="text-xl font-bold">Token Supply:</p>
            <p className="text-xl font-bold">{showContractSupply}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setshowSupply(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Close
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

      {showContracts && (
        <div className="flex flex-col items-center mt-8 px-4">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-6xl">
            <h2 className="text-xl font-bold mb-4">Deployed Contracts</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
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
                  <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="p-3 font-mono text-sm">{contractAddress}</td>
                    <td className="p-3">
                      <button className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm" onClick={() => getTokenName()}>
                        Name
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm" onClick={() => getTokenSymbol()}>
                        Symbol
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm" onClick={() => getTokenSupply()}>
                        Supply
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm" onClick={() => setshowBalanceOf(true)}>
                        Check
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm" onClick={() => setshowTransfer(true)}>
                        Transfer
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm" onClick={() => setshowFaucet(true)}>
                        Mint
                      </button>
                    </td>
                  </tr>
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