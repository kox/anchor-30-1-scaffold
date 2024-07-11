import * as anchor from "@coral-xyz/anchor";
import { SplBug } from "../target/types/spl_bug";
import { assert } from 'chai';

describe("spl-bug", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.SplBug as anchor.Program<SplBug>;

  let marketplaceAccount = anchor.web3.Keypair.generate();

  const airdrop = async (publicKey, amount = 1 * anchor.web3.LAMPORTS_PER_SOL) => {
    const signature = await provider.connection.requestAirdrop(publicKey, amount);
    await provider.connection.confirmTransaction(signature);
  };

  before(async () => {
    // Airdrop to the keypairs
    await airdrop(marketplaceAccount.publicKey);
    /* await airdrop(listingAccount.publicKey);
    await airdrop(userAccount.publicKey);
    await airdrop(orderAccount.publicKey); */
  });

  it('Initializes the marketplace', async () => {
    await program.methods.initializeMarketplace({
      accounts: {
        marketplace: marketplaceAccount.publicKey,
        user: provider.wallet.publicKey,
      },
      signers: [marketplaceAccount],
    });

    const marketplace = await program.account.marketplace.fetch(marketplaceAccount.publicKey);
    assert.ok(marketplace.owner.equals(provider.wallet.publicKey));
    assert.equal(marketplace.listingCount.toNumber(), 0);
  });
});
