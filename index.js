const connect = document.getElementById('connect')
const fund = document.getElementById('fund')
const fundInput = document.getElementById('amount')
const balanceBtn  = document.getElementById('balance')
const balancText = document.getElementById('balanceText')
import {ethers} from './ethers-5.1.esm.min.js'
import {abi, contractAddress} from './constant.js'
const addressText = document.getElementById('address')

connect.addEventListener('click', async () => {
    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        connect.innerHTML = "Connected"  // Corrected line
        console.log("Metamask found")
       addressText.innerHTML = address
       
    } else {
        console.log("Go and install Metamask");
    }
    console.log(ethers)
})

fund.addEventListener('click', async () => {
    const ethAmount = fundInput.value

    if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer) 


      try{
        const contractResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
        await listenForTransactionMine(transactionResponse, provider)
  
      }catch(error){
        
      }

     
    }

})

balanceBtn.addEventListener('click', async () => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        let formattedBalance = ethers.utils.formatEther(balance);
        formattedBalance = parseFloat(formattedBalance);
        formattedBalance = Math.ceil(formattedBalance);
        formattedBalance = formattedBalance.toString();
        balancText.innerHTML = formattedBalance;
        
        console.log(formattedBalance); // Logging the rounded balance
    }
});



function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
     
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}