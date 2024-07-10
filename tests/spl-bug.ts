import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SplBug } from "../target/types/spl_bug";

describe("spl-bug", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SplBug as Program<SplBug>;

  
  it("Is initialized!", async () => {
    // Add your test here.
    const daoAccount = anchor.web3.Keypair.generate();

    await program.methods
      .initialize('TestDAO')
      .accounts({
        daoAccount: daoAccount.publicKey,
        payer: provider.wallet.publicKey,
      })
      .signers([daoAccount])
      .rpc();

    const account = await program.account.daoAccount.fetch(daoAccount.publicKey);
    console.log('DAO Name:', account.name);
    console.log('Owner:', account.owner.toString());
  });
 
  it('Creates a proposal with whitelist and votes', async () => {
    const daoAccount = anchor.web3.Keypair.generate();
    const proposalAccount = anchor.web3.Keypair.generate();
    const voter = provider.wallet.publicKey;
    const nonVoter = anchor.web3.Keypair.generate().publicKey;

    await program.methods
      .initialize('TestDAO')
      .accounts({
        daoAccount: daoAccount.publicKey,
        payer: provider.wallet.publicKey,
      })
      .signers([daoAccount])
      .rpc();

    const account = await program.account.daoAccount.fetch(daoAccount.publicKey);
    console.log('DAO Name:', account.name);
    console.log('Owner:', account.owner.toString());

    await program.methods
      .propose('Proposal Test 1', [voter])
      .accounts({
        payer: voter,
        daoAccount: daoAccount.publicKey,
        proposalAccount: proposalAccount.publicKey,
      })
      .signers([proposalAccount])
      .rpc();
      // .signer([proposalAccount])

      const proposal = await program.account.proposalAccount.fetch(proposalAccount.publicKey);
      console.log('Proposal: ', proposal.proposal);
      console.log('Whitelist: ', proposal.whitelist);    
  }); 

  it('Votes a proposal from a whitelisted user', async () => {
    const daoAccount = anchor.web3.Keypair.generate();
    const proposalAccount = anchor.web3.Keypair.generate();
    const voter = provider.wallet.publicKey;
    const nonVoter = anchor.web3.Keypair.generate().publicKey;

    await program.methods
      .initialize('TestDAO')
      .accounts({
        daoAccount: daoAccount.publicKey,
        payer: provider.wallet.publicKey,
      })
      .signers([daoAccount])
      .rpc();

    const account = await program.account.daoAccount.fetch(daoAccount.publicKey);
    console.log('DAO Name:', account.name);
    console.log('Owner:', account.owner.toString());

    await program.methods
      .propose('Proposal Test 1', [voter])
      .accounts({
        payer: voter,
        daoAccount: daoAccount.publicKey,
        proposalAccount: proposalAccount.publicKey,
      })
      .signers([proposalAccount])
      .rpc();
      // .signer([proposalAccount])

      const proposal = await program.account.proposalAccount.fetch(proposalAccount.publicKey);
      console.log('Proposal: ', proposal.proposal);
      console.log('Whitelist: ', proposal.whitelist);

    // Authorized vote
    await program.methods
      .vote()
      .accounts({
        proposalAccount: proposalAccount.publicKey,
        payer: provider.wallet.publicKey,
      })
      .rpc();
      
      let updatedProposal = await program.account.proposalAccount.fetch(proposalAccount.publicKey);
      console.log('Votes after authorized vote:', updatedProposal.votes);
  }); 

  it('Returns an error if an authorized user tries to vote', async () => {
    const daoAccount = anchor.web3.Keypair.generate();
    const proposalAccount = anchor.web3.Keypair.generate();
    const voter = provider.wallet.publicKey;
    const nonVoter = anchor.web3.Keypair.generate().publicKey;

    await program.methods
      .initialize('TestDAO')
      .accounts({
        daoAccount: daoAccount.publicKey,
        payer: provider.wallet.publicKey,
      })
      .signers([daoAccount])
      .rpc();

    const account = await program.account.daoAccount.fetch(daoAccount.publicKey);
    console.log('DAO Name:', account.name);
    console.log('Owner:', account.owner.toString());

    await program.methods
      .propose('Proposal Test 1', [voter])
      .accounts({
        payer: voter,
        daoAccount: daoAccount.publicKey,
        proposalAccount: proposalAccount.publicKey,
      })
      .signers([proposalAccount])
      .rpc();
      // .signer([proposalAccount])

      const proposal = await program.account.proposalAccount.fetch(proposalAccount.publicKey);
      console.log('Proposal: ', proposal.proposal);
      console.log('Whitelist: ', proposal.whitelist);

    try {
      // Authorized vote
      await program.methods
        .vote()
        .accounts({
          proposalAccount: proposalAccount.publicKey,
          payer: nonVoter.publicKey,
        })
        // .signer([nonVoter])
        .rpc();
      
      console.log('This message should not be seen');
    } catch(err) {
      console.log('Unauthorized vote error', err.toString());
    }
      
      /* let updatedProposal = await program.account.proposalAccount.fetch(proposalAccount.publicKey);
      console.log('Votes after authorized vote:', updatedProposal.votes); */
  })
});
